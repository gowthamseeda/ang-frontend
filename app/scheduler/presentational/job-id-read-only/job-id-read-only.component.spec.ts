import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobIdReadOnlyComponent } from './job-id-read-only.component';

@Component({
  template: ' <gp-job-id-read-only [jobId]="jobId"></gp-job-id-read-only>'
})
class TestComponent {
  @ViewChild(JobIdReadOnlyComponent)
  public jobStatus: JobIdReadOnlyComponent;
  jobId = 'country';
}

describe('JobIdReadOnlyComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [JobIdReadOnlyComponent]
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
