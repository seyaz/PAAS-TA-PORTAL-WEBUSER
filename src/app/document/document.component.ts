import {Component, OnInit, ViewChild} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {DocumentService} from "./document.service";
import {DOCUMENTURLConstant} from "./common/document.constant";
import "./css/bootstrap.min.css";
import "./css/components/prism-css.min.js";
import "./css/plugins/line-numbers/prism-line-numbers.js";
import "./css/plugins/line-highlight/prism-line-highlight.js";
import "./css/components/prism.js";
import "./css/components/prism-typescript.min.js";
import {MarkdownModuleConfig, MarkdownService} from "ngx-markdown";


declare var $: any;
declare var jQuery: any;

//const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})

export class DocumentComponent implements OnInit {

  location: string;
  guides: Array<any> = new Array<any>();
  summary: string; // 가이드 gubun2
  markdown: any;
  translateEntities: any = [];
  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private documentService: DocumentService, private log: NGXLogger, private markdownService: MarkdownService) {
  }

  ngOnInit() {
    this.doLayout()
    //this.doGetGuideList()
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

}

