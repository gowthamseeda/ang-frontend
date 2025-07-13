import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-po-box-zip-code',
  templateUrl: './po-box-zip-code.component.html',
  styleUrls: ['./po-box-zip-code.component.scss']
})
export class PoBoxZipCodeComponent implements OnInit {
  @Input()
  poBoxForm: UntypedFormGroup;
  @Input()
  zipCode: string;
  @Input()
  readonly = false;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  readonly dataField: string = 'zipCode';

  constructor() {
  }

  ngOnInit(): void {
  }

  get aggregateField() {
    return AGGREGATE_FIELDS.BASE_DATA_PO_BOX_ZIP_CODE;
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    return DataCluster.BASE_DATA_PO_BOX
  }
}
