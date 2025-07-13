import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AddressType } from '../../../models/address.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-zip-code',
  templateUrl: './zip-code.component.html',
  styleUrls: ['./zip-code.component.scss']
})
export class ZipCodeComponent implements OnInit {
  readonly dataField: string = 'zipCode';

  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  zipCode: string;
  @Input()
  readonly = false;
  @Input()
  addressType: AddressType;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields()
  @Input()
  isRetailOutlet: boolean = false;

  @Output()
  zipCodeChange = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  formControlChange(): void {
    this.zipCodeChange.emit();
  }

  get aggregateField() {
    if (this.addressType === AddressType.Main){
      return AGGREGATE_FIELDS.BASE_DATA_ADDRESS_ZIP_CODE;
    } else {
      return AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_ZIP_CODE;
    }
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    if (this.addressType === AddressType.Main){
      return DataCluster.BASE_DATA_ADDRESS_ZIP_CODE;
    } else {
      return DataCluster.BASE_DATA_ADDITIONAL_ADDRESS;
    }
  }
}
