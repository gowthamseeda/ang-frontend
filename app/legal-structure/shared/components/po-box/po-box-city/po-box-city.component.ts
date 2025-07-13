import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import {
  ParentErrorStateMatcher
} from '../../../../../shared/validators/error-state-matchers/parent-error-state-matcher';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-po-box-city',
  templateUrl: './po-box-city.component.html',
  styleUrls: ['./po-box-city.component.scss']
})
export class PoBoxCityComponent implements OnInit {
  @Input()
  poBoxForm: UntypedFormGroup;
  @Input()
  city: string;
  @Input()
  required = false;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;
  readonly dataField: string = 'city';

  isVerificationTaskPresent = of(false);

  parentErrorStateMatcher = new ParentErrorStateMatcher();

  constructor() {
  }

  ngOnInit(): void {
  }

  get aggregateField() {
    return AGGREGATE_FIELDS.BASE_DATA_PO_BOX_CITY;
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    return DataCluster.BASE_DATA_PO_BOX
  }
}
