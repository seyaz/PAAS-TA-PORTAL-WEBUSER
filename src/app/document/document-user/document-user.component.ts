import {Component, OnInit, ViewChild} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import "prismjs/components/prism-css.min.js";
import {MarkdownModuleConfig, MarkdownService} from "ngx-markdown";
import {DOCUMENTURLConstant} from "../common/document.constant";
import {DocumentService} from "../document.service";

declare var $: any;
declare var jQuery: any;

//const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document-user',
  templateUrl: './document-user.component.html',
  styleUrls: ['../document.component.css'],
})

export class DocumentUserComponent implements OnInit {

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private documentService: DocumentService, private log: NGXLogger, private markdownService: MarkdownService) {
  }

  ngOnInit() {

  }

}

