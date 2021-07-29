import {Component, OnInit, ViewChild} from '@angular/core';
import {Organization} from "../model/organization";
import {Space} from "../model/space";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {isNullOrUndefined} from "util";
import {$} from "protractor";
import {DocumentService} from "./document.service";
import {DOCUMENTURLConstant} from "./common/document.constant";

const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})


export class DocumentComponent implements OnInit {


 apiversion = appConfig['apiversion'];

  documentcontant = DOCUMENTURLConstant;
  // translateEntities: any;
  // docnamecheck = 0;
  // docroutecheck = 0;
  //
  // docorgname: string;
  // docspacename: string;
  //
  // docappnames: Array<string>;
  // dochostnames: Array<string>;
  //
  // docorg: Organization; // 선택한 조직정보
  // docspace: Space; // 선택한 공간정보
  // docorgs: Array<Organization> = new Array<Organization>(); // 조직 정보 리스트
  // docspaces: Array<Space> = new Array<Space>(); // 공간 정보 리스트
  //
  // docdiskoption: any = [];
  // docmemoryoption: any = [];
  // docsharedomain: any;
  // doccurrentdomain: any;
  // docdomainList: Array<any>;
  docbuildpack: any; //빌드팩 정보
  // docappname = ''; //앱 이름
  // dochostname = ''; // 앱 호스트
  // docmemory: number; // 메모리
  // docdisk: number; // 디스크
  // docappStart = true; // 앱 시작 여부
  // docpublic uploadFile: File = null; //앱파일
  // docappFileName: String;
  // docappFilePath: String;
  // docmfile: any;
  // docfilename: String;
  //
  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private documentService: DocumentService, private log: NGXLogger) {
  }
  //
  ngOnInit() {
    this.navInit();
    this.buildInit();
    //this.orgsInit();
    // this.doLayout();

  }
  //
  navInit() {

  }
  //
  //
  // keyPressInit() {
  //   $('#orgname').trigger('focus');
  //   window.scrollTo(0, 0);
  //
  //   $('input[name=appname]').keydown(function (key) {
  //     if (key.keyCode == 13) {
  //       $('#createApp').trigger('click');
  //     }
  //   });
  //   $('input[name=route]').keydown(function (key) {
  //     if (key.keyCode == 13) {
  //       $('#createApp').trigger('click');
  //     }
  //   });
  // }
  //
  // errorMsg(value: any) {
  //   this.documentService.alertMessage(value, false);
  //   this.documentService.isLoading(false);
  // }
  //
  // successMsg(value: any) {
  //   this.documentService.alertMessage(value, true);
  //   this.documentService.isLoading(false);
  // }
  //
  // // doLayout() {
  // //   $(document).ready(() => {
  // //     //TODO 임시로...
  // //     $.getScript('../../assets/resources/js/common2.js')
  // //       .done(function (script, textStatus) {
  // //       })
  // //       .fail(function (jqxhr, settings, exception) {
  // //       });
  // //
  // //   });
  // // }
  //
  //
  // shareDomainInit() {
  //   this.documentService.getDomain('/portalapi/' + this.apiversion + '/domains/shared').subscribe(data => {
  //     this.sharedomain = data['resources'][0];
  //     this.currentdomain = this.sharedomain;
  //     this.domainList.unshift(this.sharedomain);
  //   });
  // }
  //
  // privateDomainInit(value) {
  //   this.documentService.getOrgPrivateDomain('/portalapi/' + this.apiversion + '/' + value + '/domains').subscribe(data => {
  //     this.domainList = new Array<any>();
  //     this.domainList.unshift(this.sharedomain);
  //     this.currentdomain = this.sharedomain;
  //     data.resources.forEach(domain => {
  //       this.domainList.push(domain);
  //     });
  //   }, error => {
  //     this.errorMsg(error);
  //   });
  // }
  //
  buildInit() {
    if (isNullOrUndefined(this.documentService.getCurrentCatalogNumber())) {
      this.router.navigate(['document']);
      return;
    }
    this.documentService.getBuildPacks(DOCUMENTURLConstant.GETBUILDPACKS + '/' + this.documentService.getCurrentCatalogNumber()).subscribe(data => {
      try {
        this.docbuildpack =  data['list'][0];
        const pathHeader = this.docbuildpack.thumbImgPath.lastIndexOf('/');
        const pathEnd = this.docbuildpack.thumbImgPath.length;
        const fileName = this.docbuildpack.thumbImgPath.substring(pathHeader + 1, pathEnd);
        this.documentService.getImg(DOCUMENTURLConstant.GETIMG + fileName).subscribe(data => {

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.docbuildpack.img = reader.result;
          }, false);
          if (data) {
            reader.readAsDataURL(data);
          }
        }, error => {
          this.docbuildpack.img = '../../../assets/resources/images/catalog/catalog_3.png';
        });
      } catch (e) {
        this.docbuildpack.img = '../../../assets/resources/images/catalog/catalog_3.png';
      }}, error => {
      this.router.navigate(['document']);
    });
  }

  buildPackRead(){
    if (isNullOrUndefined(this.documentService.getCurrentCatalogNumber())) {
      this.router.navigate(['document']);
      return;
    }
    this.documentService.getBuildPacks(DOCUMENTURLConstant.GETBUILDPACKS + '/' + this.documentService.getCurrentCatalogNumber()).subscribe(data => {

        this.docbuildpack =  data['list'][0];

        console.log(data)
      this.router.navigate(['document']);
    });
      }
  //
  // getRoutes() {
  //   this.hostnames = new Array<string>();
  //   this.documentService.getRoutes(DOCUMENTURLConstant.GETLISTROUTE).subscribe(data => {
  //     data.forEach(route => {
  //       this.hostnames.push(route['host']);
  //     });
  //     this.documentService.isLoading(false);
  //   }, error => {
  //     this.errorMsg(this.translateEntities.result.errorGetRoutes);
  //   });
  // }
  //
  // // getAppNames() { //앱의 개발환경 정보를 가져온다.
  // //   this.documentService.getAppNames('/portalapi/' + this.apiversion + '/catalogs/apps/' + this.org.guid + '/' + this.space.guid).subscribe(data => {
  // //     this.appnames = new Array<string>();
  // //     data['resources'].forEach(res => {
  // //       this.appnames.push(res['entity']['name']);
  // //     });
  // //     this.checkAppName();
  // //     this.documentService.isLoading(false);
  // //   }, error => {
  // //     this.errorMsg(error);
  // //   });
  // // }
  //
  // orgsFirst() {
  //   this.org = new Organization(null, null);
  //   this.org.name = this.translateEntities.nav.org_name;
  //   this.orgs.unshift(this.org);
  // }
  //
  // spacesFirst() {
  //   this.space = new Space(null, null, null);
  //   this.space.name = this.translateEntities.nav.space_name;
  //   this.spaces.unshift(this.space);
  // }
  //
  //
  // // orgsInit() {
  // //   this.documentService.getOrglist().subscribe(data => {
  // //     data['resources'].forEach(res => {
  // //       const _org = new Organization(res['metadata'], res['entity']);
  // //       this.orgs.push(_org);
  // //       if (_org.name === this.orgname) {
  // //         this.org = _org;
  // //       }
  // //     });
  // //     this.documentService.getSpacelist(this.org.guid).subscribe( data => {
  // //       data['spaceList']['resources'].forEach(res => {
  // //         const _space = new Space(res['metadata'], res['entity'], null);
  // //         this.spaces.push(_space);
  // //         if ( _space.name === this.spacename) {
  // //           this.space = _space;
  // //           this.getAppNames();
  // //         } });
  // //     }, error => {
  // //       this.errorMsg(error);
  // //     });
  // //   }, error => {
  // //     this.errorMsg(error);
  // //   });
  // // }
  //
  //
  // orgSelect() {
  //   this.documentService.isLoading(true);
  //   this.documentService.setCurrentOrg(this.org.name, this.org.guid);
  //   this.documentService.setCurrentSpace(null, null);
  //   this.spaces = new Array<Space>();
  //   this.spacesFirst();
  //   this.privateDomainInit(this.org.guid);
  //   this.documentService.getSpacelist(this.org.guid).subscribe(data => {
  //     data['spaceList']['resources'].forEach(res => {
  //       this.spaces.push(new Space(res['metadata'], res['entity'], null));
  //     });
  //     this.documentService.isLoading(false);
  //   }, error => {
  //     this.errorMsg(error);
  //   });
  // }
  //
  // // spaceSelect() {
  // //   this.documentService.isLoading(true);
  // //   this.documentService.setCurrentSpace(this.space.name, this.space.guid);
  // //   this.getAppNames();
  // // }
  // //
  // // checkAppName() {
  // //   this.pattenTest();
  // //   $('#routename').val(this.appname);
  // //   this.nameCheck();
  // //   this.checkHostName();
  // // }
  // //
  // // checkHostName() {
  // //   this.routepattenTest();
  // //   this.routeCheck();
  // // }
  //
  // pattenTest() {
  //   $('#orgname').val($('#orgname').val().replace(/[^a-z0-9_-]/gi, ''));
  //   this.appname = $('#orgname').val();
  // }
  // routepattenTest() {
  //   $('#routename').val($('#routename').val().replace(/[^a-z0-9_-]/gi, ''));
  //   this.hostname = $('#routename').val();
  // }
  //
  // errorCheck(): boolean {
  //   if (this.org.guid === '(id_dummy)') {
  //     this.documentService.alertMessage(this.translateEntities.contants.selectOrgAndSpace, false);
  //     return true;
  //   } if (this.space.guid === '(id_dummy)') {
  //     this.documentService.alertMessage(this.translateEntities.contants.selectOrgAndSpace, false);
  //     return true;
  //   } if (this.namecheck !== 1 || this.appname.length <= 0) {
  //     this.documentService.alertMessage(this.translateEntities.result.appNameError, false);
  //     return true;
  //   } if (this.routecheck !== 1 || this.hostname.length <= 0) {
  //     this.documentService.alertMessage(this.translateEntities.result.routeNameError, false);
  //     return true;
  //   } return false;
  // }
  // // onAppChanged(event) {
  // //   const file = event.target.files[0];
  // //   if (isNullOrUndefined(file)) {
  // //     return;
  // //   }
  // //   this.uploadFile = file;
  // // }
  //
  // // createApp() {
  // //   if (this.errorCheck()) {
  // //     return;
  // //   }
  // //   this.pattenTest();
  // //   this.routepattenTest();
  // //   this.documentService.isLoading(true);
  // //   this.documentService.getNameCheck('/portalapi/' + this.apiversion + '/catalogs/apps/'
  // //     + this.appname + '/?orgid=' + this.org.guid + '&spaceid=' + this.space.guid).subscribe(data => {
  // //     this.documentService.getRouteCheck(DOCUMENTURLConstant.ROUTECHECK + this.hostname).subscribe(data => {
  // //       if (data['RESULT'] === DOCUMENTURLConstant.SUCCESS) {
  // //         if (this.uploadFile != null) {
  // //           let formData = new FormData();
  // //           formData.append('file', this.uploadFile, this.uploadFile.name);
  // //           const params = {
  // //             appSampleStartYn: this.appStart ? 'Y' : 'N',
  // //             appSampleFileName: this.appFileName,
  // //             spaceId: this.space.guid,
  // //             spaceName: this.space.name,
  // //             orgName: this.org.name,
  // //             appName: this.appname,
  // //             name: this.appname,
  // //             hostName: this.hostname,
  // //             domainId: this.currentdomain.metadata.guid,
  // //             memorySize: this.memory,
  // //             diskSize: this.disk,
  // //             buildPackName: this.buildpack['buildPackName'],
  // //             appSampleFilePath: this.appFilePath,
  // //             catalogType: DOCUMENTURLConstant.BUILDPACK,
  // //             catalogNo: this.buildpack.no,
  // //             userId: this.documentService.getUserid(),
  // //           };
  // //           formData.append('param', new Blob([JSON.stringify(params)], {type: 'application/json'}));
  // //           this.documentService.postApp2('/portalapi/v2/catalogs/customapp', formData).subscribe(data => {
  // //             if (data['RESULT'] === DOCUMENTURLConstant.SUCCESS) {
  // //               this.successMsg(this.translateEntities.result.appUploadSusses);
  // //               this.router.navigate(['dashboard']);
  // //             } else {
  // //               this.errorMsg(data['msg']);
  // //             }
  // //           }, error => {
  // //             this.errorMsg(this.translateEntities.result.appUploadError);
  // //           });
  // //         } else if (this.uploadFile === null) { // 멀티파일 X -> 샘플파일(빌드팩) 업로드 진행
  // //           this.documentService.getNameCheck('/portalapi/' + this.apiversion + '/catalogs/apps/'
  // //             + this.appname + '/?orgid=' + this.org.guid + '&spaceid=' + this.space.guid).subscribe(data => {
  // //             this.documentService.getRouteCheck(DOCUMENTURLConstant.ROUTECHECK + this.hostname).subscribe(data => {
  // //               if (data['RESULT'] === DOCUMENTURLConstant.SUCCESS) {
  // //
  // //                 let appSampleFilePath = this.buildpack['appSampleFilePath'];
  // //                 if (appSampleFilePath === '' || appSampleFilePath === null) {
  // //                   appSampleFilePath = 'N';
  // //                 }
  // //                 const params = {
  // //                   appSampleStartYn: this.appStart ? 'Y' : 'N',
  // //                   appSampleFileName: this.buildpack['appSampleFileName'],
  // //                   spaceId: this.space.guid,
  // //                   spaceName: this.space.name,
  // //                   orgName: this.org.name,
  // //                   appName: this.appname,
  // //                   name: this.appname,
  // //                   hostName: this.hostname,
  // //                   domainId: this.currentdomain.metadata.guid,
  // //                   memorySize: this.memory,
  // //                   diskSize: this.disk,
  // //                   buildPackName: this.buildpack['buildPackName'],
  // //                   appSampleFilePath: appSampleFilePath,
  // //                   catalogType: DOCUMENTURLConstant.BUILDPACK,
  // //                   catalogNo: this.buildpack.no,
  // //                   userId: this.documentService.getUserid()
  // //                 };
  // //                 this.documentService.postApp('/portalapi/' + this.apiversion + '/catalogs/app', params).subscribe(data => {
  // //                   if (data['RESULT'] === DOCUMENTURLConstant.SUCCESS) {
  // //
  // //                     this.successMsg(this.translateEntities.result.buildPackSusses);
  // //                     this.router.navigate(['dashboard']);
  // //                   } else {
  // //                     this.errorMsg(data['msg']);
  // //                   }
  // //                 }, error => {
  // //                   this.errorMsg(this.translateEntities.result.buildPackError);
  // //                 });
  // //               } else if (data['RESULT'] === DOCUMENTURLConstant.FAIL) {
  // //                 this.errorMsg(this.translateEntities.result.routeNameError);
  // //                 this.getRoutes();
  // //                 this.routecheck = DOCUMENTURLConstant.NO;
  // //               }
  // //             }, error => {
  // //               this.errorMsg(this.translateEntities.result.routeNameError);
  // //               this.getRoutes();
  // //               this.routecheck = DOCUMENTURLConstant.NO;
  // //             });
  // //           }, error => {
  // //             this.errorMsg(this.translateEntities.result.appNameError);
  // //             this.getAppNames();
  // //             this.namecheck = DOCUMENTURLConstant.NO;
  // //           });
  // //         }
  // //       }
  // //     });
  // //   });
  // // }
  // //
  // // nameCheck() {
  // //   this.namecheck = DOCUMENTURLConstant.OK;
  // //   if (!isNullOrUndefined(this.appnames)) {
  // //     this.appnames.forEach(name => {
  // //       if (name === this.appname) {
  // //         this.namecheck = DOCUMENTURLConstant.NO;
  // //         return;
  // //       }
  // //     });
  // //   }
  // // }
  //
  // // routeCheck() {
  // //   this.routecheck = DOCUMENTURLConstant.OK;
  // //   this.hostnames.forEach(host => {
  // //     if (host === this.hostname) {
  // //       this.routecheck = DOCUMENTURLConstant.NO;
  // //       return;
  // //     }
  // //   });
  // // }
  // //
  // // fileCheck(){ // 파일 확장자를 체크한다.
  // //   this.filename = $("#uploadFile").val();
  // //   this.filename = this.filename.slice(this.filename.indexOf(".")+1).toLowerCase();
  // //   if(this.filename!="zip"){
  // //     this.errorMsg(this.translateEntities.result.fileTypeError);
  // //     $("#uploadFile").val("");
  // //   }
  // // }

}

