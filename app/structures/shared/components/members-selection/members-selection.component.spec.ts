import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OutletResult } from '../../../../search/shared/outlet-result/outlet-result.model';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { generalGroupMembersMock } from '../../../general-groups/model/general-groups.mock';

import { MembersSelectionComponent } from './members-selection.component';

describe('MembersSelectionComponent', () => {
  let component: MembersSelectionComponent;
  let fixture: ComponentFixture<MembersSelectionComponent>;

  const outletResultMock = {
    active: true,
    city: 'Berlin',
    countryId: 'DE',
    countryName: 'Germany',
    id: '***GS000***00001',
    companyId: 'GC00000001',
    legalName: 'Herbrand GmbH',
    registeredOffice: false,
    street: 'Dieselstraße',
    streetNumber: '6',
    zipCode: '47533',
    brandCodes: ['12345', '54321']
  } as OutletResult;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MembersSelectionComponent, TranslatePipeMock],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle search items retrieved', () => {
    it('should handle search items retrieved', () => {
      const spy = jest.spyOn(component, 'convertToMember').mockReturnValue(
        generalGroupMembersMock[0]
      );
      component.searchItemsRetrieved([
        { id: '', type: '', payload: outletResultMock }
      ]);
      expect(spy).toBeCalledTimes(1);
      expect(component.members.length).toBe(1);
      expect(component.members).toMatchObject(generalGroupMembersMock);
    });

    it('should convert to general group member', () => {
      const generalGroupMember = component.convertToMember(outletResultMock);
      expect(generalGroupMember).toMatchObject(generalGroupMembersMock[0]);
    });

    it('should return brand codes with brandId as empty', () => {
      const generalGroupMember = component.convertToMember(outletResultMock);

      const expectedResult = outletResultMock.brandCodes.map(brandCode => ({ brandId: '', brandCode }));
      expect(generalGroupMember.brandCodes).toEqual(expectedResult)
    });
  });

  it('should reset search items', () => {
    component.members = generalGroupMembersMock;
    component.searchItemsReset();
    expect(component.members.length).toBeFalsy();
  });
});
