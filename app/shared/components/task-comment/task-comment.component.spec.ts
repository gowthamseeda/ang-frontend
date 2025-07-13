import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCommentComponent } from './task-comment.component';
import { TestingModule } from '../../../testing/testing.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TaskCommentComponent', () => {
  let component: TaskCommentComponent;
  let fixture: ComponentFixture<TaskCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [TaskCommentComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: [{ comment: 'TESTING', creationDate: '2024-06-01T12:00:00', user: 'TESTUSER' }]
        }
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCommentComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On Init', () => {
    const getLatestCommentSpy = spyOn<any>(component, 'getLatestComments');

    component.ngOnInit();

    expect(getLatestCommentSpy).toBeCalled();
  });
});
