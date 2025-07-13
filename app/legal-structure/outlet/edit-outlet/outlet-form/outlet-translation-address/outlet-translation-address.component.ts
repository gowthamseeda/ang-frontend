import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { ComparableAddress } from '../../../../../google/map-message/comparable-address.model';
import { LocationService } from '../../../../location/services/location-service.model';
import { AddressType, OutletAddressTranslation } from '../../../../shared/models/address.model';
import { Outlet, OutletTranslation } from '../../../../shared/models/outlet.model';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'gp-outlet-translation-address',
  templateUrl: './outlet-translation-address.component.html',
  styleUrls: ['./outlet-translation-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletTranslationAddressComponent implements OnInit, OnDestroy {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  outlet: Outlet;
  @Input()
  outletTranslation: OutletTranslation;
  @Input()
  addressType: AddressType;
  @Input()
  languageId?: string;

  addressTranslationForm: UntypedFormGroup;
  address?: OutletAddressTranslation;

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private locationService: LocationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initAddressForm();
    if (AddressType.Main === this.addressType) {
      this.address = this.outletTranslation?.address;
      this.subscribeToRegionMappingChanges();
    } else {
      this.address = this.outletTranslation?.additionalAddress;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  formGroupTranslationsChange(): void {
    if (AddressType.Main === this.addressType) {
      const translatedAddress = this.getOutletFormAddressTranslation();

      if (translatedAddress.country && translatedAddress.city) {
        this.locationService.updateTranslatedLocationDataInStoreFor(
          translatedAddress,
          this.languageId
        );
      }
    }
  }

  private initAddressForm(): void {
    this.addressTranslationForm = this.formBuilder.group({});
    if (this.parentForm.disabled) {
      this.addressTranslationForm.disable();
    }
    this.parentForm.addControl(this.addressType, this.addressTranslationForm);
  }

  private getOutletFormAddressTranslation(): ComparableAddress {
    const address = (<UntypedFormGroup>this.parentForm.get(this.addressType)).value;
    return new ComparableAddress(
      address.streetNumber,
      address.street,
      address.city,
      this.outlet.countryId,
      address.zipCode
    );
  }

  private subscribeToRegionMappingChanges(): void {
    this.locationService
      .selectTranslatedRegion()
      .pipe(
        distinctUntilChanged(),
        filter(translatedRegion => translatedRegion !== undefined),
        takeUntil(this.unsubscribe)
      )
      .subscribe(translatedRegion => {
        if (this.changed(this.parentForm.value.state, translatedRegion?.state)) {
          this.parentForm.patchValue({
            state: translatedRegion?.state
          });
          this.messageService.add('translatedStateUpdated', true);
        }
        if (this.changed(this.parentForm.value.province, translatedRegion?.province)) {
          this.parentForm.patchValue({
            province: translatedRegion?.province
          });
          this.messageService.add('translatedProvinceUpdated', true);
        }
      });
  }

  private changed(first: string | undefined, second: string | undefined): boolean {
    if (first && second) {
      return first.trim() !== second.trim();
    }
    if (!first && !second) {
      return false;
    }
    if (first && !second) {
      return true;
    }
    if (!first && second) {
      return true;
    }
    return first !== second;
  }
}
