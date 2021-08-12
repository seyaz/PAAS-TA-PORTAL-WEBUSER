import { Injectable } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {isUndefined} from "util";
import {CommonService} from "../common/common.service";
declare var $: any;


declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class DocumentService {

  apiversion = appConfig['apiversion'];

  buildpacksguide: Array<any> = [];
  servicepacksguide: Array<any> = [];
  lasttime: number;
  check: boolean = true;
  viewbuildpackguide: boolean = true;
  viewservicepackguide: boolean = true;

  viewbuildpacksguide: any = [];
  viewservicepacksguide: any = [];


  buildPackfilter: string = '';
  servicePackfilter: string = '';
  first: string = 'cur';
  classname: string;
  navview: string;
  translateEntities: any;


  constructor(private common: CommonService, private log: NGXLogger, private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.document;
    });
    this.translate.get('document').subscribe((res: string) => {
      this.translateEntities = res;
    });
  }
  //
  // /*servicepack, buildpack을 화면에 보여준다*/
  // viewPacks(value, value2, value3) {
  //   this.viewbuildpackguide = value;
  //   this.viewservicepackguide = value2;
  //   if (this.viewbuildpackguide) {
  //     this.viewbuildpacksguide;
  //   }
  //   if (this.viewservicepackguide) {
  //     this.viewservicepacksguide;
  //   }
  // }

  //
  // buildPackFilter() {
  //   if (this.buildPackfilter !== '') {
  //     this.viewbuildpacksguide = this.buildpacksguide.filter(data => {
  //       if (data.classification === this.buildPackfilter) {
  //         return data;
  //       }
  //     });
  //   } else {
  //     this.viewbuildpacksguide = this.buildpacksguide;
  //   }
  // }

  set navView(value) {
    this.navview = value;
  }


  // get navView() {
  //   if (!isUndefined(this.translateEntities)) {
  //     if (!isUndefined(this.navview)) {
  //       return this.translateEntities.nav[this.navview];
  //     }
  //     return this.translateEntities.nav.viewAll;
  //   }
  //   return '';
  // }

  servicePackFilter() {
    if (this.servicePackfilter !== '') {
      this.viewservicepacksguide = this.servicepacksguide.filter(data => {
        if (data.classification === this.servicePackfilter) {
          return data;
        }
      });
    } else {
      this.viewservicepacksguide = this.servicepacksguide;
    }
  }

  isLoading(value) {
    this.common.isLoading = value;
  }

  alertMessage(value, result) {
    this.common.alertMessage(value, result);
  }

  // /*catalogNumber를 가져온다*/
  // getCurrentCatalogNumber() {
  //   return this.common.getCurrentCatalogNumber();
  // }


  // 2021-07-30 빌드팩 정보를 가져온다
  getBuildPacks() {
    return this.common.doGet('/portalapi/' + this.apiversion + '/buildpacks', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }


  //이미지 정보를 불러온다.
  getImg(url: string) {
    return this.common.doGet(url, this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  //가이드 리스트를 가져온다
  getGuides(url: string){
    return this.common.doGet( url, this.common.getToken()).map((res: Response) => {
          return res;
        });
      }


 //가이드를 가져온다.
  getGuide(url:string){
    return this.common.doGet(url, this.common.getToken()).map((res: any) => {
          return res;
        });
      }


}
