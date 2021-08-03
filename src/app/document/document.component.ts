import {Component, OnInit, ViewChild} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {isNullOrUndefined} from "util";
import {$} from "protractor";
import {DocumentService} from "./document.service";
import {DOCUMENTURLConstant} from "./common/document.constant";

const appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})


export class DocumentComponent implements OnInit {

  apiversion = appConfig['apiversion'];
  documentcontant = DOCUMENTURLConstant;
  docbuildpack: any; //빌드팩 정보
  developpack: any;
  developpacklist: any;
  buildpackname: string;
  buildpackno: string;

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private documentService: DocumentService, private log: NGXLogger) {
  }

  ngOnInit() {
    this.navInit();
    this.buildInit();
  }

  navInit() {
   console.log("navInit")
  }

  buildInit() {
    if (isNullOrUndefined(this.documentService.getDevelopPackList().subscribe(data => {
      console.log("getbuildpacks=" + JSON.stringify(data))

      this.developpack = JSON.stringify(data)
      this.developpacklist = JSON.parse(this.developpack)

   for(var i = 0; i <= this.developpacklist.length; i++){
     if(this.developpacklist!=null){
     }
   }
    }))) {
      this.router.navigate(['document']);
      console.log("getCurrentCatalogNumber")
    }
  }

  buildPackRead(){
    this.documentService.getDevelopPackList().subscribe(data=>{
      this.developpack = JSON.stringify(data)
    })
    this.documentService.getDevelopPacks(DOCUMENTURLConstant.GETDEVELOPPACKS + '/' + this.documentService.getCurrentCatalogNumber()).subscribe(data => {
      this.router.navigate(['document']);
    });
  }

}

