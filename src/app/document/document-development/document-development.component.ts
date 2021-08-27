import {Component, OnInit} from "@angular/core";
import {DOCUMENTURLConstant} from "../common/document.constant";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, NavigationEnd, Router, Routes} from "@angular/router";
import {DocumentService} from "../document.service";
import {NGXLogger} from "ngx-logger";
import {MarkdownService} from "ngx-markdown";
import "../css/bootstrap.min.css";
import "../css/components/prism-css.min.js";
import "../css/plugins/line-numbers/prism-line-numbers.js";
import "../css/plugins/line-highlight/prism-line-highlight.js";
import "../css/components/prism.js";
import "../css/components/prism-typescript.min.js";
import {isNullOrUndefined} from "util";
import {Location} from "@angular/common";
import {Subscription} from "rxjs";


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-document-development',
  templateUrl: './document-development.component.html',
  styleUrls: ['../document.component.css']

})


export class DocumentDevelopmentComponent implements OnInit {


  guidename: string; //가이드 이름
  guideId: string; //가이드 이름-> 아이디
  guides: Array<any> = new Array<any>();
  guidelist: Array<any> = new Array<any>();
  division: string;//가이드 gubun
  summary: string; // 가이드 gubun2
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
  buildpackdevelop: string;
  documentcontant = DOCUMENTURLConstant;
  paramsOne: string;


  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private documentService: DocumentService, private log: NGXLogger, private markdownService: MarkdownService
    , private location: Location) {
    this.paramsOne = route.snapshot.params['build_name'];
  }

  ngOnInit() {
    this.doLayout()
    this.doGetGuideList()
    if (!isNullOrUndefined(this.route.snapshot.queryParams['buildpack_name'])) {
      this.documentService.getGuide('/commonapi/v2/guides/' + this.route.snapshot.queryParams['buildpack_name']).subscribe(data => {
        if (data['RESULT'] == DOCUMENTURLConstant.SUCCESS) {
          if(data.data['useYn']=='N'){
            this.documentService.alertMessage("가이드가 존재하지 않습니다.", false);
            return false;
          }
          this.division = data.data['gubun'];
          this.summary = data.data['gubun2'];
          this.markdown = data.data['markdown'];
          this.getGuideImg()
        } else {
          this.documentService.alertMessage("가이드가 존재하지 않습니다.", false);
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
      this.buildpackdevelop = '앱 개발환경';
    }, error => {
      this.documentService.alertMessage("가이드를 찾을 수 없습니다.", false);
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

