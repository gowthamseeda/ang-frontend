import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { DataFieldVerificationRemainButtonComponent } from './data-field-verification-remain-button.component';
import {BaseData4rService} from "../../../legal-structure/outlet/base-data-4r.service";
import {of} from "rxjs";

describe('DataFieldVerificationremainButtonComponent', () => {
  let component: DataFieldVerificationRemainButtonComponent;
  let fixture: ComponentFixture<DataFieldVerificationRemainButtonComponent>;
  let baseData4rServiceSpy: Spy<BaseData4rService>;

  beforeEach(async () => {
    baseData4rServiceSpy = createSpyFromClass(BaseData4rService);
    baseData4rServiceSpy.subscribeToAllVerificationTasks.mockReturnValue(of([]));
    baseData4rServiceSpy.subscribeToAllCompletedVerificationTasks.mockReturnValue(of([]));
    await TestBed.configureTestingModule({
      declarations: [DataFieldVerificationRemainButtonComponent],
      providers: [
        { provide: BaseData4rService, useValue: baseData4rServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DataFieldVerificationRemainButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setAllRemainVerificationTasks on onBlockRemainClick', () => {
    const aggregateFields = ['field1', 'field2'];
    component.aggregateFields = aggregateFields;

    component.onBlockRemainClick();

    expect(baseData4rServiceSpy.setCompletedVerificationTasks).toHaveBeenCalledWith(aggregateFields);
  });

  it('should handle subscribeToRemainVerificationTasks correctly', () => {
    const tasks = [{ aggregateField: 'field1' }, { aggregateField: 'field2' }];
    const aggregateFields = ['field1', 'field2'];
    component.aggregateFields = aggregateFields;

    baseData4rServiceSpy.subscribeToAllVerificationTasks.mockReturnValue(of(tasks));
    baseData4rServiceSpy.subscribeToAllCompletedVerificationTasks.mockReturnValue(of(aggregateFields));

    component.subscribeToRemainVerificationTasks();

    expect(baseData4rServiceSpy.subscribeToAllVerificationTasks).toHaveBeenCalled();
    expect(baseData4rServiceSpy.subscribeToAllCompletedVerificationTasks).toHaveBeenCalled();
    component.isBlockVerificationsTasksRemained.subscribe(value => {
      expect(value).toBe(false);
    });
  });
});

