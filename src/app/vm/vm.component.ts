import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Vm, VmService} from '../vm/vm.service';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';

declare var Chart: any;
declare var $: any;
declare var jQuery: any;
declare var require: any;

@Component({
  selector: 'app-user',
  templateUrl: './vm.component.html',
  styleUrls: ['./vm.component.css']
})

export class VmComponent implements OnInit {

  public vms: Array<Vm> = [];
  public vmEntities: any;
  public translateEntities: any = [];

  public isMessage: boolean;
  private jquerySetting: boolean;

  public type: string = '';
  public vmName: string = '';
  public vmAlias: string = '';
  public interval: string = '';
  public timeGroup: string = '';
  public orgGuid: string = '';
  public spaceGuid: string = '';
  public spaceName: string = '';


  public sltChartInstances: string;
  public vmSummaryChartDate: '';
  public sltChartDefaultTimeRange: number;
  public sltChartGroupBy: number;

  public cpu_Chart: any = undefined;
  public memory_Chart: any = undefined;
  public diskIO_Chart: any = undefined;

  public cpuValueObject: Observable<any[]>;
  public memValueObject: Observable<any[]>;
  public diskValueObject: Observable<any[]>;
  public netValueObject: Observable<any[]>;

  constructor(private httpClient: HttpClient, private commonService: CommonService, private vmService: VmService, private log: NGXLogger) {

    this.vms = new Array<Vm>();
    this.vmInit();
  }

