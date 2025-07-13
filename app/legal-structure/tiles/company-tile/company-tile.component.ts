import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ObservableInput } from 'ngx-observable-input';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Country } from '../../../geography/country/country.model';
import { CountryService } from '../../../geography/country/country.service';
import { Company } from '../../company/company.model';
import { OutletService } from '../../shared/services/outlet.service';

@Component({
  selector: 'gp-company-tile',
  templateUrl: './company-tile.component.html',
  styleUrls: ['./company-tile.component.scss']
})
export class CompanyTileComponent implements OnInit, OnDestroy {
  @Input()
  @ObservableInput()
  companyId: Observable<string>;
  @Input()
  @ObservableInput()
  affiliate: Observable<boolean>;
  @Input()
  @ObservableInput()
  authorized: Observable<Boolean>;
  company: Company;
  countryName: string;
  detailsLinkText = '';

  private unsubscribe = new Subject<void>();

  constructor(
    private outletService: OutletService,
    private countryService: CountryService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.authorized.pipe(takeUntil(this.unsubscribe)).subscribe(authorized => {
      this.detailsLinkText = authorized
        ? this.translateService.instant('TILE_DETAILS_EDIT')
        : this.translateService.instant('TILE_DETAILS');
    });
    this.companyId.pipe(takeUntil(this.unsubscribe)).subscribe(companyId => {
      this.getCompanyData(companyId);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getCompanyData(companyId: string): void {
    this.outletService
      .getCompany(companyId)
      .pipe(
        switchMap((company: Company) => {
          this.company = company;
          return this.countryService.get(company.countryId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((country: Country) => {
        const translation =
          country &&
          country.translations &&
          country.translations[this.translateService.currentLang];
        this.countryName = translation;
      });
  }
}
