import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOutletsDialogComponent } from './select-outlets-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SisterOutletState } from '../../../offered-service/store/reducers/sister-outlet.reducer';
import { of } from 'rxjs';
import { OfferedServiceServiceActions } from '../../../offered-service/store/actions';
import {
  copyToCompanyDialogDataMock,
  queryCompanySisterOutletPayloadMock
} from '../../models/copy-to-company-dialog-data.mock';
import { offeredServicesMock, sisterOutletMock } from '../../models/sister-outlet.mock';
 
describe('SelectOutletsDialogComponent', () => {
  let component: SelectOutletsDialogComponent;
  let fixture: ComponentFixture<SelectOutletsDialogComponent>;
  let store: MockStore<SisterOutletState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectOutletsDialogComponent, TranslatePipeMock],
      imports: [MatDialogModule, MatCheckboxModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: copyToCompanyDialogDataMock
        },
        provideMockStore()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOutletsDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    jest.spyOn(component['offeredServiceService'], 'fetchCompanySisterOutlets');
    jest.spyOn(component['offeredServiceService'], 'getCompanySisterOutletsFullResponse').mockReturnValue(of({
      sisterOutlets: sisterOutletMock.sisterOutlets,
      offeredServices: [
        ...offeredServicesMock,
        { id: 'OS3', brandId: 'MB', productCategoryId: 1, productGroupId: 'PC', serviceId: 120, businessSite: { id: 'SELF' } }
      ]
    }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('OnInit', () => {
    const expectedAction = OfferedServiceServiceActions.queryCompanySisterOutlet(
      queryCompanySisterOutletPayloadMock
    );

    component.data.selfOutletId = 'SELF';
    component.ngOnInit();

    expect(component.selectedOutlets).toEqual(copyToCompanyDialogDataMock.selectedOutletIdsToCopy);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(component['offeredServiceService'].fetchCompanySisterOutlets)
      .toHaveBeenCalledWith(copyToCompanyDialogDataMock.companyId, copyToCompanyDialogDataMock.serviceIds);
    expect(component.outlets).toEqual([
      sisterOutletMock.sisterOutlets[0],
      sisterOutletMock.sisterOutlets[1]
    ]);
    expect(component.allOutletOfferedServices).toEqual([
      offeredServicesMock[0],
      offeredServicesMock[1]
    ]);
  });

  it('should set selectAll true if all outlets are selected in initSisterOutlets', () => {
    component.data.selfOutletId = 'SELF';  
    component.selectedOutlets = ['GS01', 'GS02'];
    component.initSisterOutlets();
    component.selectAll = component.selectedOutlets.length === component.outlets.length;
    expect(component.outlets).toEqual([
      sisterOutletMock.sisterOutlets[0],
      sisterOutletMock.sisterOutlets[1]
    ]);
    expect(component.allOutletOfferedServices).toEqual([
      offeredServicesMock[0],
      offeredServicesMock[1]
    ]);
  });

  describe('on select outlet', () => {
    it('should add outlet id if not exist in list', () => {
      component.onSelectOutlet('GS02');
      expect(component.selectedOutlets).toContain('GS02');
    });

    it('should remove outlet id if exist in list', () => {
      component.onSelectOutlet('GS01');
      expect(component.selectedOutlets).not.toContain('GS01');
    });
  });

  describe('on toggle select all', () => {
    it('should push all outlet ids if checked', () => {
      component.selectAll = false;
      component.onSelectAllChange();
      expect(component.selectedOutlets).toHaveLength(component.outlets.length);
    });

    it('should remove all outlet ids if unchecked', () => {
      component.selectAll = true;
      component.onSelectAllChange();
      expect(component.selectedOutlets).toHaveLength(0);
    });
  });

  describe('onSave', () => {
    let dialogRefSpy: { close: jest.Mock };

    beforeEach(() => {
      dialogRefSpy = { close: jest.fn() };
      component.dialogRef = dialogRefSpy as any;

      component.selectedOutlets = ['GS01'];
      component.allOutletOfferedServices = [
        { id: 'OS2', businessSite: { id: 'GS02' } } as any,
        { id: 'OS1', businessSite: { id: 'GS01' } } as any
      ];
    });

    it('should close dialog with selectedOutletIdsToCopy and filtered selectedOutletOfferedServices', () => {
      component.selectedOutlets = ['GS01'];
      component.onSave();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        selectedOutletIdsToCopy: ['GS01'],
        selectedOutletOfferedServices: [
          { id: 'OS1', businessSite: { id: 'GS01' } }
        ]
      });
    });

    it('should return an empty array if no selected outlets match', () => {
      component.selectedOutlets = ['GS99'];
      component.onSave();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        selectedOutletIdsToCopy: ['GS99'],
        selectedOutletOfferedServices: []
      });
    });

    it('should return all services if all outlets are selected', () => {
      component.selectedOutlets = ['GS01', 'GS02'];
      component.onSave();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        selectedOutletIdsToCopy: ['GS01', 'GS02'],
        selectedOutletOfferedServices: [
          { id: 'OS2', businessSite: { id: 'GS02' } },
          { id: 'OS1', businessSite: { id: 'GS01' } }
        ]
      });
    });
  });
});