  ngOnInit() {
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript('../../assets/resources/js/common2.js')
        .done(function (script, textStatus) {
        })
        .fail(function (jqxhr, settings, exception) {
        });
    });
    if (this.jquerySetting) {
      $('.lauthOn').on('click', function () {
        $('.lauth_dl').toggleClass('on');
        $('#routeAddHostName').focus();
      });
      this.jquerySetting = false;
    }
    this.orgGuid = this.commonService.getCurrentOrgGuid();
    this.spaceGuid = this.commonService.getCurrentSpaceGuid();
  }

  refreshClick() {
    location.reload(true);
  }

  vmInit() {
    /*space 정의*/
    this.vmService.getVmSpace(this.commonService.getCurrentSpaceGuid()).subscribe(data => {
      this.vms = data.data[0];
      this.vmName = this.vms['vmNm'];
      this.spaceName = this.vms['vmSpaceName'];
      this.vmAlias = this.vms['vmAlias'];
      this.getVmMonitoring(this.vmName);
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoring(vmNmae: string) {
    /*VmMonitoringUsage*/
    this.type = 'day';
    this.interval = '40';
    this.timeGroup = '1';

    this.getVmMonitoringCpuUsage(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringMemUsage(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringCpuLatency(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringCpuCostop(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringMemActiveConsumed(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringMemSwap(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringDiskIOps(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringDiskTraffic(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringDiskLatency(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringNetUsage(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringNetTransmitReceive(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringNetError(vmNmae, this.type, this.interval, this.timeGroup);
  }

  getVmMonitoringCpuUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuUsage(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const canvas = 'lineCanvasCpuUsage';
      const label = 'usage';
      const text = 'CPU Usage';

      //TODO: valueObject != undefined
      if (valueObject == null) {
        this.getVmNoUsage(canvas, label, text);
      } else {
        this.cpuValueObject = data.results[0].series[0];

        $.each(this.cpuValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        const ctx = document.getElementById('lineCanvasCpuUsage');
        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataArray(chartDataData, text)
          }, options: {
            title: {
              display: true,
              text: 'Cpu Usage'
            }
          }
        });
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringCpuLatency(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuLatency(vmNmae, type, interval, timeGroup).subscribe(data => {
      /*lineChartMemory(data : x축, time : y축)*/
      const chartDataTime = [];
      const chartDataData = [];

      this.cpuValueObject = data.results[0].series[0];

      $.each(this.cpuValueObject['values'], function (index, value) {
        const date = require('moment');
        const chartFormat = date(value[0]).format('HH:MM');
        this.vmSummaryChartDate = chartFormat;

        chartDataTime.push(chartFormat);
        chartDataData.push(value[1]);
      });

      const ctx = document.getElementById('lineCanvasCpuLatency');
      this.sltChartInstances = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartDataTime,
          datasets: this.dataArray(chartDataData, 'latency')
        }, options: {
          title: {
            display: true,
            text: 'CPU Latency'
          }
        }
      });
    });
  }

  getVmMonitoringCpuCostop(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuCostopy(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const canvas = 'lineCanvasCpuCostop';
      const label = 'costop';
      const text = 'Cpu Costop';

      //TODO: valueObject != undefined
      if (valueObject == null) {

        this.getVmNoUsage(canvas, label, text);
      } else {
        this.cpuValueObject = data.results[0].series[0];

        $.each(this.cpuValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        const ctx = document.getElementById('lineCanvasCpuCostop');
        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataArray(chartDataData, text)
          }, options: {
            title: {
              display: true,
              text: 'CPU Costop'
            }
          }
        });
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringMemUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemUsage(vmNmae, type, interval, timeGroup).subscribe(data => {
      /*lineChartMemory(data : x축, time : y축)*/
      const chartDataTime = [];
      const chartDataData = [];
      const text = 'last';

      this.memValueObject = data.results[0].series[0];

      $.each(this.memValueObject['values'], function (index, value) {
        const date = require('moment');
        const chartFormat = date(value[0]).format('HH:MM');
        this.vmSummaryChartDate = chartFormat;

        chartDataTime.push(chartFormat);
        chartDataData.push(value[1]);
      });

      const ctx = document.getElementById('lineCanvasMemUsage');

      this.sltChartInstances = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartDataTime,
          datasets: this.dataArray(chartDataData, text)
        }, options: {
          title: {
            display: true,
            text: 'MEM Usage'
          }
        }
      });
    });
  }

  getVmMonitoringMemActiveConsumed(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemActiveConsumed(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data[0].results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const canvas = 'lineCanvasMemActiveConsumed';
      const label = 'active';
      const text = 'MEM Active vs Consumed ';

      //TODO: valueObject != undefined
      if (valueObject == null) {

        this.getVmNoUsage(canvas, label, text);
      } else {
        this.memValueObject = data.results[0].series[0];

        $.each(this.memValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        const ctx = document.getElementById('lineCanvasMemActiveConsumed');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataArray(chartDataData, label)
          }, options: {
            title: {
              display: true,
              text: text
            }
          }
        });
      }

    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringMemSwap(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemSwap(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const canvas = 'lineCanvasMemSwap';
      const label = 'swap';
      const text = 'MEM Swap';

      //TODO: valueObject != undefined
      if (valueObject == null) {
        this.getVmNoUsage(canvas, label, text);
      } else {
        this.memValueObject = data.results[0].series[0];

        $.each(this.memValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        const ctx = document.getElementById('lineCanvasMemSwap');


        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataArray(chartDataData, label)
          }, options: {
            title: {
              display: true,
              text: text
            }
          }
        });
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringDiskIOps(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringDiskIOps(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series[0];
      const chartDataTime = [];
      const chartDataData = [];
      const chartDataData2 = [];

      this.diskValueObject = data.results[0].series[0];

      $.each(this.diskValueObject['values'], function (index, value) {
        const date = require('moment');
        const chartFormat = date(value[0]).format('HH:MM');
        this.vmSummaryChartDate = chartFormat;

        chartDataTime.push(chartFormat);
        chartDataData.push(value[1]);
        chartDataData2.push(value[2]);
      });

      const ctx = document.getElementById('lineCanvasDiskIOps');

      this.sltChartInstances = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartDataTime,
          datasets: this.dataAMutiArray(chartDataData, chartDataData2, 'read', 'write')
        }, options: {
          title: {
            display: true,
            text: 'Disk IOps'
          }
        }
      });
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringDiskTraffic(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringDiskTraffic(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const chartDataData2 = [];

      this.diskValueObject = data.results[0].series[0];

      $.each(this.diskValueObject['values'], function (index, value) {
        const date = require('moment');
        const chartFormat = date(value[0]).format('HH:MM');
        this.vmSummaryChartDate = chartFormat;

        chartDataTime.push(chartFormat);
        chartDataData.push(value[1]);
        chartDataData2.push(value[2]);
      });
      const ctx = document.getElementById('lineCanvasDiskTraffic');

      this.sltChartInstances = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartDataTime,
          datasets:  this.dataAMutiArray(chartDataData, chartDataData2, 'read', 'write')
        }, options: {
          title: {
            display: true,
            text: 'Disk Traffic'
          }
        }
      });

    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringDiskLatency(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringDiskLatency(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const chartDataData2 = [];

      const text = 'Disk Latency';

      this.diskValueObject = data.results[0].series[0];

      $.each(this.diskValueObject['values'], function (index, value) {
        const date = require('moment');
        const chartFormat = date(value[0]).format('HH:MM');
        this.vmSummaryChartDate = chartFormat;

        chartDataTime.push(chartFormat);
        chartDataData.push(value[1]);
        chartDataData2.push(value[2]);
      });

      const ctx = document.getElementById('lineCanvasDiskLatency');

      this.sltChartInstances = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartDataTime,
          datasets: this.dataAMutiArray(chartDataData, chartDataData2, 'receive', 'transmit')
        }, options: {
          title: {
            display: true,
            text: text
          }
        }
      });
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringNetUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringNetUsage(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const chartDataData2 = [];
      const canvas = 'lineCanvasNetUsage';
      const label = 'usage';
      const text = 'NET Usage';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, label, text);
      } else {
        this.netValueObject = data.results[0].series[0];

        $.each(this.netValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        const ctx = document.getElementById('lineCanvasNetUsage');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataAMutiArray(chartDataData, chartDataData2, 'receive', 'transmit')
          }, options: {
            title: {
              display: true,
              text: text
            }
          }
        });
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringNetTransmitReceive(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringNetTransmitReceive(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const chartDataData2 = [];
      const canvas = 'lineCanvasNetTransmitReceive';
      const label = '';
      const text = 'NET Transmit/ Receive';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, label, text);
      } else {
        this.netValueObject = data.results[0].series[0];

        $.each(this.netValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
          chartDataData2.push(value[2]);
        });

        const ctx = document.getElementById('lineCanvasNetTransmitReceive');
        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataAMutiArray(chartDataData, chartDataData2, 'receive', 'transmit')
          }, options: {
            title: {
              display: true,
              text: text
            }
          }
        });
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringNetError(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringNetError(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const chartDataData2 = [];
      const chartDataData3 = [];
      const chartDataData4 = [];
      const canvas = 'lineCanvasNetErrors';
      const label = 'NEt Errors';
      const text = 'NEt Errors';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, label, text);
      } else {
        this.netValueObject = data.results[0].series[0];

        $.each(this.netValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
          chartDataData2.push(value[2]);
          chartDataData3.push(value[3]);
          chartDataData4.push(value[4]);
        });

        const ctx = document.getElementById('lineCanvasNetErrors');
        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataNetEArray(chartDataData, chartDataData2, chartDataData3, chartDataData4, 'drop_rx', 'drop_tx','error_rx', 'error_tx')
          }, options: {
            title: {
              display: true,
              text: text
            }
          }
        });
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmNoUsage(canvas, label, text) {
    const ctx = document.getElementById(canvas);
    this.sltChartInstances = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [0],
        datasets: [{
          borderColor: "#e8c3b9",
          fill: false,
          data: [''],
          label: label
        }
        ]
      }, options: {
        title: {
          display: true,
          text: text
        }
      }
    });
  }

  dataArray(chartDataData: any, label: string) {
    return [{
      borderColor: "#3cba9f",
      fill: false,
      data: chartDataData,
      label: label
    }];
  }

  dataAMutiArray(chartDataData: any, chartDataData2: any, label: string, label2: string) {
    return [{
      borderColor: "#3e95cd",
      fill: false,
      data: chartDataData,
      label: label
    }, {
      borderColor: "#8e5ea2",
      fill: false,
      data: chartDataData2,
      label: label2
    }];
  }

  dataNetEArray(chartDataData: any, chartDataData2: any, chartDataData3: any, chartDataData4: any, label1: string, label2: string, label3: string, label4: string) {
    return [{
      borderColor: "#3e95cd",
      fill: false,
      data: chartDataData,
      label: label1
    }, {
      borderColor: "#8e5ea2",
      fill: false,
      data: chartDataData2,
      label: label2
    }, {
      borderColor: "#c45850",
      fill: false,
      data: chartDataData3,
      label: label3
    },{
      borderColor: "#3cba9f",
      fill: false,
      data: chartDataData4,
      label: label4
    }];
  }
}
