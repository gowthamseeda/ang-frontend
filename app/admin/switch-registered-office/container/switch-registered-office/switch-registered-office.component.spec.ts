import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { SearchFilterFlag, SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { GS0000022_outletDetailsMock } from '../../../shared/models/outlet.mock';

import { SwitchRegisteredOfficeComponent } from './switch-registered-office.component';

describe('SwitchRegisteredOfficeComponent', () => {
  let matDialog: MatDialog;
  let component: SwitchRegisteredOfficeComponent;
  let fixture: ComponentFixture<SwitchRegisteredOfficeComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let outletServiceSpy: Spy<OutletService>;

  beforeEach(waitForAsync(() => {
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    outletServiceSpy = createSpyFromClass(OutletService);

    TestBed.configureTestingModule({
      declarations: [SwitchRegisteredOfficeComponent],
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
    fixture = TestBed.createComponent(SwitchRegisteredOfficeComponent);
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
    it('open search dialog for current', done => {
      spyOn(component, 'continueSearchOrDoNothing');
      spyOn(component, 'displayRegisteredOffice');
      spyOn(component, 'verifyShowButtons');
      spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(false) });

      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: GS0000022_outletDetailsMock
      };

      component.changeOutletDetails(component.selectedOutlet);

      expect(component.continueSearchOrDoNothing).toHaveBeenCalled();
      expect(component.displayRegisteredOffice).toHaveBeenCalled();
      expect(component.verifyShowButtons).toHaveBeenCalled();
      done();
    });
  });

  describe('continueSearchOrDoNothing', () => {
    beforeEach(() => {
      spyOn(component, 'changeOutletDetails');
    });

    it('open search dialog for current if its null and previous is selected with data', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: null
      };

      component.continueSearchOrDoNothing();

      expect(component.selectedOutlet.isAddCurrentSelected).toEqual(true);
      expect(component.selectedOutlet.isAddPreviousSelected).toEqual(false);
      expect(component.changeOutletDetails).toHaveBeenCalled();
      done();
    });

    it('no open search dialog for current if its not met condition', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: true,
        current: GS0000022_outletDetailsMock
      };

      component.continueSearchOrDoNothing();

      expect(component.changeOutletDetails).not.toBeCalled();
      done();
    });
  });

  describe('verifyShowButtons', () => {
    it('disable button is off if have current outlet and previous outlet', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: false,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: GS0000022_outletDetailsMock
      };

      component.verifyShowButtons();

      expect(component.isDisabledButton).toBeFalsy();
      done();
    });

    it('disable button is on if have no current outlet and previous outlet', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: false,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: null
      };

      component.verifyShowButtons();

      expect(component.isDisabledButton).toBeTruthy();
      done();
    });

    it('disable button is on if have no current outlet and no previous outlet', done => {
      component.selectedOutlet = {
        isAddPreviousSelected: false,
        previous: null,
        isAddCurrentSelected: false,
        current: null
      };

      component.verifyShowButtons();

      expect(component.isDisabledButton).toBeTruthy();
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
        new SearchFilterTag('companyId=' + GS0000022_outletDetailsMock.companyId)
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

      expect(filterResult).toEqual([new SearchFilterTag('type=BusinessSite')]);
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

      expect(filterResult).toEqual([
        new SearchFilterTag('type=BusinessSite'),
        new SearchFilterFlag('registeredOffice'),
        new SearchFilterTag('companyId=' + GS0000022_outletDetailsMock.companyId)
      ]);
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

      expect(filterResult).toEqual([
        new SearchFilterTag('type=BusinessSite'),
        new SearchFilterFlag('registeredOffice')
      ]);
      done();
    });
  });
});
