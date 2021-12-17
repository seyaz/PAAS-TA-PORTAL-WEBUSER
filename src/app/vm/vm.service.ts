import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {Router} from "@angular/router";

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class VmService {
  constructor(
    private http: HttpClient, private common: CommonService, private logger: NGXLogger, private router: Router) {
  }
  apiversion = appConfig['apiversion'];

  vminfo() {
    return this.common.doGet('/commonapi/' + this.apiversion + '/vm', this.common.getToken()).map((res: any) => {
      return res;
    });
  }

}

 export class Vm{
  vmId: string;
  vmNm : string;
  vmOrgGuid : string;
  vmOrgName : string;
  vmSpaceGuid : string;
  vmSpaceName : string;
  useYn : boolean;
}
