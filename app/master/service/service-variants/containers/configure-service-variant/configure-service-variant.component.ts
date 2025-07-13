import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { SnackBarService } from '../../../../../shared/services/snack-bar/snack-bar.service';
import { MasterBrandService } from '../../../../brand/master-brand/master-brand.service';
import { MasterCountry } from '../../../../country/master-country/master-country.model';
import { MasterCountryService } from '../../../../country/master-country/master-country.service';
import { MasterProductGroupService } from '../../../../product-group/master-product-group/master-product-group.service';
import { MasterServiceService } from '../../../master-service/master-service.service';
import {
  MasterServiceVariant,
  MasterServiceVariantUpdate
} from '../../master-service-variant/master-service-variant.model';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';
import {
  MasterServiceVariantResponse,
  ServiceVariantResponse
} from '../../models/service-variant-configure.model';
import { ServiceVariantRouteDataService } from '../../services/service-variant-route-data.service';

@Component({
  selector: 'gp-configure-service-variant',
  templateUrl: './configure-service-variant.component.html',
  styleUrls: ['./configure-service-variant.component.scss']
})
export class ConfigureServiceVariantComponent implements OnInit, OnDestroy {
  pristineCountriesId: string[];
  countryRestrictionIds: string[];
  serviceVariants: MasterServiceVariantUpdate[];
  selectedServiceVariant: MasterServiceVariant[];
  saveButtonDisabled: boolean;
  errorMessage: string;
  isLoading = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private countryService: MasterCountryService,
    private serviceVariantService: MasterServiceVariantService,
    private serviceVariantRouteDataService: ServiceVariantRouteDataService,
    private snackBarService: SnackBarService,
    private masterBrandService: MasterBrandService,
    private masterProductGroupService: MasterProductGroupService,
    private masterServiceService: MasterServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetErrorMessage();
    this.initPristineCountriesId();
    this.initDataDisplay();
    this.saveButtonDisabled = true;
  }

  ngOnDestroy(): void {
    this.resetErrorMessage();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initDataDisplay(): void {
    const serviceVariants: MasterServiceVariant[] = [];
    if (this.serviceVariantRouteDataService.selectedServiceVariantIds !== undefined) {
      this.serviceVariantRouteDataService.selectedServiceVariantIds.forEach(id => {
        this.serviceVariantService.getBy(id).subscribe(serviceVariant => {
          serviceVariants.push(serviceVariant);
        });
      });

      this.countryRestrictionIds = this.getCountryRestrictionIds(serviceVariants);
    }

    this.selectedServiceVariant = serviceVariants;
  }

  restrictedCountries(countries: MasterCountry[]): void {
    this.countryRestrictionIds = countries.map(country => {
      return country.id;
    });
  }

  cancel(): void {
    this.resetErrorMessage();
    this.initDataDisplay();
  }

  serviceVariantToUpdate(serviceVariants: MasterServiceVariantUpdate[]): void {
    this.serviceVariants = serviceVariants;
  }

  hasValidChange(isValid: boolean): void {
    this.saveButtonDisabled = !isValid || this.serviceVariants?.length === 0;
  }

  canDeactivate(): boolean {
    return this.saveButtonDisabled;
  }

  edit(): void {
    this.isLoading = true;
    const formed = this.transformToUpdateAction();
    this.resetErrorMessage();
    this.serviceVariantService
      .createOrUpdate(formed)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (response: ServiceVariantResponse) => {
          if (response.success?.length > 0) {
            this.serviceVariantService.clearCacheAndFetchAll();
            this.snackBarService.showInfo('MASTER_DATA_SERVICE_VARIANT_SAVE_SUCCESS');
          }
          if (response.fail?.length > 0) {
            this.snackBarService.showInfo('Please refer to hit error icon for more details');
            this.errorMessage = this.transformErrorMessage(response.fail);
          }

          if (response.success?.length > 0 && response.fail?.length === 0) {
            this.router.navigateByUrl('/master/service/service-variant');
          }
        },
        error => {
          this.snackBarService.showError(error);
        }
      );
  }

  transformErrorMessage(response: MasterServiceVariantResponse[]): string {
    let errorMessage = '';

    response.forEach(item => {
      combineLatest([
        this.masterServiceService.getBy(item.serviceId),
        this.masterBrandService.getBy(item.brandId),
        this.masterProductGroupService.getBy(item.productGroupId)
      ])
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(([service, brand, productGroup]) => {
          const formedString =
            service.name +
            ' | ' +
            brand.name +
            ' | ' +
            productGroup.name +
            '\n: ' +
            item.message +
            '\n\n';
          errorMessage = errorMessage + formedString;
        });
    });

    return errorMessage;
  }

  transformToUpdateAction(): MasterServiceVariantUpdate[] {
    return this.serviceVariants.map(variant => {
      variant.productCategoryId = 1;
      variant.onlineOnlyAllowed = true;
      variant.countryRestrictions = this.defineRestrictionCountriesToUpdate(
        this.countryRestrictionIds
      );
      return variant;
    });
  }

  resetErrorMessage(): void {
    this.errorMessage = '';
  }

  initPristineCountriesId(): void {
    this.countryService
      .getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(countries => {
        this.pristineCountriesId = countries.map(country => country.id);
      });
  }

  private defineRestrictionCountriesToUpdate(countryRestrictionIds: string[]): string[] {
    return this.pristineCountriesId.length === countryRestrictionIds.length
      ? []
      : countryRestrictionIds;
  }

  private getCountryRestrictionIds(serviceVariants: MasterServiceVariant[]): string[] {
    return serviceVariants?.length === 1
      ? serviceVariants[0].countryRestrictions ?? this.pristineCountriesId
      : this.pristineCountriesId;
  }
}
