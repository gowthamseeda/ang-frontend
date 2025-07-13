import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { getXMLSchedulerJobs } from '../../model/scheduler.mock';
import { XMLSchedulerJob } from '../../model/scheduler.model';
import { SchedulerTableRow, SchedulerType } from '../../model/scheduler.model';

import { SchedulerTableComponent } from './scheduler-table.component';

@Component({
  template:
    '<gp-scheduler-table [schedulerJobs]="schedulerJobs" [editable]="editable"></gp-scheduler-table>'
})
class TestComponent {
  @ViewChild(SchedulerTableComponent)
  public schedulerTable: SchedulerTableComponent;
  schedulerJobs: Observable<XMLSchedulerJob[]> = of(getXMLSchedulerJobs());
  editable = of(true);
}

describe('SchedulerTableComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SchedulerTableComponent, TestComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit triggerRun', () => {
    const schedulerTableRow: SchedulerTableRow = {
      jobId: 'country',
      jobName: 'country',
      schedule: '0',
      isActive: true,
      isRunning: false,
      lastRunningStatus: '',
      copyFileStorageStatus: '',
      tableType: SchedulerType.XML
    };

    jest.spyOn(component.schedulerTable.triggerRun, 'emit');
    component.schedulerTable.requestRun(schedulerTableRow);

    expect(component.schedulerTable.triggerRun.emit).toHaveBeenCalled();
  });

  it('should emit deleteScheduler', () => {
    jest.spyOn(component.schedulerTable.deleteScheduler, 'emit');
    component.schedulerTable.deleteScheduleJob('2');

    expect(component.schedulerTable.deleteScheduler.emit).toHaveBeenCalledWith('2');
  });
});
