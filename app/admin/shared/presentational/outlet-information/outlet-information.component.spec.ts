import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TestingModule } from '../../../../testing/testing.module';
import { OutletInformation } from '../../models/outlet-information.model';

import { OutletInformationComponent } from './outlet-information.component';

const MOCK_MAT_DIALOG_DATA: string[] = [];

describe('OutletInformationComponent', () => {
  let component: OutletInformationComponent;
  let fixture: ComponentFixture<OutletInformationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletInformationComponent],
        imports: [TestingModule, ReactiveFormsModule, MatCheckboxModule],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: MOCK_MAT_DIALOG_DATA },
          {
            provide: MatDialogRef, useValue: {
              close: () => {
              }
            }
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set unchecked values', () => {
    component.setUnchecked([OutletInformation.BUSINESS_NAMES, OutletInformation.ADAM_ID]);
    [OutletInformation.BUSINESS_NAMES, OutletInformation.ADAM_ID].forEach((k) => {
      expect(component.current[k]?.value).toBeFalsy();
    });
  });

  describe('should set checkbox values', () => {
    it('should check checkbox', () => {
      const arr = [
        OutletInformation.SERVICE_OFFER_AND_VALIDITY,
        OutletInformation.OPENING_HOUR,
        OutletInformation.SPECIAL_OPENING_HOUR
      ];
      arr.forEach((k) => {
        component.current[k]!.disabled = false;
        component.current[k]!.value = false;
      });
      component.setAll(OutletInformation.OPENING_HOUR, true, true);
      arr.forEach((k) => {
        expect(component.current[k]?.value).toBeTruthy();
      });
    });

    it('should uncheck checkbox', () => {
      const arr = [
        OutletInformation.SERVICE_OFFER_AND_VALIDITY,
        OutletInformation.OPENING_HOUR,
        OutletInformation.SPECIAL_OPENING_HOUR
      ];
      arr.forEach((k) => {
        component.current[k]!.disabled = false;
        component.current[k]!.value = true;
      });
      component.setAll(OutletInformation.OPENING_HOUR, false);
      expect(component.current[OutletInformation.SERVICE_OFFER_AND_VALIDITY]?.value).toBeTruthy();
      arr.slice(1, -1).forEach((k) => {
        expect(component.current[k]?.value).toBeFalsy();
      });
    });
  });

  it('should get hierarchy', () => {
    const arr = component.getHierarchy(component.default, OutletInformation.SPECIAL_OPENING_HOUR);
    expect(arr).toMatchObject([OutletInformation.SERVICE_OFFER_AND_VALIDITY, OutletInformation.OPENING_HOUR, OutletInformation.SPECIAL_OPENING_HOUR]);
  });

  it('should handle update', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');
    component.current[OutletInformation.BUSINESS_NAMES] = {
      disabled: false,
      value: false,
      label: 'BASE_DATA_BUSINESS_NAME'
    };
    component.update();
    expect(spy).toHaveBeenCalledWith([OutletInformation.BUSINESS_NAMES]);
  });

  it('should handle cancel', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(spy).toHaveBeenCalledWith();
  });
});
