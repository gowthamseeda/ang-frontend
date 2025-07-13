import {OpeningHourTasksCommentComponent} from "./opening-hour-tasks-comment-component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

describe('OpeningHourTasksCommentComponent', () => {
  let component: OpeningHourTasksCommentComponent;
  let fixture: ComponentFixture<OpeningHourTasksCommentComponent>

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [ OpeningHourTasksCommentComponent ],
      imports: [],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: []
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(OpeningHourTasksCommentComponent)
    component = fixture.componentInstance
    fixture.detectChanges();

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  })
})
