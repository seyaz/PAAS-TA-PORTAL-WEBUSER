import { Injectable } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {isUndefined} from "util";
import {CommonService} from "../common/common.service";
import {errorComparator} from "tslint/lib/verify/lintError";
declare var $: any;


declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class DocumentService {

  apiversion = appConfig['apiversion'];

  service : Array<any> = [];
  dev : Array<any> = [];

  viewserviceguides  : any = [];
  viewdevguides  : any = [];

  first: string = 'cur';
  check: boolean = true;
  viewserviceguide : boolean = true;
  viewdevguide : boolean = true;

  serviceguidefilter : string = '';
  devguidefilter : string = '';

  classname: string;
  navview: string;
  translateEntities: any;

  serviceGuideList: string;

  constructor(private common: CommonService, private log: NGXLogger, private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.document;
    });
    this.translate.get('document').subscribe((res: string) => {
      this.translateEntities = res;
    });
  }

  set navView(value) {
    this.navview = value;
  }

  viewPacks(value, value2){
    this.viewserviceguide  = value;
    this.viewdevguide  = value2;
    if(this.viewserviceguide){
      this.viewserviceguide;
    }
    if(this.viewdevguide){
      this.viewdevguide;
    }
  }

  serviceGuideFilter(){
    if(this.serviceguidefilter !== ''){
      this.viewserviceguides = this.service.filter(data => { if(data.classification === this.serviceGuideFilter){
        return data;
      }});
    }
    else {
      this.viewserviceguides = this.service;
    }
  }

  devGuideFilter(){
    if(this.devguidefilter !== ''){
      this.viewdevguides = this.dev.filter(data => { if(data.classification === this.devGuideFilter){
        return data;
      }});
    }
    else {
      this.viewdevguides = this.dev;
    }
  }


  isLoading(value) {
    this.common.isLoading = value;
  }

  alertMessage(value, result) {
    this.common.alertMessage(value, result);
  }


  getImg(url: string) {
    return this.common.doGet(url, this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  getGuides(url: string){
    return this.common.doGet( url, this.common.getToken()).map((res: Response) => {
          return res;
        });
      }

  getGuide(url:string){
    return this.common.doGet(url, this.common.getToken()).map((res: any) => {
          return res;
        });
      }


}
