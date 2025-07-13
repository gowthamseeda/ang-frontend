import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { getXMLSchedulerJobs } from '../../model/scheduler.mock';
import { XMLSchedulerJob } from '../../model/scheduler.model';

import { JobStatusComponent } from './job-status.component';

@Component({
  template: '<gp-job-status [job]="job"></gp-job-status>'
})
class TestComponent {
  @ViewChild(JobStatusComponent)
  public jobStatus: JobStatusComponent;
  job: XMLSchedulerJob = getXMLSchedulerJobs()[0];
}

describe('JobStatusComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [JobStatusComponent, TestComponent, TranslatePipeMock]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
