import {Component, OnInit, ViewChild} from '@angular/core';
import "../css/bootstrap.min.css";
import "../css/components/prism-css.min.js";
import "../css/plugins/line-numbers/prism-line-numbers.js";
import "../css/plugins/line-highlight/prism-line-highlight.js";
import "../css/components/prism.js";
import "../css/components/prism-typescript.min.js";
import {MarkdownModuleConfig, MarkdownService} from "ngx-markdown";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENTURLConstant} from "../common/document.constant";
import {DocumentService} from "../document.service";
import {NGXLogger} from "ngx-logger";
import {Location} from "@angular/common";
import {isNullOrUndefined} from "util";


declare var $: any;
declare var jQuery: any;

//const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document',
  templateUrl: './document-main.component.html',
  styleUrls: ['../document.component.css'],
})

export class DocumentMainComponent implements OnInit {
  searchKeyword : string='';
  guidename: string; //가이드 이름
  guideId: string; //가이드 이름-> 아이디
  guides: Array<any> = new Array<any>();
  guidelist: Array<any> = new Array<any>();
  division: string;
  summary: string;
  markdown: any;
  imgno: string;
  imgname: string;
  imgdivision: string;
  imgpath: string;
  imgsummary: string;
  translateEntities: any = [];
  guideimgs: Array<any> = new Array<any>();
  imgs: any;
  imgform: string;
  servicedevelop: string;
  serviceInstallguideA: string;
  serviceInstallguideB: string;
  serviceInstallguideC: string;
  serviceUseguideB: string;
  systemdevelope: string;
  customdevelope: string;
  system: Array<any> = new Array<any>();
  custom: Array<any> = new Array<any>();
  guidegubun2: string;
  servicenameA: string;
  servicenameB: Array<any> = new Array<any>();
  servicenameC: Array<any> = new Array<any>();
  serviceusenameB: string;
  serviceInstallA: Array<any> = new Array<any>();
  serviceInstallB: Array<any> = new Array<any>();
  serviceInstallC: Array<any> = new Array<any>();
  serviceUseB: Array<any> = new Array<any>();
  buildpackdevelop: string;
  buildpack_system: string;
  buildpack_custom: string;

