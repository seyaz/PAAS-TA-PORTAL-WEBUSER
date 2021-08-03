import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {isNullOrUndefined, isUndefined} from "util";
import {DocumentService} from "../../document.service";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-document-nav',
  templateUrl: './document-nav.component.html',
  styleUrls: ['./document-nav.component.css']
})
export class DocumentNavComponent implements OnInit {
  translateEntities : any;
  constructor(public documentService: DocumentService, public router: Router) {

  }

  ngOnInit() {
    this.navStyle(1);
  }

  viewMain(number) {
    this.router.navigate(['document']);
    this.documentService.viewPacks(true, true, true);
    this.navStyle(number);
    this.classNavSetting(number);
    this.documentService.navView = 'viewAll';
    this.documentService.buildPackfilter = '';
    this.documentService.buildPackFilter();
    this.documentService.servicePackfilter = '';
    this.documentService.servicePackFilter();
  }

  viewStarterPack(number){
    if(this.router.url !== '/document'){
      this.documentService.check = false;
      this.documentService.classname = '#nav_second';
    }
    this.router.navigate(['document']);
    this.documentService.viewPacks(true, false, false);
    this.navStyle(number);
    this.classNavSetting(number);
    if(number === 2){
    this.documentService.navView = 'appTemplate';}
    else{this.documentService.navView = 'basicType';}
  }

  viewBuildPack(value, number){
    if(this.router.url !== '/document'){
      this.documentService.check = false;
      this.documentService.classname = '#nav_third';
    }
    this.router.navigate(['document']);
    this.documentService.viewPacks(false, true, false); //보여질 pack
    if(!isNullOrUndefined(value)) {
      this.documentService.buildPackfilter = value;
      this.documentService.navView = value;
    }
    else {
      this.documentService.buildPackfilter = '';
      number = 4;
      this.documentService.navView = 'appDevelopment';
    }
    this.documentService.buildPackFilter();
    this.classNavSetting(number);
    this.navStyle(number);
  }

  viewServicePack(value, number){
    if(this.router.url !== '/document'){
      this.documentService.check = false;
      this.documentService.classname = '#nav_fourth';
    }
    this.router.navigate(['document']);
    this.documentService.viewPacks(false, false, true);
    if(!isNullOrUndefined(value)) {
      this.documentService.servicePackfilter = value;

      this.documentService.navView = value;
  }
    else{
      this.documentService.servicePackfilter = '';
      this.documentService.navView = 'service';
      number = 7;
    }
    this.documentService.servicePackFilter();
    this.classNavSetting(number);
    this.navStyle(number);
}

  viewDocument(value, number){
    if(this.router.url !== '/document'){
      this.documentService.check = false;
    }
    this.router.navigate(['document']);
    this.documentService.viewPacks(false, false, false); //보여질 pack

    this.classNavSetting(number);
    this.navStyle(number);
  }

  navSearch(){

  }


  navStyle(number){
    let max = 13;
    let min = 1;
    for(min; min <= max; min++){
      if(number === min){
        $("#document_nav"+min).css('line-height', '54px');
        $("#document_nav"+min).css('color', '#fff');
        $("#document_nav"+min).css('background-color', '#32798c');
        $("#document_nav"+min).css('margin-bottom', '10px');
        $("#document_nav"+min).css('cursor', 'cursor');
        $("#document_nav"+min).css('font-size', '16px');
      }else {
        $("#document_nav"+min).css('line-height', '');
        $("#document_nav"+min).css('color', '');
        $("#document_nav"+min).css('background-color', '');
        $("#document_nav"+min).css('margin-bottom', '');
        $("#document_nav"+min).css('cursor', '');
        $("#document_nav"+min).css('font-size', '');
      }
    }
  }

  classNavSetting(number){
    $('#nav_first').attr('class','');
    $('#nav_second').attr('class','');
    $('#nav_third ').attr('class','');
    $('#nav_fourth').attr('class','');
    if(number == 1){
      $('#nav_first').attr('class','cur');
    } else if(number > 1 && number < 4){
      $('#nav_second').attr('class','cur');
    } else if(number > 3 && number < 7){
      $('#nav_third ').attr('class','cur');
    } else {
      $('#nav_fourth').attr('class','cur');
    }
  }
  }
