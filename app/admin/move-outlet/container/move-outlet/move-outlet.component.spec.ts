import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { SearchFilterFlag, SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { OutletInformationComponent } from '../../../shared/presentational/outlet-information/outlet-information.component';
import { OutletInformation } from '../../../shared/models/outlet-information.model';
import { UpdateMoveOutlet } from '../../service/api/actions.model';

import { MoveOutletComponent } from './move-outlet.component';
import { GS0000022_outletDetailsMock } from '../../../shared/models/outlet.mock';

describe('MoveOutletComponent', () => {
  let matDialog: MatDialog;

  let component: MoveOutletComponent;
  let fixture: ComponentFixture<MoveOutletComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let outletServiceSpy: Spy<OutletService>;

  beforeEach(waitForAsync(() => {
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    outletServiceSpy = createSpyFromClass(OutletService);

    TestBed.configureTestingModule({
      declarations: [MoveOutletComponent],
      imports: [TestingModule, MatDialogModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn()
          }
        },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: OutletService, useValue: outletServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    matDialog = TestBed.inject(MatDialog);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('init', done => {
      spyOn(component, 'initOutlet');
      component.ngOnInit();

      expect(component.isLoading).toBeFalsy();
      expect(component.isDisabledButton).toBeTruthy();
      expect(component.isResponded).toBeFalsy();
      expect(component.initOutlet).toHaveBeenCalled();
      done();
    });
  });

  describe('initOutlet()', () => {
    it('set default outlet values', done => {
      component.initOutlet();

      expect(component.selectedOutlet.current).toBeNull();
      expect(component.selectedOutlet.previous).toBeNull();
      done();
    });
  });

  describe('changeOutletDetails', () => {
    it('open search dialog', done => {
      spyOn(component, 'continueSearchOrDoNothing');
      spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(false) });

      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: GS0000022_outletDetailsMock
      };

      component.changeOutletDetails(component.selectedOutlet);

      expect(component.continueSearchOrDoNothing).toHaveBeenCalled();
      done();
    });
  });

  describe('continueSearchOrDoNothing()', () => {
    beforeEach(() => {
      spyOn(component, 'changeOutletDetails');
    });

    it('Previous outlet not NULL, isAddPreviousSelected is TRUE, but current outlet is EMPTY ', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: null
      };

      component.continueSearchOrDoNothing();
      expect(component.selectedOutlet.isAddPreviousSelected).toBeFalsy();
      expect(component.selectedOutlet.isAddCurrentSelected).toBeTruthy();
      expect(component.changeOutletDetails).toHaveBeenCalled();
      done();
    });

    it('Current outlet not NULL, isAddCurrentSelected is TRUE, but previous outlet is EMPTY ', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: false,
        previous: null,
        isAddCurrentSelected: true,
        current: GS0000022_outletDetailsMock
      };

      component.continueSearchOrDoNothing();

      expect(component.selectedOutlet.isAddPreviousSelected).toBeTruthy();
      expect(component.selectedOutlet.isAddCurrentSelected).toBeFalsy();
      expect(component.changeOutletDetails).toHaveBeenCalled();
      done();
    });

    it('Previous outlet not NULL, isAddPreviousSelected is TRUE, current outlet not EMPTY ', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: GS0000022_outletDetailsMock
      };

      component.continueSearchOrDoNothing();

      expect(component.selectedOutlet.isAddPreviousSelected).toBeTruthy();
      expect(component.selectedOutlet.isAddCurrentSelected).toBeFalsy();
      expect(component.changeOutletDetails).not.toHaveBeenCalled();
      done();
    });

    it('Current outlet not NULL, isAddCurrentSelected is TRUE, previous outlet not EMPTY ', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: false,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: true,
        current: GS0000022_outletDetailsMock
      };

      component.continueSearchOrDoNothing();

      expect(component.selectedOutlet.isAddPreviousSelected).toBeFalsy();
      expect(component.selectedOutlet.isAddCurrentSelected).toBeTruthy();
      expect(component.changeOutletDetails).not.toHaveBeenCalled();
      done();
    });
  });

  describe('filterCurrentSearch', () => {
    it('have previous outlet data and it filter with PREVIOUS companyId', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: false,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: true,
        current: null
      };

      const filterResult = component.filterCurrentSearch(component.selectedOutlet);

      expect(filterResult).toEqual([
        new SearchFilterTag('type=BusinessSite'),
        new SearchFilterFlag('registeredOffice')
      ]);
      done();
    });

    it('have NO previous outlet data and it with default filter', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: false,
        previous: null,
        isAddCurrentSelected: true,
        current: null
      };

      const filterResult = component.filterCurrentSearch(component.selectedOutlet);

      expect(filterResult).toEqual([
        new SearchFilterTag('type=BusinessSite'),
        new SearchFilterFlag('registeredOffice')
      ]);
      done();
    });
  });

  describe('filterPreviousSearch', () => {
    it('have current outlet data and it filter with CURRENT companyId', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: null,
        isAddCurrentSelected: false,
        current: GS0000022_outletDetailsMock
      };

      const filterResult = component.filterPreviousSearch(component.selectedOutlet);

      expect(filterResult).toEqual([new SearchFilterTag('type=BusinessSite')]);
      done();
    });

    it('have NO current outlet data and it with default filter', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: false,
        previous: null,
        isAddCurrentSelected: true,
        current: null
      };

      const filterResult = component.filterPreviousSearch(component.selectedOutlet);

      expect(filterResult).toEqual([new SearchFilterTag('type=BusinessSite')]);
      done();
    });
  });

  describe('openOutletInformationDialog', () => {
    it('should open with default outlet information', done => {
      spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(false) });
      const uncheckedKeys = [OutletInformation.SPECIAL_OPENING_HOUR];
      component.uncheckedKeys = uncheckedKeys;
      component.openOutletInformationDialog();
      expect(matDialog.open).toHaveBeenCalledWith(OutletInformationComponent, {
        data: uncheckedKeys
      });
      done();
    });

    it('should update outlet information section after closed', done => {
      const uncheckedKeys = [OutletInformation.SPECIAL_OPENING_HOUR];
      spyOn(matDialog, 'open').and.returnValue({
        afterClosed: () => of(uncheckedKeys)
      });
      component.openOutletInformationDialog();
      expect(component.uncheckedKeys).toMatchObject(uncheckedKeys);
      done();
    });
  });

  describe('mapToUpdateResource', () => {
    it('should map company id with empty to be removed outlet informations', () => {
      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: GS0000022_outletDetailsMock
      };

      const expected: UpdateMoveOutlet = {
        companyId: GS0000022_outletDetailsMock.companyId,
        toBeRemovedOutletInformations: []
      };

      expect(component.mapToUpdateResource()).toEqual(expected);
    });

    it('should map into to be removed outlet informations if information is not disabled and value is false', () => {
      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: GS0000022_outletDetailsMock
      };

      const uncheckedKeys = [
        OutletInformation.BUSINESS_NAMES,
        OutletInformation.BRAND_LABEL,
        OutletInformation.OPENING_HOUR
      ];

      component.uncheckedKeys = uncheckedKeys;

      const expected: UpdateMoveOutlet = {
        companyId: GS0000022_outletDetailsMock.companyId,
        toBeRemovedOutletInformations: uncheckedKeys
      };

      expect(component.mapToUpdateResource()).toEqual(expected);
    });
  });
});
