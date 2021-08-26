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

   portalguide ='# PaaS-TA 사용자 포탈 가이드\n' +
    '## 목차\n' +
    '- 1. 문서 개요····························································································································································\n' +
    '   - 1.1. 목적·····················································································································································\n' +
    '   - 1.2. 범위·····················································································································································\n' +
    '- 2. PaaS-TA 사용자 포탈 접속······························································································································\n' +
    '   - 2.1. PaaS-TA 사용자 포탈 접속············································································································\n' +
    '- 3. PaaS-TA 사용자 포탈 매뉴얼··························································································································\n' +
    '   - 3.1. PaaS-TA 사용자 포탈 메뉴 구성··································································································\n' +
    '   - 3.2. PaaS-TA 사용자 포탈 메뉴 설명··································································································\n' +
    '   - 3.2.1. 대시보드·············································································································································\n' +
    '   - 3.2.1.1. 조직 및 공간·····································································································································\n' +
    '   - 3.2.2. 카탈로그···········································································································································\n' +
    '   - 3.2.2.1. 카탈로그 검색·································································································································\n' +
    '   - 3.2.3. 내 계정·············································································································································\n' +
    '   - 3.2.3.1. 프로필···············································································································································\n' +
    '   - 3.2.3.2. 로그인 정보·····································································································································\n' +
    '   - 3.2.3.2.1.비밀번호 변경·································································································································\n' +
    '   - 3.2.3.3. 사용자 정보·····································································································································\n' +
    '   - 3.2.3.3.1.사용자 이름·····································································································································\n' +
    '   - 3.2.3.3.2.사용자 전화번호·····························································································································\n' +
    '   - 3.2.3.3.3.사용자 우편번호·····························································································································\n' +
    '   - 3.2.3.3.4.사용자 주소·····································································································································\n' +
    '   - 3.2.3.4. 나의 조직·········································································································································\n' +
    '   - 3.2.3.5. 계정 삭제·········································································································································\n' +
    '   - 3.2.3.6. 로그아웃···········································································································································<br/>\n' +
    '\n' +
    '\n' +
    '## 1. **문서 개요**<br/><br/>\n' +
    '### **1.1.목적**<br/>\n' +
    '본 문서는 PaaS-TA 사용자 포탈 사용 방법에 대해 기술하였다.<br/><br/>\n' +
    '### **1.2.범위**<br/>\n' +
    '본 문서는 Windows 환경을 기준으로 PaaS-TA 사용자 포탈을 사용하는 방법에 대해 작성되었다.<br/><br/>\n' +
    '## 2. **PaaS-TA 사용자 포탈 접속**<br/>\n' +
    '```\n' +
    '### ** 2.1PaaS-TA 사용자 포탈 접속**<br/>\n' +
    '```\n' +
    '1. PaaS-TA 사용자 포탈에 접속한다.<br/>\n' +
    '![user_image01]<br/>\n' +
    '2. “로그인” 버튼을 클릭한다.<br/>\n' +
    '![user_image02]<br/>\n' +
    '3. 사용자 계정과 비밀번호를 입력한 후 “LOGIN” 버튼을 클릭하여 사용자 포탈에 로그인한다.<br/>\n' +
    '![user_image03]<br/>\n' +
    '4. 로그인 시 대시보드 페이지로 이동된다.<br/>\n' +
    '![user_image04]<br/><br/><br/>\n' +
    '\n' +
    '\n' +
    '| 분류 | 메뉴 | 설명 | \n' +
    '| --- | :--- | :---: |\n' +
    '| 애플리케이션 관리| 대시보드| 애플리케이션, 서비스, 등을 관리| \n' +
    '| 개발환경, 서비스 생성 | 카탈로그|  애플리케이션 개발환경 및 서비스 생성 |\n' +
    '| 정보조회| 나의 메뉴 | 내 계정 정보, 내 문의 내역 등을 관리|<br/><br/>\n' +
    '\n' +
    '## 3. **PaaS-TA 사용자 포탈 매뉴얼**<br/>\n' +
    '본 장에서는 PaaS-TA 사용자 포탈의 메뉴 구성 및 화면 설명에 대해서 기술하였다.<br/>\n' +
    '```\n' +
    '### 3.1. PaaS-TA 사용자 포탈 메뉴 구성<br/>\n' +
    '```\n' +
    'PaaS-TA 사용자 포탈은 애플리케이션을 관리하는 부분과 개발환경 및 서비스를 생성하는 부분 등으로 구성되어있다.<br/>\n' +
    '### 3.2. **PaaS-TA 사용자 포탈 메뉴 설명**<br/>\n' +
    '본 장에서는 PaaS-TA 사용자 포탈의 메뉴에 대한 설명을 기술한다.<br/><br/>\n' +
    '### 3.2.1. **대시보드**<br/>\n' +
    '1. 상단 메뉴의 “대시보드” 버튼을 클릭하면 대시보드 페이지로 이동한다.<br/>\n' +
    '![user_image05]<br/><br/>\n' +
    '### 3.2.1.1. **조직 및 공간**<br/><br/>\n' +
    '1. ① "조직관리" 링크 클릭 또는 우측 메뉴의 ②"조직관리"를 클릭하여 조직 대시보드 페이지로 이동한다.<br/>\n' +
    '![user_image06]<br/>\n' +
    '2. ① 세부사항보기를 클릭한다.<br/>\n' +
    '![user_image07]<br/>\n' +
    '3. 해당 조직의 공간,도메인,사용자,할당량을 확인할 수 있다.<br/>\n' +
    '![user_image08]<br/>\n' +
    '4. ① “공간” 을 클릭한다.<br/>\n' +
    '![user_image09]<br/>\n' +
    '5. 해당 사용자의 부여되어있는 역할을 확인할 수 있다.<br/>\n' +
    '![user_image10]<br/>\n' +
    '6. 역할설명을 클릭한다.<br/>  \n' +
    '![user_image11]<br/>\n' +
    '7. 각각 역할들의 설명을 확인할 수 있다.<br/>\n' +
    '![user_image12]<br/><br/>\n' +
    '## **3.2.1.2. 애플리케이션 및 서비스 개발환경**<br/><br/>\n' +
    '### 3.2.1.2.1. **애플리케이션 관리**<br/>\n' +
    '![user_image13]<br/><br/>\n' +
    '### 3.2.1.2.1.1. **애플리케이션 생성**<br/>\n' +
    '1."대시보드" 메뉴를 클릭하여 대시보드 페이지로 이동한다. 대시보드의 조직과 공간을 설정하고, 애플리케이션 탭 메뉴를 선택한다.<br/>\n' +
    '![user_image14]<br/>\n' +
    '2.① "+" 클릭하여 카탈로그 메뉴로 이동한다.<br/>\n' +
    '![user_image15]<br/>\n' +
    '3.카탈로그 목록 ① 앱 개발환경을 클릭한다. 생성 할 앱 개발 환경을 선택한다.<br/>\n' +
    '![user_image16]<br/>\n' +
    '4.앱 개발환경 생성에 필요한 항목을 입력후 ‘생성” 버튼을 클릭하여 앱 개발환경 생성을 완료한다.<br/>\n' +
    '![user_image17]<br/>\n' +
    '-조직 목록 에서 조직을 선택한다.<br/><br/>\n' +
    '-공간 목록 에서 공간을 선택한다.<br/><br/>\n' +
    '-앱 이름을 입력한다.  앱 URL 은 자동으로 입력되지만 수정 가능하다.<br/><br/>\n' +
    '-메모리 목록 에서 메모리 용량을 선택한다.<br/><br/>\n' +
    '-디스크 목록 에서 디스크 용량을 선택한다.<br/><br/>\n' +
    '-앱 업로드 에서 업로드 할 파일을 선택한다.<br/><br/>\n' +
    '-앱 시작여부를 설정한다.<br/><br/>\n' +
    '## **3.2.2.카탈로그**<br/>\n' +
    '1.상단 메뉴의 “카탈로그” 버튼을 클릭하면 카탈로그 화면페이지로 이동한다.<br/>\n' +
    '![user_image18]<br/>\n' +
    '### 3.2.2.1. **카탈로그 검색**<br/>\n' +
    '1.① Catalog Search 에서 검색어를 입력하면 자동으로 검색 결과가 출력된다.<br/>\n' +
    '![user_image19]<br/><br/>\n' +
    '## **3.2.3. 내 계정**<br/>\n' +
    '1.우측 메뉴의 "내 계정"을 클릭하여 내계정 대시보드로 이동한다.<br/>\n' +
    '![user_image20]<br/>\n' +
    '### 3.2.3.1. **프로필**<br/>\n' +
    '1.① 프로필 사진을 클릭한다 ② 프로필 사진 변경 폼 레이어를 팝업 한다.<br/>\n' +
    '![user_image21]<br/>\n' +
    '2.변경할 프로필 사진을 선택한 후, “사진등록”버튼을 클릭하여 프로필 사진 변경을 완료한다.<br/>\n' +
    '![user_image22]<br/><br/>\n' +
    '## 3.2.3.2. **로그인 정보**<br/>\n' +
    '![user_image23]<br/>\n' +
    '### 3.2.3.2.1. **비밀번호 변경**<br/>\n' +
    '1.①“메모장” 버튼을 클릭한다.<br/>\n' +
    '![user_image24]<br/>\n' +
    '2.현재 비밀번호와 새 비밀번호를 입력한다. “변경하기” 버튼을 클릭하여 비밀번호 변경을 완료한다.<br/>\n' +
    '![user_image25]<br/><br/>\n' +
    '## 3.2.3.3. **사용자 정보**<br/>\n' +
    '![user_image26]<br/>\n' +
    '### 3.2.3.3.1. **사용자 이름**<br/>\n' +
    '1.새 이름을 입력할 때 한글, 영문, 숫자만 입력만 가능합니다. "변경하기" 버튼을 클릭하여 이름 변경을 완료한다.<br/>\n' +
    '![user_image27]<br/>\n' +
    '### 3.2.3.3.2. **사용자 전화번호**<br/>\n' +
    '1.새 전화번호를 입력할 때 "-"제외 한 숫자 입력만 가능하다. "변경하기" 버튼을 클릭하여 전화번호 변경을 완료한다<br/>.\n' +
    '![user_image28]<br/>\n' +
    '### 3.2.3.3.3. **사용자 우편번호**<br/>\n' +
    '1.새 우편번호를 입력할 때 15 자 이하의 숫자와 영문 입력만 가능하다. "변경하기" 버튼을 클릭하여 우편번호 변경을 완료한다.<br/>\n' +
    '![user_image29]<br/>\n' +
    '### 3.2.3.3.4. **사용자 주소**<br/>\n' +
    '1.새 주소를 입력할 때 256 자 이하의 한글, 영문, 숫자만 가능하다. "변경하기" 버튼을 클릭하여 이름 변경을 완료한다.<br/>\n' +
    '![user_image30]<br/><br/>\n' +
    '## 3.2.3.4. **나의 조직**<br/>\n' +
    '![user_image31]<br/>\n' +
    '### 3.2.3.5. **계정 삭제**<br/>\n' +
    '1.“계정삭제” 버튼을 클릭한다. <br/> \n' +
    '![user_image32]<br/>\n' +
    ' 2.계정 삭제 확인 팝업에서 사용자 계정과 비밀번호를 입력한다. “삭제”버튼을 클릭하여 계정삭제를 완료한다.<br/>\n' +
    '![user_image33]<br/><br/>\n' +
    '## 3.2.3.6. **로그아웃**<br/>\n' +
    '1.좌측 메뉴의 “로그아웃”을 클릭한다.<br/>\n' +
    '![user_image34]<br/>\n' +
    '\n' +
    '\n' +
    '\n' +
    '[user_image01]:../../../assets/resources/images/document/userguide/user_image01.png\n' +
    '[user_image02]:../../../assets/resources/images/document/userguide/user_image02.png\n' +
    '[user_image03]:../../../assets/resources/images/document/userguide/user_image03.png\n' +
    '[user_image04]:../../../assets/resources/images/document/userguide/user_image04.png\n' +
    '[user_image05]:../../../assets/resources/images/document/userguide/user_image05.png\n' +
    '[user_image06]:../../../assets/resources/images/document/userguide/user_image06.png\n' +
    '[user_image07]:../../../assets/resources/images/document/userguide/user_image07.png\n' +
    '[user_image08]:../../../assets/resources/images/document/userguide/user_image08.png\n' +
    '[user_image09]:../../../assets/resources/images/document/userguide/user_image09.png\n' +
    '[user_image10]:../../../assets/resources/images/document/userguide/user_image10.png\n' +
    '[user_image11]:../../../assets/resources/images/document/userguide/user_image11.png\n' +
    '[user_image12]:../../../assets/resources/images/document/userguide/user_image12.png\n' +
    '[user_image13]:../../../assets/resources/images/document/userguide/user_image13.png\n' +
    '[user_image14]:../../../assets/resources/images/document/userguide/user_image14.png\n' +
    '[user_image15]:../../../assets/resources/images/document/userguide/user_image15.png\n' +
    '[user_image16]:../../../assets/resources/images/document/userguide/user_image16.png\n' +
    '[user_image17]:../../../assets/resources/images/document/userguide/user_image17.png\n' +
    '[user_image18]:../../../assets/resources/images/document/userguide/user_image18.png\n' +
    '[user_image19]:../../../assets/resources/images/document/userguide/user_image19.png\n' +
    '[user_image20]:../../../assets/resources/images/document/userguide/user_image20.png\n' +
    '[user_image21]:../../../assets/resources/images/document/userguide/user_image21.png\n' +
    '[user_image22]:../../../assets/resources/images/document/userguide/user_image22.png\n' +
    '[user_image23]:../../../assets/resources/images/document/userguide/user_image23.png\n' +
    '[user_image24]:../../../assets/resources/images/document/userguide/user_image24.png\n' +
    '[user_image25]:../../../assets/resources/images/document/userguide/user_image25.png\n' +
    '[user_image26]:../../../assets/resources/images/document/userguide/user_image26.png\n' +
    '[user_image27]:../../../assets/resources/images/document/userguide/user_image27.png\n' +
    '[user_image28]:../../../assets/resources/images/document/userguide/user_image28.png\n' +
    '[user_image29]:../../../assets/resources/images/document/userguide/user_image29.png\n' +
    '[user_image30]:../../../assets/resources/images/document/userguide/user_image30.png\n' +
    '[user_image31]:../../../assets/resources/images/document/userguide/user_image31.png\n' +
    '[user_image32]:../../../assets/resources/images/document/userguide/user_image32.png\n' +
    '[user_image33]:../../../assets/resources/images/document/userguide/user_image33.png\n' +
    '[user_image34]:../../../assets/resources/images/document/userguide/user_image34.png\n';

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

