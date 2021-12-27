import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Vm, VmService} from "../vm/vm.service";
import {HttpClient} from "@angular/common/http";
import {CommonService} from "../common/common.service";
import {NGXLogger} from "ngx-logger";
import {isNullOrUndefined} from "util";

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
  public interval: string = '';
  public timeGroup: string = '';
  public orgGuid: string = '';
  public spaceGuid: string = '';
  public spaceName: string = '';

  public sltChartInstances: string;
  public vmSummaryChartDate: string;
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
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
        })
        .fail(function (jqxhr, settings, exception) {
        });
    });
    if (this.jquerySetting) {
      $(".lauthOn").on("click", function () {
        $(".lauth_dl").toggleClass("on");
        $("#routeAddHostName").focus();
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

  getVmNoUsage(canvas, label) {
    var ctx = document.getElementById(canvas);
    this.sltChartInstances = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [0],
        datasets: [
          {
            label: label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0],
            spanGaps: false,
          }
        ]
      }
    });
  }

  getVmMonitoringCpuUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuUsage(vmNmae, type, interval, timeGroup).subscribe(data => {
      let valueObject = data.results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      //TODO: valueObject != undefined
      if (valueObject == null) {
        let canvas = 'lineCanvasCpuUsage';
        let label = 'CPU Usage';
        this.getVmNoUsage(canvas, label);
      } else {
        this.cpuValueObject = data.results[0].series[0];

        $.each(this.cpuValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();


        if (datasetsArray.length != 0)
          datasetsArray = [{
            label: this.memValueObject['name'],
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
            data: chartDataData,
          }];

        var ctx = document.getElementById('lineCanvasCpuUsage');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: this.memValueObject['name'],
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringCpuLatency(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuLatency(vmNmae, type, interval, timeGroup).subscribe(data => {
      /*lineChartMemory(data : x축, time : y축)*/
      let chartDataTime = [];
      let chartDataData = [];

      this.cpuValueObject = data.results[0].series[0];

      $.each(this.cpuValueObject['values'], function (index, value) {
        let date = require('moment');
        var chartFormat = date(value[0]).format('HH:MM');
        this.vmSummaryChartDate = chartFormat;

        chartDataTime.push(chartFormat);
        chartDataData.push(value[1]);
      });

      var datasetsArray = new Array();

      if (datasetsArray.length != 0)
        datasetsArray = [{
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          spanGaps: false,
        }];

      var ctx = document.getElementById('lineCanvasCpuLatency');

      this.sltChartInstances = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartDataTime,
          datasets: [
            {
              label: 'CPU Latency',
              datasets: datasetsArray,
              data: chartDataData,
            }
          ]
        }
      })
    });
  }

  getVmMonitoringCpuCostop(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuCostopy(vmNmae, type, interval, timeGroup).subscribe(data => {
      let valueObject = data.results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      //TODO: valueObject != undefined
      if (valueObject == null) {
        let canvas = 'lineCanvasCpuCostop';
        let label = 'Cpu Costop';
        this.getVmNoUsage(canvas, label);
      } else {
        this.cpuValueObject = data.results[0].series[0];

        $.each(this.cpuValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();

        if (datasetsArray.length != 0)
          datasetsArray = [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          }];

        var ctx = document.getElementById('lineCanvasCpuCostop');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: 'Cpu Costop',
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }
    }, error => {
      this.commonService.isLoading = false;
    });

  }

  getVmMonitoringMemUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemUsage(vmNmae, type, interval, timeGroup).subscribe(data => {
      /*lineChartMemory(data : x축, time : y축)*/
      let chartDataTime = [];
      let chartDataData = [];
      let size = data.length;

      this.memValueObject = data.results[0].series[0];

      $.each(this.memValueObject['values'], function (index, value) {
        let date = require('moment');
        var chartFormat = date(value[0]).format('HH:MM');
        this.vmSummaryChartDate = chartFormat;

        chartDataTime.push(chartFormat);
        chartDataData.push(value[1]);
      });

      var datasetsArray = new Array();

      if (datasetsArray.length != 0)
        datasetsArray = [{
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          spanGaps: false,
        }];

      var ctx = document.getElementById('lineCanvasMemUsage');

      this.sltChartInstances = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartDataTime,
          datasets: [
            {
              label: 'MEM Usage',
              datasets: datasetsArray,
              data: chartDataData,
            }
          ]
        }
      })
    });
  }

  getVmMonitoringMemActiveConsumed(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemActiveConsumed(vmNmae, type, interval, timeGroup).subscribe(data => {

      let valueObject = data[0].results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      //TODO: valueObject != undefined
      if (valueObject == null) {
        let canvas = 'lineCanvasMemActiveConsumed';
        let label = 'MEM Active vs Consumed ';
        this.getVmNoUsage(canvas, label);
      } else {
        this.memValueObject = data.results[0].series[0];

        $.each(this.memValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();

        if (datasetsArray.length != 0)
          datasetsArray = [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          }];

        var ctx = document.getElementById('lineCanvasMemActiveConsumed');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: 'MEM Active vs Consumed',
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }

    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringMemSwap(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemSwap(vmNmae, type, interval, timeGroup).subscribe(data => {

      let valueObject = data.results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      //TODO: valueObject != undefined
      if (valueObject == null) {
        let canvas = 'lineCanvasMemSwap';
        let label = 'MEM Swap';
        this.getVmNoUsage(canvas, label);
      } else {
        this.memValueObject = data.results[0].series[0];

        $.each(this.memValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();

        if (datasetsArray.length != 0)
          datasetsArray = [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          }];

        var ctx = document.getElementById('lineCanvasMemSwap');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: 'MEM Swap',
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringDiskIOps(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringDiskIOps(vmNmae, type, interval, timeGroup).subscribe(data => {
      console.log("getVmMonitoringDiskIOps");
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringDiskTraffic(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringDiskTraffic(vmNmae, type, interval, timeGroup).subscribe(data => {

      let valueObject = data.results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      //TODO: valueObject != undefined
      if (valueObject == null) {
        let canvas = 'lineCanvasDiskTraffic';
        let label = 'Storage Traffic';
        this.getVmNoUsage(canvas, label);
      } else {
        this.diskValueObject = data.results[0].series[0];

        $.each(this.diskValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();

        if (datasetsArray.length != 0)
          datasetsArray = [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          }];

        var ctx = document.getElementById('lineCanvasDiskTraffic');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: 'Storage Traffic',
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringDiskLatency(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringDiskLatency(vmNmae, type, interval, timeGroup).subscribe(data => {

      let valueObject = data.results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      if (valueObject == null) {
        let canvas = 'lineCanvasDiskLatency';
        let label = 'Storage Latency';
        this.getVmNoUsage(canvas, label);
      } else {
        this.diskValueObject = data.results[0].series[0];

        $.each(this.diskValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();

        if (datasetsArray.length != 0)
          datasetsArray = [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          }];

        var ctx = document.getElementById('lineCanvasDiskLatency');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: 'Storage Traffic',
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringNetUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringNetUsage(vmNmae, type, interval, timeGroup).subscribe(data => {

      let valueObject = data.results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      if (valueObject == null) {
        let canvas = 'lineCanvasNetUsage';
        let label = 'NET Usage';
        this.getVmNoUsage(canvas, label);
      } else {
        this.netValueObject = data.results[0].series[0];

        $.each(this.netValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();

        if (datasetsArray.length != 0)
          datasetsArray = [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          }];

        var ctx = document.getElementById('lineCanvasNetUsage');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: 'NET Usage',
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringNetTransmitReceive(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringNetTransmitReceive(vmNmae, type, interval, timeGroup).subscribe(data => {

      let valueObject = data.results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      if (valueObject == null) {
        let canvas = 'lineCanvasNetTransmitReceive';
        let label = 'NET Transmit/ Receive';
        this.getVmNoUsage(canvas, label);
      } else {
        this.netValueObject = data.results[0].series[0];

        $.each(this.netValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();

        if (datasetsArray.length != 0)
          datasetsArray = [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          }];

        var ctx = document.getElementById('lineCanvasNetTransmitReceive');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: 'NET Transmit/ Receive',
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

  getVmMonitoringNetError(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringNetError(vmNmae, type, interval, timeGroup).subscribe(data => {

      let valueObject = data.results[0].series;
      let chartDataTime = [];
      let chartDataData = [];

      if (valueObject == null) {
        let canvas = 'lineCanvasNetErrors';
        let label = 'NEt Errors';
        this.getVmNoUsage(canvas, label);
      } else {
        this.netValueObject = data.results[0].series[0];

        $.each(this.netValueObject['values'], function (index, value) {
          let date = require('moment');
          var chartFormat = date(value[0]).format('HH:MM');
          this.vmSummaryChartDate = chartFormat;

          chartDataTime.push(chartFormat);
          chartDataData.push(value[1]);
        });

        var datasetsArray = new Array();

        if (datasetsArray.length != 0)
          datasetsArray = [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
          }];

        var ctx = document.getElementById('lineCanvasNetErrors');

        this.sltChartInstances = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartDataTime,
            datasets: [
              {
                label: 'NEt Errors',
                datasets: datasetsArray,
                data: chartDataData,
              }
            ]
          }
        })
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }

}
