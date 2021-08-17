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


declare var $: any;
declare var jQuery: any;

//const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document',
  templateUrl: './document-app.component.html',
  styleUrls: ['../document.component.css'],
})

export class DocumentAppComponent implements OnInit {


  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute) {
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