  documentcontant = DOCUMENTURLConstant;

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private documentService: DocumentService,
              private log: NGXLogger, private markdownService: MarkdownService, private location: Location) {
  }


  ngOnInit() {
    this.doLayout()
    this.doGetGuideList()
    this.doGetServiceGuide()
    this.doGetBuildPackGuide()
    if (!isNullOrUndefined(this.route.snapshot.queryParams['service_name'])) {
      this.documentService.getGuide('/commonapi/v2/guides/' + this.route.snapshot.queryParams['service_name']).subscribe(data => {
        if (data['RESULT'] == DOCUMENTURLConstant.SUCCESS) {
          this.division = data.data['gubun'];
          this.summary = data.data['gubun2'];
          this.markdown = data.data['markdown'];
          this.getGuideImg()
        } else {
          this.documentService.alertMessage("Error", false);
        }
      })
    }
    if (!isNullOrUndefined(this.route.snapshot.queryParams['buildpack_name'])) {
      this.documentService.getGuide('/commonapi/v2/guides/' + this.route.snapshot.queryParams['buildpack_name']).subscribe(data => {
        if (data['RESULT'] == DOCUMENTURLConstant.SUCCESS) {
          this.division = data.data['gubun'];
          this.summary = data.data['gubun2'];
          this.markdown = data.data['markdown'];
          this.getGuideImg()
        } else {
          this.documentService.alertMessage("Error", false);
        }
      })
    }
  }

  doLayout() {
    $(document).ready(() => {
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
        })
        .fail(function (jqxhr, settings, exception) {
        });
    });
  }

  //등록된 가이드 리스트를 가져온다.
  doGetGuideList() {
    this.documentService.getGuides('/commonapi/v2/guides').subscribe(data => {
        this.guides.push(data)
        this.guidelist = this.guides['0']['data']
        this.servicedevelop = '앱 서비스';
        this.buildpackdevelop = '앱 개발환경';
      },
      error => {
      });
  }

  doGetServiceGuide() {
    this.serviceInstallguideA = '서비스 설치 가이드 A';
    this.serviceInstallguideB = '서비스 설치 가이드 B';
    this.serviceInstallguideC = '서비스 설치 가이드 C';
    this.serviceUseguideB = '서비스 사용 가이드 B';
    this.documentService.getGuides('/commonapi/v2/guides').subscribe(data => {
      this.guides.push(data)
      this.guidelist = this.guides['0']['data']
      this.servicedevelop = '앱 서비스';
      for (var i = 0; i < this.guidelist.length; i++) {
        if (this.guides['0']['data'][i]['gubun2'] == this.serviceInstallguideA) {
          this.serviceInstallA = this.guides['0']['data']
          this.guidegubun2 = this.guides['0']['data'][i]['gubun2'];
          this.servicenameA = this.guides['0']['data'][i]['name'];
        }
        if (this.guides['0']['data'][i]['gubun2'] == this.serviceInstallguideB) {
          this.serviceInstallB = this.guides['0']['data']
          this.guidegubun2 = this.guides['0']['data'][i]['gubun2'];
          this.servicenameB = this.guides['0']['data'][i]['name'];
        }
        if (this.guides['0']['data'][i]['gubun2'] == this.serviceInstallguideC) {
          this.serviceInstallC = this.guides['0']['data']
          this.guidegubun2 = this.guides['0']['data'][i]['gubun2'];
          this.servicenameC = this.guides['0']['data'][i]['name'];
        }
        if (this.guides['0']['data'][i]['gubun2'] == this.serviceUseguideB) {
          this.serviceUseB = this.guides['0']['data']
          this.guidegubun2 = this.guides['0']['data'][i]['gubun2'];
          this.serviceusenameB = this.guides['0']['data'][i]['name'];
        }
      }
    }, error => {
      this.documentService.alertMessage("가이드가 존재하지 않습니다.", false);
    });
  }

  // 가이드를 가져온다.
  doGetService(event) {
    const targetId = event.target.id
    this.guidename = targetId
    this.guideId = this.guidename.toString()
    this.router.navigate(['/documentservice'], {queryParams: {service_name: this.guidename}})
    this.documentService.getGuide('/commonapi/v2/guides/' + this.guidename).subscribe(data => {
      if (data['RESULT'] == DOCUMENTURLConstant.SUCCESS) {
        this.division = data.data['gubun'];
        this.summary = data.data['gubun2'];
        this.markdown = data.data['markdown'];
        this.getGuideImg()
      } else {
        this.documentService.alertMessage("가이드가 존재하지 않습니다.", false);
      }
    })
  }

  doGetBuildPackGuide() {
    this.systemdevelope = '시스템 앱 개발환경';
    this.customdevelope = '사용자 앱 개발환경';
    this.documentService.getGuides('/commonapi/v2/guides').subscribe(data => {
      this.guides.push(data)
      for (var i = 0; i < this.guidelist.length; i++) {
        if (this.guides['0']['data'][i]['gubun2'] == this.systemdevelope) {
          this.system = this.guides['0']['data']
          this.guidegubun2 = this.guides['0']['data'][i]['gubun2'];
          this.buildpack_system = this.guides['0']['data'][i]['name'];
        }
        if (this.guides['0']['data'][i]['gubun2'] == this.customdevelope) {
          this.custom = this.guides['0']['data']
          this.guidegubun2 = this.guides['0']['data'][i]['gubun2'];
          this.buildpack_custom = this.guides['0']['data'][i]['name'];
        }
      }
    }, error => {
      this.documentService.alertMessage("가이드가 존재하지 않습니다.", false);
    });
  }

  // 가이드를 가져온다.
  doGetBuild(event) {
    const targetId = event.target.id
    this.guidename = targetId
    this.guideId = this.guidename.toString()
    //name값을 받아 라우팅을 한다.
    this.router.navigate(['/documentdevelopment'], {queryParams: {buildpack_name: this.guidename}})
    this.documentService.getGuide('/commonapi/v2/guides/' + this.guidename).subscribe(data => {
      if (data['RESULT'] == DOCUMENTURLConstant.SUCCESS) {
        this.division = data.data['gubun'];
        this.summary = data.data['gubun2'];
        this.markdown = data.data['markdown'];
        this.getGuideImg()
      } else {
        this.errorMsg(this.translateEntities.document.guideFail);
      }
    })
  }

// 가이드 이미지를 불러온다.
  getGuideImg() {
    $("#guideImg").empty()
    this.documentService.getGuide('/commonapi/v2/guide_images').subscribe(data => {
      for (var i = 0; i < data['data'].length; i++) {
        if (this.summary == data['data'][i]['gubun2']) {
          this.imgno = data['data'][i]['id']
          this.documentService.getGuide('/commonapi/v2/guide_images/' + this.imgno).subscribe(data => {
            this.imgname = data.data.name
            this.imgdivision = data.data['gubun']
            this.imgpath = data.data['url']
            this.imgsummary = data.data['gubun2']
            var src = this.imgpath
            $("#guideImg").append('<img src="' + src + '"/>') //나중에 아이콘으로 추가할 것
          })
        }
      }
    })
  }


  // 가이드 이미지를 리스트 불러온다.
  getGuideImgs() {
    this.documentService.getGuide('/commonapi/v2/guide_images').subscribe(data => {
        if (data['RESULT'] == DOCUMENTURLConstant.SUCCESS) {
          this.imgs = JSON.stringify(data)
          this.guideimgs = JSON.parse(String(this.imgs))
          this.imgform = this.guideimgs['data']
        }
      }
    )
  }

  // 알럿 메시지(오류)
  errorMsg(value: any) {
    this.documentService.alertMessage(value, false);
    this.documentService.isLoading(false);
  }

  goBack() {
    this.location.back();
    this.onRefresh();
  }

  Search()  {
    this.searchKeyword = $("#document-search").val();
  }


  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    let currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl).then(() => {
      this.router.navigated = false;
      this.router.navigate([this.router.url]);

    })
  }
}
