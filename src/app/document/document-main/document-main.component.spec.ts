import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DocumentMainComponent} from "./document-main.component";


describe('DocumentDevelopmentComponent', () => {
  let component: DocumentMainComponent;
  let fixture: ComponentFixture<DocumentMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentMainComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
