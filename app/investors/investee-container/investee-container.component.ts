import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, Subject, throwError } from 'rxjs';
import {
  map,
  mergeMap,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap
} from 'rxjs/operators';

import { AppConfigProvider } from '../../app-config.service';
import { Outlet } from '../../legal-structure/shared/models/outlet.model';
import { OutletService } from '../../legal-structure/shared/services/outlet.service';
import { CurrencyService } from '../currency/currency.service';
import { Investee, Investment } from '../investee/investee.model';
import { InvesteeService } from '../investee/investee.service';
import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-investee-container',
  templateUrl: './investee-container.component.html',
  styleUrls: ['./investee-container.component.scss']
})
export class InvesteeContainerComponent implements OnInit, OnDestroy {
  outlet: Observable<Outlet>;
  currencies: Observable<string[]>;
  investee: Observable<Investee | undefined>;
  investments: Observable<ReadonlyArray<Investment>>;
  isLoading: Observable<boolean>;
  isLoaded: Observable<boolean>;
  isValid: boolean;

  private unsubscribe = new Subject<void>();
  private outletId: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private outletService: OutletService,
    private currencyService: CurrencyService,
    private investeeService: InvesteeService,
    private snackBarService: SnackBarService,
    private appConfigProvider: AppConfigProvider
  ) {}

  ngOnInit(): void {
    this.outlet = this.activatedRoute.params.pipe(
      switchMap(({ outletId }) => this.outletService.getOrLoadBusinessSite(outletId)),
      tap(outlet => {
        if (!outlet.registeredOffice) {
          this.router.navigate([`/outlet/${outlet.id}`]);
          this.snackBarService.showInfo('SHAREHOLDERS_NON_RO');
        }
      }),
      takeWhile(outlet => !!outlet.registeredOffice),
      tap(outlet => this.investeeService.fetchForOutlet(outlet.id)),
      tap(outlet => (this.outletId = outlet.id)),
      shareReplay(1)
    );

    this.currencies = this.currencyService.getAllIds();
    this.investee = this.outlet.pipe(mergeMap(outlet => this.investeeService.getBy(outlet.id)));
    this.investments = this.investee.pipe(map(investee => this.getInvestmentsFrom(investee)));
    this.isLoading = this.investeeService.isLoading();
    this.isLoaded = this.initLoaded();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  save(): void {
    this.investee.pipe(take(1)).subscribe(investee => {
      if (investee) {
        this.investeeService
          .save(investee)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            () => this.snackBarService.showInfo('UPDATE_SHAREHOLDER_SUCCESS'),
            error => this.snackBarService.showError(error)
          );
      }
    });
  }

  cancel(): void {
    this.investeeService.clearCache();
    this.investeeService.fetchForOutlet(this.outletId);
  }

  update(investee: Partial<Investee>): void {
    this.investeeService.update({ id: this.outletId, ...investee } as Partial<Investee>);
    this.updateInvestmentCurrency(this.outletId, investee as Investee);
  }

  validityChange(valid: boolean): void {
    if (this.isValid !== valid) {
      this.isValid = valid;
    }
  }

  addInvestment(investment: Investment): void {
    combineLatest([this.investee, this.outletService.getOrLoadBusinessSite(investment.investorId)])
      .pipe(
        take(1),
        mergeMap(([investee, outlet]) =>
          this.getUniqueInvestmentsFor(
            this.createInvestment(investment.investorId, outlet),
            investee
          )
        )
      )
      .subscribe(
        investments => this.investeeService.update({ id: this.outletId, investments }),
        error => this.snackBarService.showError(error)
      );
  }

  removeInvestment(investorId: string): void {
    this.investee
      .pipe(
        take(1),
        map(investee =>
          investee?.investments?.filter(investment => investment.investorId !== investorId)
        )
      )
      .subscribe(investments => this.investeeService.update({ id: this.outletId, investments }));
  }

  updateInvestmentCurrency(investorId: string, updateInvestee: Investee): void {
    this.investee
      .pipe(
        take(1),
        map(investee =>
          investee?.investments
            ?.filter(investment => investment.investorId !== investorId)
            .map(investment => {
              return {
                ...investment,
                issuedShareCapitalCurrency: updateInvestee?.shareCapitalCurrency
              };
            })
        )
      )
      .subscribe(investments => {
        this.investeeService.update({ id: this.outletId, investments });
      });
  }

  updateInvestment(investment: Partial<Investment>): void {
    this.investee
      .pipe(
        take(1),
        mergeMap(investee => this.getUpdatedInvestmentsFor(investment, investee))
      )
      .subscribe(
        investments => this.investeeService.update({ id: this.outletId, investments }),
        error => this.snackBarService.showError(error)
      );
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  private initLoaded(): Observable<boolean> {
    return combineLatest([this.currencyService.isLoaded(), this.investeeService.isLoaded()]).pipe(
      map(([currencyLoaded, investeeLoaded]) => currencyLoaded && investeeLoaded)
    );
  }

  private getInvestmentsFrom(investee?: Investee): Investment[] {
    return investee?.investments || [];
  }

  private getUniqueInvestmentsFor(
    newInvestment: Investment,
    investee?: Investee
  ): Observable<Investment[]> {
    const existingInvestments = this.getInvestmentsFrom(investee);
    return existingInvestments.find(
      investment => investment.investorId === newInvestment.investorId
    )
      ? throwError(new Error('UPDATE_INVESTMENTS_DUPLICATE'))
      : of([...existingInvestments, newInvestment]);
  }

  private getUpdatedInvestmentsFor(
    investment: Partial<Investment>,
    investee?: Investee
  ): Observable<Investment[]> {
    const existingInvestments = this.getInvestmentsFrom(investee);
    return existingInvestments.length === 0
      ? throwError(new Error('UPDATE_INVESTMENT_NOT_FOUND'))
      : of(
          existingInvestments.map(item => {
            if (item.investorId !== investment.investorId) {
              return item;
            }

            return {
              ...item,
              ...investment
            };
          })
        );
  }

  private createInvestment(businessSiteId: string, outlet: Outlet): Investment {
    const {
      active,
      legalName,
      address: { street, addressAddition, zipCode, city },
      countryId,
      countryName
    } = outlet;
    return {
      investorId: businessSiteId,
      active,
      legalName,
      street,
      addressAddition,
      zipCode,
      city,
      countryId,
      countryName,
      issuedShareCapitalValue: 0
    };
  }
}
