import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OpeningHoursLoaderComponent } from './opening-hours-loader.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OpeningHoursLoaderComponent', () => {
  let component: OpeningHoursLoaderComponent;
  let fixture: ComponentFixture<OpeningHoursLoaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OpeningHoursLoaderComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningHoursLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
