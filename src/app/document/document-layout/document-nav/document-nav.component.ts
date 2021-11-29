import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {isNullOrUndefined, isUndefined} from "util";
import {DocumentService} from "../../document.service";
import {DOCUMENTURLConstant} from "../../common/document.constant";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-document-nav',
  templateUrl: './document-nav.component.html',
  styleUrls: ['../../document.component.css']
})
export class DocumentNavComponent implements OnInit {
  translateEntities : any;
  //serviceGuideList : string;
  serviceGuide: string;
  catalog : string;
  summary : string;
  devGuide: string;
  guides: Array<any> = new Array<any>();
  guideEntities : Array<any> = new Array<any>();
  serviceGuideEntities : Array<any> = new Array<any>();
  devGuideEntities : Array<any> = new Array<any>();

  constructor(public documentService: DocumentService, public router: Router) {}

  ngOnInit() {
    this.navStyle(1);
  }

  viewMain(number) {
    this.router.navigate(['document']);
    this.documentService.navView = 'viewAll';
    this.navStyle(number);
    this.classNavSetting(number);
    // this.documentService.serviceguidefilter = '';
    // this.documentService.serviceGuideFilter();
    // this.documentService.devguidefilter = '';
    // this.documentService.devGuideFilter();
  }

  viewServiceGuide(number) {
    if (this.router.url !== '/document') {
      this.documentService.check = false;
      this.documentService.classname = '#nav_second';
    }
    this.router.navigate(['document']);
    this.documentService.viewPacks(true, false);
    this.navStyle(number);
    this.classNavSetting(number);
    if (number === 2) {
      this.getServiceGuideList();
    }
  }

  viewDevGuide(number) {
    if (this.router.url !== '/document') {
      this.documentService.check = false;
      this.documentService.classname = '#nav_third';
    }
    this.router.navigate(['document']);
    this.documentService.viewPacks(false, true);

    if (number === 4) {
      this.getDevGuideList();
    }
    this.navStyle(number);
    this.classNavSetting(number);
  }

  getServiceGuideList(){
    this.serviceGuide = '서비스 설치 가이드 A';
    this.catalog = 'Y';
    this.documentService.getGuide('/commonapi/v2/guides').subscribe(data => {
      this.guideEntities = data['data'];
      for (var i = 0; i < this.guideEntities.length; i++) {
        if (this.serviceGuide == data['data'][i]['gubun2'] && this.catalog == data['data'][i]['useYn']) {
          this.serviceGuideEntities = data['data'][i]['name'];
        }
      }
    }, error => {
      this.documentService.alertMessage("No Data", false);
    });
  }

  getDevGuideList(){
    this.devGuide = '서비스 설치 가이드 B';
    this.catalog = 'Y';
    this.documentService.getGuide('/commonapi/v2/guides').subscribe(data => {
      this.guideEntities = data['data'];
      for (var i = 0; i < this.guideEntities.length; i++) {
        if (this.devGuide == data['data'][i]['gubun2'] &&  this.catalog == data['data'][i]['useYn']) {
          this.devGuideEntities = data['data'][i]['name'];
        }
      }
    }, error => {
      this.documentService.alertMessage("No Data", false);
    });
  }

  navStyle(number){
    let max = 5;
    let min = 1;
    for(min; min <= max; min++){
      if(number === min){
        $("#document_nav"+min).css('line-height', '54px');
        $("#document_nav"+min).css('color', '#fff');
        $("#document_nav"+min).css('background-color', '#32798c');
        $("#document_nav"+min).css('margin-bottom', '10px');
        $("#document_nav"+min).css('cursor', 'cursor');
        $("#document_nav"+min).css('font-size', '16px');
      }else {
        $("#document_nav"+min).css('line-height', '');
        $("#document_nav"+min).css('color', '');
        $("#document_nav"+min).css('background-color', '');
        $("#document_nav"+min).css('margin-bottom', '');
        $("#document_nav"+min).css('cursor', '');
        $("#document_nav"+min).css('font-size', '');
      }
    }
  }

  classNavSetting(number){
    $('#nav_first').attr('class','');
    $('#nav_second').attr('class','');
    $('#nav_third ').attr('class','');
    if(number == 1){
      $('#nav_first').attr('class','cur');
    } else if(number > 1 && number < 3){
      $('#nav_second').attr('class','cur');
    } else if(number > 3 && number < 5){
      $('#nav_third ').attr('class','cur');
    }
  }
}
