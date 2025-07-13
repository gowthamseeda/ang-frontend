import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-po-box-number',
  templateUrl: './po-box-number.component.html',
  styleUrls: ['./po-box-number.component.scss']
})
export class PoBoxNumberComponent implements OnInit {
  @Input()
  poBoxForm: UntypedFormGroup;
  @Input()
  number: string;
  @Input()
  required = false;
  @Input()
  readonly = false;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  readonly dataField: string = 'number';

  constructor() {
  }

  ngOnInit(): void {
  }

  get aggregateField() {
    return AGGREGATE_FIELDS.BASE_DATA_PO_BOX_NUMBER;
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    return DataCluster.BASE_DATA_PO_BOX
  }
}
