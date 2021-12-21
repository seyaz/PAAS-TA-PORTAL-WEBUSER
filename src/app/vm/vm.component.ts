import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Vm, VmService} from "../vm/vm.service";
import {HttpClient} from "@angular/common/http";
import {CommonService} from "../common/common.service";
import {NGXLogger} from "ngx-logger";
import {Organization} from "../model/organization";
import {Space} from "../model/space";

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
  /*query*/
  private jquerySetting: boolean;
  public sltChartInstances: string;

  /*vm*/
  public vm: Observable<Vm>;
  public translateEntities: any = [];

  /*org sapce*/
  public currentOrg: string;
  public orgs: Array<Organization>;
  public org: Organization;
  public spaces: Array<Space>;
  public currentSpace: string;

  /*vm.component.html*/
  @ViewChild('lineCanvasCPU') lineCanvasCPU: ElementRef;
  public lineChartCPU: any;

  constructor(private httpClient: HttpClient, private commonService: CommonService, private vmService: VmService, private log: NGXLogger) {;
    this.org = null;
    this.orgs = [];
    this.spaces = [];

    this.currentSpace = '';
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

    this.lineChartMethod_CPU();


  }

  lineChartMethod_CPU() {
    this.lineCanvasCPU = new Chart(this.lineCanvasCPU.nativeElement, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
        datasets: [
          {
            label: 'CPU Usage',
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
            data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15], //변경되는 값
            spanGaps: false,
          }
        ]
      }
    });
  }


  refreshClick(){
    this.ngOnInit();
  }

  public appEntities: any;
  public servicesEntities: any;



  /*
  vmInfo(){
    this.vmService.vminfo().subscribe(data => {
      this.log.debug(data);
    })
  }
  */

}
