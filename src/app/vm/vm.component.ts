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
    this.interval = '100';
    this.timeGroup = '1';

    this.getVmMonitoringCpuUsage(vmNmae, this.type, this.interval, this.timeGroup);
    this.getVmMonitoringMemUsage(vmNmae, this.type, this.interval, this.timeGroup);
  }

  getVmMonitoringMemUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringMemUsage(vmNmae, type, interval, timeGroup).subscribe(data => {
      /*lineChartMemory(data : x축, time : y축)*/
      let chartDataTime = [];
      let chartDataData = [];
      this.memValueObject = data.results[0].series[0];

      $.each(this.memValueObject['values'], function (index, value) {
        let date = require('moment');
        var chartFormat = date(value[0]).format('HH시 MM분 SS초');
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

      var ctx = document.getElementById('lineCanvasMem');

      this.sltChartInstances = new Chart(ctx,{
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
    });
  }

  getVmMonitoringCpuUsage(vmNmae: string, type: string, interval: string, timeGroup: string) {
    this.vmService.getVmMonitoringCpuUsage(vmNmae, type, interval, timeGroup).subscribe(data => {
      this.cpuValueObject = data.results[0].series[0];
      console.log(this.cpuValueObject)
    });
  }

}
