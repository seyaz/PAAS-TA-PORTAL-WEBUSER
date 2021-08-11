import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {DocumentDevelopmentComponent} from "./document-development.component";

describe('DocumentDevelopmentComponent', () => {
  let component: DocumentDevelopmentComponent;
  let fixture: ComponentFixture<DocumentDevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentDevelopmentComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
