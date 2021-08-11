import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {DocumentServiceComponent} from "./document-service.component";

describe('DocumentServiceComponent', () => {
  let component: DocumentServiceComponent;
  let fixture: ComponentFixture<DocumentServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
