import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterServiceService } from '../master-service/master-service.service';

import { ServicePriorityComponent } from './service-priority.component';

describe('ServicePriorityComponent', () => {
  let component: ServicePriorityComponent;
  let fixture: ComponentFixture<ServicePriorityComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let serviceServiceSpy: Spy<MasterServiceService>;

  beforeEach(
    waitForAsync(() => {
      serviceServiceSpy = createSpyFromClass(MasterServiceService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [ServicePriorityComponent],
        imports: [MatTableModule, TestingModule],
        providers: [
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: MasterServiceService, useValue: serviceServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
