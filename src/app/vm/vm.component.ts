import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Vm, VmService} from '../vm/vm.service';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {DashboardComponent} from "../dashboard/dashboard.component";
import {DashboardService} from "../dashboard/dashboard.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

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
  public object: any = [];

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
  public sltVmUrl: string = '';
  public vmSelectedId: string = '';
  public vmCpuPer: number;
  public vmMemoryPer: number;
  public vmDiskPer: number;


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

  public vmValue: any;

  constructor(public translate: TranslateService, private router: Router, private httpClient: HttpClient, private dashboardService: DashboardService, private commonService: CommonService, private vmService: VmService, private log: NGXLogger) {

    this.vms = new Array<Vm>();
    this.type = 'day';
    this.vmSelectedId = opener.document.getElementById('showVm').value;
    this.vmInit();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.vm;
    });

    this.translate.get('vm').subscribe((res: string) => {
      this.translateEntities = res;
    });
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
    this.interval = '40';
    this.vmValue = '1';
  }

  refreshClick() {
    this.vmInit();
  }

  vmInit() {
    this.vmService.getVm(this.vmSelectedId).subscribe(data => {
      this.object = data.data;
      this.vms = [];
      if (data['RESULT'] === 'SUCCESS') {
        this.vms = data.data;
        this.vmName = this.vms['vmNm'];
        this.spaceName = this.vms['vmSpaceName'];
        this.vmAlias = this.vms['vmAlias'];
        //this.getVmMonitoring(this.vmName);
        this.chartTimeClick();
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  chartTimeClick() {
    switch (this.vmValue) {
      case '1': {
        this.vmFilter('min', '5');
        break;
      }
      case '2': {
        this.vmFilter('min', '15');
        break;
      }
      case '3': {
        this.vmFilter('min', '30');
        break;
      }
      case '4': {
        this.vmFilter('min', '60');
        break;
      }
      case '5': {
        this.vmFilter('min', '150');
        break;
      }
      case '6': {
        this.vmFilter('min', '350');
        break;
      }
      case '7': {
        this.vmFilter('hour', '12');
        break;
      }
      case '8': {
        this.vmFilter('day', '1');
        break;
      }
      case '9': {
        this.vmFilter('day', '2');
        break;
      }
      case '10': {
        this.vmFilter('day', '7');
        break;
      }
      case '11': {
        this.vmFilter('day', '30');
        break;
      }
    }
    this.getVmMonitoring(this.vmName)
  }

  vmFilter(_type: string, _timeGroup: string) {
    this.type = _type;
    this.timeGroup = _timeGroup
  }

  getVmMonitoring(vmNmae: string) {
    this.getVmMonitoringCpuUsage(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringCpuLatency(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringCpuCostop(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringMemUsage(vmNmae, this.type, this.interval, this.timeGroup);
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
      const text = 'CPU Usage';

      let size = data.length;
      let forEachCount = 0; //ArrLength

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
      }

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
          datasets: this.dataArray(chartDataData, 'usage')
        }, options: {
          title: {
            display: true,
            text: 'Cpu Usage'
          },
          scales: {
            yAxes: [{
              ticks: {
                callback: function (value, index) {
                  return value.toFixed(1) + '%';
                }
              }
            }]
          } //scales end
        }
      });
      return data;
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringCpuLatency(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuLatency(vmNmae, type, interval, timeGroup).subscribe(data => {
      /*lineChartMemory(data : x축, time : y축)*/
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const canvas = 'lineCanvasCpuLatency';
      const text = 'CPU Latency';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
      } else {
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
              text: text
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    return value.toFixed(1) + '%';
                  }
                }
              }]
            } //scales end
          }
        });
      }
      return data;
    });
  }

  getVmMonitoringCpuCostop(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuCostopy(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const canvas = 'lineCanvasCpuCostop';
      const text = 'Cpu Costop';

      //TODO: valueObject != undefined
      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
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
            datasets: this.dataArray(chartDataData, 'costop')
          }, options: {
            title: {
              display: true,
              text: text
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    return value.toFixed(1) + 'ms';
                  }
                }
              }]
            } //scales end
          }
        });
      }
      return data;
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringMemUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemUsage(vmNmae, type, interval, timeGroup).subscribe(data => {
      /*lineChartMemory(data : x축, time : y축)*/
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const canvas = 'lineCanvasMemUsage';
      const text = 'Memory Usage';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
      } else {
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
            datasets: this.dataArray(chartDataData, 'last')
          }, options: {
            title: {
              display: true,
              text: text
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    return value.toFixed(1) + '%';
                  }
                }
              }]
            } //scales end
          }
        });
      }
      return data;
    });
  }

  getVmMonitoringMemActiveConsumed(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemActiveConsumed(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data[0].results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const chartDataData2 = [];
      const canvas = 'lineCanvasMemActiveConsumed';
      const text = 'Memory Active vs Consumed ';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
      } else {
        this.memValueObject = data[0].results[0].series[0];

        $.each(this.memValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
          chartDataData2.push(value[2]);
        });

        const ctx = document.getElementById('lineCanvasMemActiveConsumed');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataAMutiArray(chartDataData, chartDataData2, 'active', 'consumed')
          }, options: {
            title: {
              display: true,
              text: text
            }, //title end
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    var memory;
                    memory = value.toString();
                    var memoryBytes = parseInt(memory);
                    var s = ['KB', 'MB', 'GB', 'TB', 'PB'];
                    var e = Math.floor(Math.log(memoryBytes) / Math.log(1024));
                    if (e === Number.NEGATIVE_INFINITY) {
                      memory = "0 " + s[0];
                    } else {
                      memory = (memoryBytes / Math.pow(1024, Math.floor(e))).toFixed(1) + " " + s[e];
                    }
                    return memory;
                  }
                }
              }]
            } //scales end
          },

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
      const text = 'Memory Swap';

      //TODO: valueObject != undefined
      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
      } else {
        this.memValueObject = data.results[0].series[0];

        $.each(this.memValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
          //chartDataData2.push(value[2]);
        });

        const ctx = document.getElementById('lineCanvasMemSwap');


        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataArray(chartDataData, 'swap')
          }, options: {
            title: {
              display: true,
              text: text
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    var memory;
                    memory = value.toString();
                    var memoryBytes = parseInt(memory);
                    var s = ['KB', 'MB', 'GB', 'TB', 'PB'];
                    var e = Math.floor(Math.log(memoryBytes) / Math.log(1024));
                    if (e === Number.NEGATIVE_INFINITY) {
                      memory = "0 " + s[0];
                    } else {
                      memory = (memoryBytes / Math.pow(1024, Math.floor(e))).toFixed(1) + " " + s[e];
                    }
                    return memory;
                  }
                }
              }]
            } //scales end
          }
        });
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringDiskIOps(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringDiskIOps(vmNmae, type, interval, timeGroup).subscribe(data => {
      const valueObject = data.results[0].series;
      const chartDataTime = [];
      const chartDataData = [];
      const chartDataData2 = [];
      const canvas = 'lineCanvasDiskIOps';
      const text = 'Disk IOps';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
      } else {
        this.diskValueObject = data.results[0].series[0];

        $.each(this.diskValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
          chartDataData2.push(value[2]);
        });

        const ctx = document.getElementById(canvas);

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataAMutiArray(chartDataData, chartDataData2, 'read', 'write')
          }, options: {
            title: {
              display: true,
              text: text
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    return value.toFixed(1) + 'ops';
                  }
                }
              }]
            } //scales end
          }
        });
      }
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
      const canvas = 'lineCanvasDiskTraffic';
      const text = 'Disk Usage';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
      } else {
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
            datasets: this.dataAMutiArray(chartDataData, chartDataData2, 'read', 'write')
          }, options: {
            title: {
              display: true,
              text: text
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    var disk;
                    disk = value.toString();
                    var diskBytes = parseInt(disk);
                    var s = ['KB', 'MB', 'GB', 'TB', 'PB'];
                    var e = Math.floor(Math.log(diskBytes) / Math.log(1024));
                    if (e === Number.NEGATIVE_INFINITY) {
                      disk = "0 " + s[0];
                    } else {
                      disk = (diskBytes / Math.pow(1024, Math.floor(e))).toFixed(1) + " " + s[e];
                    }
                    return disk;
                  }
                }
              }]
            } //scales end
          }
        });
      }
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
      const canvas = 'lineCanvasDiskLatency';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
      } else {
        this.diskValueObject = data.results[0].series[0];

        $.each(this.diskValueObject['values'], function (index, value) {
          const date = require('moment');
          const chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
          chartDataData2.push(value[2]);
        });

        const ctx = document.getElementById(canvas);
        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: this.dataAMutiArray(chartDataData, chartDataData2, 'receive', 'transmit')
          }, options: {
            title: {
              display: true,
              text: text
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    return value.toFixed(1) + 'ms';
                  }
                }
              }]
            } //scales end
          }
        });
      }
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
      const text = 'NET Usage';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
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
            datasets: this.dataArray(chartDataData, 'usage')
          }, options: {
            title: {
              display: true,
              text: text
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    var net;
                    net = value.toString();
                    var netBytes = parseInt(net);
                    var s = ['KB', 'MB', 'GB', 'TB', 'PB'];
                    var e = Math.floor(Math.log(netBytes) / Math.log(1024));
                    if (e === Number.NEGATIVE_INFINITY) {
                      net = "0 " + s[0];
                    } else {
                      net = (netBytes / Math.pow(1024, Math.floor(e))).toFixed(1) + " " + s[e];
                    }
                    return net;
                  }
                }
              }]
            } //scales end
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
      const text = 'NET Transmit/ Receive';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
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
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback: function (value, index) {
                    var net;
                    net = value.toString();
                    var netBytes = parseInt(net);
                    var s = ['KB', 'MB', 'GB', 'TB', 'PB'];
                    var e = Math.floor(Math.log(netBytes) / Math.log(1024));
                    if (e === Number.NEGATIVE_INFINITY) {
                      net = "0 " + s[0];
                    } else {
                      net = (netBytes / Math.pow(1024, Math.floor(e))).toFixed(1) + " " + s[e];
                    }
                    return net;
                  }
                }
              }]
            } //scales end
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
      const text = 'NET Errors';

      if (valueObject == null) {
        this.getVmNoUsage(canvas, text);
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
            datasets: this.dataNetEArray(chartDataData, chartDataData2, chartDataData3, chartDataData4, 'drop_rx', 'drop_tx', 'error_rx', 'error_tx')
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

  getVmNoUsage(canvas, text) {
    const ctx = document.getElementById(canvas);
    this.sltChartInstances = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [0],
        datasets: [{
          borderColor: "#c45850",
          fill: true,
          data: [''],
          label: 'No Data'
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
      borderColor: "rgba(151,187,205,0.2)",
      fillColor: "rgba(151,187,205,0.2)",
      backgroundColor: "rgba(75,192,192,0.4)",
      strokeColor: "rgba(60,91,87,1)",
      pointColor: "rgba(60,91,87,1)",
      pointStrokeColor: "#58606d",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
      data: chartDataData,
      label: label,
    }];
  }

  dataAMutiArray(chartDataData: any, chartDataData2: any, label: string, label2: string) {
    return [{
      //borderColor: "#3e95cd",
      //fill: true,
      borderColor: "rgba(151,187,205,0.2)",
      fillColor: "rgba(151,187,205,0.2)",
      backgroundColor: "rgba(75,192,192,0.4)",
      strokeColor: "rgba(60,91,87,1)",
      pointColor: "rgba(60,91,87,1)",
      pointStrokeColor: "#58606d",
      data: chartDataData,
      label: label
    }, {
      borderColor: "#e8c3b9",
      fill: true,
      data: chartDataData2,
      label: label2
    }];
  }

  dataNetEArray(chartDataData: any, chartDataData2: any, chartDataData3: any, chartDataData4: any, label1: string, label2: string, label3: string, label4: string) {
    return [{
      borderColor: "#3e95cd",
      fill: true,
      data: chartDataData,
      label: label1
    }, {
      borderColor: "#8e5ea2",
      fill: true,
      data: chartDataData2,
      label: label2
    }, {
      borderColor: "#e8c3b9",
      fill: true,
      data: chartDataData3,
      label: label3
    }, {
      borderColor: "#3cba9f",
      fill: true,
      data: chartDataData4,
      label: label4
    }];
  }
}
