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

  buildpacks: Array<any> = [];
  starterpacks: Array<any> = [];
  recentpacks: Array<any> = [];
  servicepacks: Array<any> = [];
  lasttime: number;
  check: boolean = true;
  viewstartpack: boolean = true;
  viewbuildpack: boolean = true;
  viewservicepack: boolean = true;

  viewstarterpacks: any = [];
  viewbuildpacks: any = [];
  viewservicepacks: any = [];


  buildPackfilter: string = '';
  servicePackfilter: string = '';
  first: string = 'cur';
  classname: string;
  navview: string;
  translateEntities: any;
  autoSearch: boolean = false;

  constructor(private common: CommonService, private log: NGXLogger, private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.document;
    });
    this.translate.get('document').subscribe((res: string) => {
      this.translateEntities = res;
    });
  }

  /*servicepack, buildpack을 화면에 보여준다*/
  viewPacks(value, value2, value3) {
    this.viewstartpack = value;
    this.viewbuildpack = value2;
    this.viewservicepack = value3;
    if (this.viewstartpack) {
      this.viewstarterpacks;
    }
    if (this.viewbuildpack) {
      this.viewbuildpacks;
    }
    if (this.viewservicepack) {
      this.viewservicepacks;
    }
  }


  buildPackFilter() {
    if (this.buildPackfilter !== '') {
      this.viewbuildpacks = this.buildpacks.filter(data => {
        if (data.classification === this.buildPackfilter) {
          return data;
        }
      });
    } else {
      this.viewbuildpacks = this.buildpacks;
    }
  }

  set navView(value) {
    this.navview = value;
  }


  get navView() {
    if (!isUndefined(this.translateEntities)) {
      if (!isUndefined(this.navview)) {
        return this.translateEntities.nav[this.navview];
      }
      return this.translateEntities.nav.viewAll;
    }
    return '';
  }

  servicePackFilter() {
    if (this.servicePackfilter !== '') {
      this.viewservicepacks = this.servicepacks.filter(data => {
        if (data.classification === this.servicePackfilter) {
          return data;
        }
      });
    } else {
      this.viewservicepacks = this.servicepacks;
    }
  }

  isLoading(value) {
    this.common.isLoading = value;
  }

  alertMessage(value, result) {
    this.common.alertMessage(value, result);
  }

  /*catalogNumber를 가져온다*/

  getCurrentCatalogNumber() {
    return this.common.getCurrentCatalogNumber();
  }

  getServiceInstance(url: string) {
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }


  getImg(url: string) {
    return this.common.doStorageGet(url, null).map((res: any) => {
      return res;
    });
  }


  upload() {
    return this.common.doGet('/commonapi/v2/app/uploadsfile', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  // 2021-07-30 빌드팩 정보를 가져온다
  getBuildPacks() {
    return this.common.doGet('/portalapi/' + this.apiversion + '/buildpacks', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  // 2021-07-30 developpack 정보를 가져온다.
  getDevelopPackList() {
    return this.common.doGet('/commonapi/v2/developpacks' , this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

}
