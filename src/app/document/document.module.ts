// @ts-ignore
import { NgModule } from '@angular/core';
// @ts-ignore
import { CommonModule } from '@angular/common';
// @ts-ignore
import {FormsModule} from "@angular/forms";
import {RoutingModule} from "../app.routing";
import { SharedModule } from '../shared/shared.module';
import {DocumentComponent} from "./document.component";
import {DocumentServiceComponent} from "./document-service/document-service.component";
import {DocumentDevelopmentComponent} from "./document-development/document-development.component";
import {DocumentService} from "./document.service";
import {DocumentNavComponent} from "./document-layout/document-nav/document-nav.component";
import {MarkdownModule, MarkdownService, MarkedOptions} from "ngx-markdown";
import {HttpClient} from "@angular/common/http";
import {DocumentUserComponent} from "./document-user/document-user.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    SharedModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
        },
      },
    }),
    // included TranslateModule
  ],
  declarations: [
    DocumentComponent,
    DocumentServiceComponent,
    DocumentDevelopmentComponent,
    DocumentNavComponent,
    DocumentUserComponent,

  ],
  providers: [
    DocumentService,
    MarkdownService,],
  exports: [SharedModule, DocumentNavComponent]
})
export class DocumentModule { }
