import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { TestingModule } from '../../../testing/testing.module';
import { HistorizationService } from '../../service/historization.service';
import { DetailOfferedServiceComponent } from './detail-offered-service.component';

describe('DetailOfferedServiceComponent', () => {
  let component: DetailOfferedServiceComponent;
  let fixture: ComponentFixture<DetailOfferedServiceComponent>;
  let historizationServiceSpy: Spy<HistorizationService>;

  beforeEach(waitForAsync(() => {
    historizationServiceSpy = createSpyFromClass(HistorizationService);
    historizationServiceSpy.getOfferedServiceValidity.nextWith({
      businessSiteId: 'GS0000001',
      offeredServiceId: 'GS0000001-1',
      validities: [
        {
          application: false,
          validFrom: new Date('2013-05-05'),
          valid: true,
          eventName: 'OfferedServiceValidityChanged',
          occurredOn: new Date(Date.parse('2023-03-27T04:31:51.198'))
        }
      ]
    });

    TestBed.configureTestingModule({
      declarations: [DetailOfferedServiceComponent],
      imports: [TestingModule],

      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            outletId: 'GS0000001',
            offeredServiceId: 'GS0000001-3',
            date: '2024-04-16'
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        },
        { provide: HistorizationService, useValue: historizationServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailOfferedServiceComponent);
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
