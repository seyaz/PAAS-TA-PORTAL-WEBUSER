import {Component, OnInit, ViewChild} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {DocumentService} from "./document.service";
import {DOCUMENTURLConstant} from "./common/document.constant";
import {VERSION} from "@angular/core";
import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import "prismjs/components/prism-css.min.js";
import {MarkdownModuleConfig, MarkdownService} from "ngx-markdown";
import {Organization} from "../model/organization";



declare var $: any;
declare var jQuery: any;

//const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})

export class DocumentComponent implements OnInit {

  public guidename : string; //가이드 이름
  public guideId : string; //가이드 이름-> 아이디
  public guides : Array<any> = new Array<any>();
  public guidelist : Array<any> = new Array<any>();
  public guidelistname: string;
  public guidelistsummary: string;
  public guidelistdivision: string;
  public getguide : any;
  public division : string;//가이드 gubun
  public summary : string; // 가이드 gubun2
  public markdown : any;
  public imgno : string;
  public imgname : string;
  public imgdivision : string;
  public imgpath : string;
  public imgsummary : string;


  documentcontant = DOCUMENTURLConstant;
  angularVersion = VERSION.full; //테스트중 나중에 삭제
  ngxMarkdownVersion = '12.0.1'; //테스트중 나중에 삭제


  markdownText = `## Markdown __rulez__!
---

### Syntax highlight
\`\`\`typescript
const language = 'typescript';
\`\`\`

\`\`\`typescript
const language = 'typescript';
\`\`\`

### Lists
1. Ordered list
2. Another bullet point
   - Unordered list
   - Another unordered bullet

### Blockquote
> Blockquote to the max`;

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private documentService: DocumentService, private log: NGXLogger, private markdownService: MarkdownService) {
  }

  ngOnInit() {
    this.doLayout()
    this.doGetGuideList()
    this.getGuideImg()
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
  doGetGuideList(){
    this.documentService.getGuides('/commonapi/v2/guides').subscribe(data => {
      this.guides.push(data)
      this.guidelist = this.guides['0']['data']
      console.log(this.guidelist)
      console.log(this.guidelist['0'])


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
     // 에러처리 해야할것
    });
  }


  searchIndex(){

  }

  // 가이드를 가져온다.
  doGetGuide(event){
    const targetId = event.target.id
    this.guidename = targetId
    this.guideId = this.guidename.toString()
    this.documentService.getGuide('/commonapi/v2/guides/'+ this.guidename ).subscribe(data=>{
      if(data['RESULT']==DOCUMENTURLConstant.SUCCESS){
       this.division = data.data['gubun'];
       this.summary = data.data['gubun2'];
       this.markdown = data.data['markdown'];
      }
    })
  }

// 가이드 이미지를 불러온다.
  getGuideImg(){
    this.imgno = '10' //임시 확인
    this.documentService.getGuide('/commonapi/v2/guide_images/'+this.imgno).subscribe(data=>{
      console.log(data)
      }
    )}

  // 알럿 메시지(오류)
  errorMsg(value : any){
    this.documentService.alertMessage(value, false);
    this.documentService.isLoading(false);
  }
}

