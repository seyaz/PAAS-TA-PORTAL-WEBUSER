import {Component, OnInit, ViewChild} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {MarkdownModuleConfig, MarkdownService} from "ngx-markdown";
import {DocumentService} from "../document.service";
import "../css/bootstrap.min.css";
import "../css/components/prism-css.min.js";
import "../css/plugins/line-numbers/prism-line-numbers.js";
import "../css/plugins/line-highlight/prism-line-highlight.js";
import "../css/components/prism.js";
import "../css/components/prism-typescript.min.js";
import {Location} from "@angular/common";

declare var $: any;
declare var jQuery: any;

//const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document-user',
  templateUrl: './document-user.component.html',
  styleUrls: ['../document.component.css'],
})

export class DocumentUserComponent implements OnInit {

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute,
              private documentService: DocumentService, private log: NGXLogger, private markdownService: MarkdownService, private location: Location) {
  }

  ngOnInit() {

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

