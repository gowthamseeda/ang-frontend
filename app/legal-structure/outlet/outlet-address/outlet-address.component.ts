import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {of, Subject} from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LocationService } from '../../location/services/location-service.model';
import { AddressType } from '../../shared/models/address.model';
import { Outlet } from '../../shared/models/outlet.model';
import { MessageService } from '../../shared/services/message.service';
import { DataNotification, DataNotificationChangeFields } from '../../../notifications/models/notifications.model';
import { BaseDataUtil } from '../../shared/components/common/baseDataUtil';
import { Task } from '../../../tasks/task.model';

@Component({
  selector: 'gp-outlet-address',
  templateUrl: './outlet-address.component.html',
  styleUrls: ['./outlet-address.component.scss']
})
export class OutletAddressComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  outlet: Outlet;
  @Input()
  addressStreetDataRequired = false;
  @Input()
  countryEditable = false;
  @Input()
  dataNotification: DataNotification[];
  @Input()
  openDataChange: Task[];
  @Output()
  countryIdSelection: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  isRetailOutlet: boolean = false;
  @Input()
  isForRetailEnabled: boolean = false;
  @Input()
  isMarketResponsible: boolean = false;
  @Input()
  isBusinessSiteResponsible: boolean = false;
  addressType: typeof AddressType = AddressType;

  private unsubscribe = new Subject<void>();
  specificFields = ['state', 'province', 'nameAddition'];
  addressAggregateFields = [
    'addressCity',
    'addressDistrict',
    'addressStreet',
    'addressStreetNumber',
    'addressZipCode',
    'addressAddressAddition'
  ];

  dataNotificationChangeFields = new DataNotificationChangeFields()
  isBlockVerificationsTasksRemained = of(false);
  constructor(
    private locationService: LocationService,
    private messageService: MessageService,
    private baseDataUtils: BaseDataUtil
  ) { }

  ngOnInit(): void {
    this.subscribeToRegionMapperChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initDataNotificationsChangesFields();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private subscribeToRegionMapperChanges(): void {
    this.locationService
      .selectRegion()
      .pipe(
        filter(region => region !== undefined),
        takeUntil(this.unsubscribe)
      )
      .subscribe(region => {
        if (this.changed(this.parentForm.value.state, region?.state)) {
          this.parentForm.patchValue({
            state: region?.state
          });
          this.messageService.add('stateUpdated', true);
        }
        if (this.changed(this.parentForm.value.province, region?.province)) {
          this.parentForm.patchValue({
            province: region?.province
          });
          this.messageService.add('provinceUpdated', true);
        }
      });
  }

  private changed(first: any, second: any): boolean {
    if (!first && !second) {
      return false;
    }
    if (first && !second) {
      return true;
    }
    if (!first && second) {
      return true;
    }
    return first.trim() !== second.trim();
  }

  emitCountryId(countryId: string): void {
    this.countryIdSelection.emit(countryId);
  }
  private initDataNotificationsChangesFields() {
    this.dataNotificationChangeFields = { ...this.baseDataUtils.getDataNotificationChangeFields(this.dataNotification) };
  }
}
