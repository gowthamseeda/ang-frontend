import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ComparableAddress } from '../../../../google/map-message/comparable-address.model';
import { MismatchAddress } from '../../../../google/map-message/mismatch-address.model';
import {
  DataNotification,
  DataNotificationChangeFields
} from '../../../../notifications/models/notifications.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../shared/model/constants';
import { DataCluster } from '../../../../tasks/task.model';
import { LocationService } from '../../../location/services/location-service.model';
import { GPS } from '../../models/gps.model';
import { MessageService } from '../../services/message.service';
import { BaseDataUtil } from '../common/baseDataUtil';

@Component({
  selector: 'gp-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit, OnDestroy {
  readonly latitudeDataField: string = 'latitude';
  readonly longitudeDataField: string = 'longitude';

  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  readonly = false;
  @Input()
  dataNotification: DataNotification[];
  @Input()
  isRetailOutlet: boolean = false;

  gpsChangeFields: DataNotificationChangeFields;
  gpsForm: UntypedFormGroup;
  gpsCoordsForMap: GPS = { latitude: '', longitude: '' };
  initialGpsCoords: GPS = { latitude: '', longitude: '' };
  mismatchAddress: Observable<MismatchAddress | null>;
  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private locationService: LocationService,
    private messageService: MessageService,
    private baseDataUtils: BaseDataUtil
  ) {}

  ngOnInit(): void {
    this.initGPSForm();
    this.initGPSChangeFields();
    this.subscribeToLocationGpsCoordinatesChanges();
    this.mismatchAddress = this.locationService.getMismatchAddress();
    this.gpsForm.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(gps => {
      if (!this.gpsForm.disabled) {
        this.gpsCoordsForMap = gps;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.locationService.resetState();
  }

  @Input()
  set gps(gps: GPS) {
    if (gps && gps.latitude !== '' && gps.longitude !== '') {
      this.gpsCoordsForMap = gps;
      this.initialGpsCoords = gps;
      setTimeout(() => {
        const outletFormAddress = this.getOutletFormAddress();
        this.locationService.compareLocationsAddressAndUpdateMismatch(
          gps.latitude,
          gps.longitude,
          outletFormAddress
        );
      }, 2000);
    }
  }

  public inputCoordinatesChanged(): void {
    const latitudeControl = this.gpsForm.controls['latitude'];
    const longitudeControl = this.gpsForm.controls['longitude'];
    if (latitudeControl && longitudeControl) {
      const latitude = latitudeControl.value;
      const longitude = longitudeControl.value;
      const previousAddress = this.getOutletFormAddress();
      if (latitude !== '' && longitude !== '') {
        this.locationService.compareLocationsAddressAndUpdateMismatch(
          latitude,
          longitude,
          previousAddress
        );
      }
    }
  }

  private initGPSForm(): void {
    this.gpsForm = this.formBuilder.group({
      latitude: this.gpsCoordsForMap ? this.gpsCoordsForMap.latitude : '',
      longitude: this.gpsCoordsForMap ? this.gpsCoordsForMap.longitude : ''
    });
    if (this.parentForm.disabled) {
      this.gpsForm.disable();
    }
    this.parentForm.addControl('gps', this.gpsForm);
  }

  private subscribeToLocationGpsCoordinatesChanges(): void {
    this.locationService
      .selectGpsCoordinates()
      .pipe(
        filter(gpsCoordinates => gpsCoordinates !== undefined),
        takeUntil(this.unsubscribe)
      )
      .subscribe(gpsCoordinates => {
        if (
          gpsCoordinates &&
          this.gpsCoordinatesChanged(gpsCoordinates?.latitude, gpsCoordinates?.longitude)
        ) {
          this.gpsForm.patchValue(gpsCoordinates);
          this.gpsForm.markAsDirty();
          this.messageService.add('gpsCoordinatesUpdated', true);
        }
      });
  }

  private gpsCoordinatesChanged(latitude: string, longitude: string): boolean {
    if (!latitude || !longitude) {
      return false;
    }
    const existingLatitude = this.gpsForm.value.latitude;
    const existingLongitude = this.gpsForm.value.longitude;
    return latitude !== existingLatitude || longitude !== existingLongitude;
  }

  private getOutletFormAddress(): ComparableAddress {
    const address = (<UntypedFormGroup>this.parentForm.get('address')).value;
    const countryId = (<UntypedFormGroup>this.parentForm.get('countryId')).value;

    const comparableAddress = new ComparableAddress();
    if (countryId) {
      comparableAddress.country = countryId ?? '';
    }
    if (address) {
      if (address.streetNumber) {
        comparableAddress.streetNumber = address.streetNumber;
      }
      if (address.street) {
        comparableAddress.street = address.street;
      }
      if (address.city) {
        comparableAddress.city = address.city;
      }
      if (address.zipCode) {
        comparableAddress.zipCode = address.zipCode;
      }
    }
    return comparableAddress;
  }

  private initGPSChangeFields() {
    this.gpsChangeFields = this.baseDataUtils.getDataNotificationChangeFields(
      this.dataNotification
    );
  }

  get latitudeAggregateField() {
    return AGGREGATE_FIELDS.BASE_DATA_GPS_LATITUDE;
  }

  get longitudeAggregateField() {
    return AGGREGATE_FIELDS.BASE_DATA_GPS_LONGITUDE;
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE;
  }

  get dataCluster() {
    return DataCluster.BASE_DATA_GPS;
  }
}
