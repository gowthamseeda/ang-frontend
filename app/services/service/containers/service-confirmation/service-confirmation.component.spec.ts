import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestingModule } from '../../../../testing/testing.module';
import { ServiceConfirmationComponent } from './service-confirmation.component';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { Spy } from 'jest-auto-spies';

describe('ServiceConfirmationComponent', () => {
  let component: ServiceConfirmationComponent;
  let fixture: ComponentFixture<ServiceConfirmationComponent>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceConfirmationComponent],
      imports: [TestingModule],

      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            outletId: 'GS0000001-3',
            servicesToAdd: [],
            servicesToChange: [],
            servicesToRemove: []
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        },
        { provide: OfferedServiceService, useValue: offeredServiceServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle cancel', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
