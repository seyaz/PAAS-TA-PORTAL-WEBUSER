import {Component, OnInit} from "@angular/core";
import {DOCUMENTURLConstant} from "../common/document.constant";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DocumentService} from "../document.service";
import {NGXLogger} from "ngx-logger";
import {MarkdownService} from "ngx-markdown";
import "../css/bootstrap.min.css";
import "../css/components/prism-css.min.js";
import "../css/plugins/line-numbers/prism-line-numbers.js";
import "../css/plugins/line-highlight/prism-line-highlight.js";
import "../css/components/prism.js";
import "../css/components/prism-typescript.min.js";

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
  guidelistname: string;
  guidelistsummary: string;
  guidelistdivision: string;
  getguide: any;
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
  markdownimg: string;
  buildpackdevelop: string;
  documentcontant = DOCUMENTURLConstant;

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private documentService: DocumentService, private log: NGXLogger, private markdownService: MarkdownService) {
  }

  ngOnInit() {
    this.doLayout()
    this.doGetGuideList()
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

      // for(var i = 0; i < this.guidelist.length; i++) {
      //   Object.keys(this.guidelist).forEach(key=>{
      //       const guidObj = this.guidelist[key];
      //       this.guidelistname = guidObj['name']
      //       this.guidelistsummary = guidObj['gubun']
      //       this.guidelistdivision =guidObj['gubun2']
      //       $("#guidelist").append('<tr id='+this.guidelistname+'><td> '+ this.guidelistname +' '+ this.guidelistsummary +' '+ this.guidelistdivision +' </td></tr>');
      //   })
      // }
    }, error => {
    });
  }


  // 가이드를 가져온다.
  doGetBuild(event) {
    const targetId = event.target.id
    this.guidename = targetId
    this.guideId = this.guidename.toString()
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

}
