import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { appConfigMock } from '../../app-config.mock';
import { AppConfigProvider } from '../../app-config.service';
import { getOutletMock } from '../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../legal-structure/shared/services/outlet.service';
import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';
import { TranslatePipeMock } from '../../testing/pipe-mocks/translate';
import { CurrencyService } from '../currency/currency.service';
import { InvesteeMock } from '../investee/investee.mock';
import { Investee, Investment } from '../investee/investee.model';
import { InvesteeService } from '../investee/investee.service';

import { InvesteeContainerComponent } from './investee-container.component';

const activatedRouteStub = {
  params: new BehaviorSubject({ outletId: 'GS0000001' })
};

const appConfig = appConfigMock;

describe('InvesteeContainerComponent', () => {
  const outlet = getOutletMock();
  const investeeMock = InvesteeMock.asList()[0];

  let outletServiceSpy: Spy<OutletService>;
  let currencyServiceSpy: Spy<CurrencyService>;
  let investeeServiceSpy: Spy<InvesteeService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;

  let component: InvesteeContainerComponent;
  let fixture: ComponentFixture<InvesteeContainerComponent>;

  beforeEach(() => {
    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith({ ...outlet, registeredOffice: true });
    currencyServiceSpy = createSpyFromClass(CurrencyService);
    currencyServiceSpy.getAllIds.nextWith([]);
    currencyServiceSpy.isLoaded.nextWith(true);
    investeeServiceSpy = createSpyFromClass(InvesteeService);
    investeeServiceSpy.isLoaded.nextWith(true);
    investeeServiceSpy.getBy.nextWith(investeeMock);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    routerSpy = createSpyFromClass(Router);

    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
    appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);

    TestBed.configureTestingModule({
      declarations: [InvesteeContainerComponent, TranslatePipeMock],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        },
        {
          provide: OutletService,
          useValue: outletServiceSpy
        },
        {
          provide: CurrencyService,
          useValue: currencyServiceSpy
        },
        {
          provide: InvesteeService,
          useValue: investeeServiceSpy
        },
        {
          provide: SnackBarService,
          useValue: snackBarServiceSpy
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: AppConfigProvider,
          useValue: appConfigProviderSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvesteeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init the investments of the investee', done => {
      component.investments.subscribe(investments => {
        expect(investments).toEqual(investeeMock.investments);
        done();
      });
    });

    it('should init the investments empty if none exist', done => {
      investeeServiceSpy.getBy.nextWith({ ...investeeMock, investments: undefined });

      component.investments.subscribe(investments => {
        expect(investments).toEqual([]);
        done();
      });
    });

    it('should navigate back to main outlet page if is non-RO outlet', () => {
      outletServiceSpy.getOrLoadBusinessSite.nextWith({
        ...outlet,
        id: 'GS0000002',
        registeredOffice: false
      });
      activatedRouteStub.params.next({ outletId: 'GS0000002' });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/outlet/GS0000002']);
    });
  });

  describe('save()', () => {
    it('should call investeeService.save with current Investee', () => {
      component.save();
      fixture.detectChanges();
      expect(investeeServiceSpy.save).toHaveBeenCalledWith(investeeMock);
    });

    it('should call snackbarService.showInfo when save succeeded', () => {
      investeeServiceSpy.save.nextWith(true);
      component.save();
      fixture.detectChanges();
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_SHAREHOLDER_SUCCESS');
    });

    it('should call snackbarService.showError when save fails', () => {
      investeeServiceSpy.save.throwWith('GENERAL_API_ERROR');
      component.save();
      fixture.detectChanges();
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith('GENERAL_API_ERROR');
    });
  });

  describe('cancel()', () => {
    it('should call investeeService.fetchForOutlet', () => {
      component.cancel();
      expect(investeeServiceSpy.clearCache).toHaveBeenCalled();
      expect(investeeServiceSpy.fetchForOutlet).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should call investeeService.update', () => {
      const partialUpdate: Partial<Investee> = {
        id: '7654321',
        shareCapitalCurrency: 'EUR'
      };
      component.update(partialUpdate);
      expect(investeeServiceSpy.update).toHaveBeenCalled();
      expect(investeeServiceSpy.update).toHaveBeenCalledWith(partialUpdate);
    });
  });

  describe('addInvestment()', () => {
    it('should not update the investee when the investor already has an investment', () => {
      const investmentNonUniqueInvestor = {
        investorId: 'GS00000002',
        countryId: 'DE',
        countryName: 'Germany'
      };

      component.addInvestment(investmentNonUniqueInvestor);
      expect(investeeServiceSpy.update).not.toHaveBeenCalled();
    });

    it('should show an error when the investor already has an investment', () => {
      const investmentNonUniqueInvestor = {
        investorId: 'GS00000002',
        countryId: 'DE',
        countryName: 'Germany'
      };

      component.addInvestment(investmentNonUniqueInvestor);
      expect(snackBarServiceSpy.showError).toHaveBeenCalled();
    });

    it('should update the investee with the given investment', () => {
      const investmentUniqueInvestor = {
        investorId: 'GS00000004',
        issuedShareCapitalValue: 0,
        legalName: 'Outlet Name',
        active: true,
        street: 'Street',
        zipCode: 'ZIP123',
        addressAddition: 'Address Addition',
        city: 'City',
        countryName: 'Country Name',
        countryId: 'CH'
      };

      const expectedPartialInvestee: Partial<Investee> = {
        id: '7654321',
        investments: [investeeMock.investments[0], investmentUniqueInvestor]
      };

      component.addInvestment(investmentUniqueInvestor);
      expect(investeeServiceSpy.update).toHaveBeenCalledWith(expectedPartialInvestee);
    });
  });

  describe('removeInvestment()', () => {
    it('should update the investee with the given investment removed', () => {
      const expectedPartialInvestee: Partial<Investee> = { id: '7654321', investments: [] };
      component.removeInvestment('GS00000002');
      expect(investeeServiceSpy.update).toHaveBeenCalledWith(expectedPartialInvestee);
    });
  });

  describe('updateInvestment()', () => {
    it('should update investment with the new value', () => {
      const investment: Partial<Investment> = {
        investorId: 'GS00000002',
        issuedShareCapitalValue: 5000
      };
      const expectedPartialInvestee = {
        id: '7654321',
        investments: [
          {
            ...investeeMock.investments[0],
            ...investment
          }
        ]
      };
      component.updateInvestment(investment);
      expect(investeeServiceSpy.update).toHaveBeenCalledWith(expectedPartialInvestee);
    });

    it('should update investment currency', () => {
      const updateInvestee: Investee = {
        id: 'GS000000002',
        shareCapitalCurrency: 'CHF',
        shareCapitalValue: 100000
      };
      const expectedInvestments = {
        id: '7654321',
        investments: [
          {
            investorId: 'GS00000002',
            issuedShareCapitalCurrency: 'CHF',
            issuedShareCapitalValue: 100000,
            active: true
          }
        ]
      };
      component.updateInvestmentCurrency('GS000000002', updateInvestee);
      expect(investeeServiceSpy.update).toHaveBeenCalledWith(expectedInvestments);
    });

    it('should update investment with the new share', () => {
      const investment: Partial<Investment> = {
        investorId: 'GS00000002',
        issuedShare: 10
      };
      const expectedPartialInvestee = {
        id: '7654321',
        investments: [
          {
            ...investeeMock.investments[0],
            ...investment
          }
        ]
      };
      component.updateInvestment(investment);
      expect(investeeServiceSpy.update).toHaveBeenCalledWith(expectedPartialInvestee);
    });
  });
});
