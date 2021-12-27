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
    private http: HttpClient, private commonService: CommonService, private router: Router) {
  }
  apiversion = appConfig['apiversion'];

  getVm() {
    return this.commonService.doGet('/commonapi/v2/vm', this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  getVmSummary(orgId:string, spaceId: string) {
    return this.commonService.doGet('/commonapi/v2/vm/guid'+"?orgGuid="+orgId+"&spaceGuid="+spaceId, this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  getVmSpace(spaceId: string) {
    return this.commonService.doGet('/commonapi/v2/vm/space/' + spaceId, this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  getVmMonitoringMemUsage(vmName: string, type: String,interval: string, timeGroup: string ) {
    return this.commonService.doGet('/commonapi/v2/vm_monitoring/mem_usage' +"?vmName="+vmName+"&type="+type+"&interval="+interval+"&timeGroup="+timeGroup, this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  getVmMonitoringCpuUsage(vmName: string, type: String,interval: string, timeGroup: string ) {
    return this.commonService.doGet('/commonapi/v2/vm_monitoring/cpu_usage' +"?vmName="+vmName+"&type="+type+"&interval="+interval+"&timeGroup="+timeGroup, this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }


  getVmMonitoringDiskIOps(vmName: string, type: String,interval: string, timeGroup: string ) {
    return this.commonService.doGet('/commonapi/v2/vm_monitoring/disk_iops' +"?vmName="+vmName+"&type="+type+"&interval="+interval+"&timeGroup="+timeGroup, this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  getVmMonitoringNetUsage(vmName: string, type: String,interval: string, timeGroup: string ) {
    return this.commonService.doGet('/commonapi/v2/vm_monitoring/net_usage' +"?vmName="+vmName+"&type="+type+"&interval="+interval+"&timeGroup="+timeGroup, this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  getVmMonitoringNowMemUsagePercent(vmName: string) {
    return this.commonService.doGet('/commonapi/v2/vm_monitoring/now_mem_usage_percent' +"?vmName="+vmName, this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }
  getVmMonitoringNowCpuUsagePercent(vmName: string) {
    return this.commonService.doGet('/commonapi/v2/vm_monitoring/now_cpu_usage_percent' +"?vmName="+vmName, this.commonService.getToken()).map((res: any) => {
      return res;
    })
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
