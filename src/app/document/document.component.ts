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


declare var $: any;
declare var jQuery: any;

//const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})

export class DocumentComponent implements OnInit {


  //apiversion = appConfig['apiversion'];
  documentcontant = DOCUMENTURLConstant;
  angularVersion = VERSION.full;
  ngxMarkdownVersion = '12.0.1';

  markdown = `## Markdown __rulez__!
---

### Syntax highlight
\`\`\`typescript
const language = 'typescript';
\`\`\`

\`\`\`typescript
const language = 'typescript';
\`\`\`

* * *

***

*****

- - -

---------------------------------------

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

