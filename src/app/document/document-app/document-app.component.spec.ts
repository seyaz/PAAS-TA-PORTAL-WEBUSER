import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DocumentAppComponent} from "./document-app.component";


describe('DocumentDevelopmentComponent', () => {
  let component: DocumentAppComponent;
  let fixture: ComponentFixture<DocumentAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentAppComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
