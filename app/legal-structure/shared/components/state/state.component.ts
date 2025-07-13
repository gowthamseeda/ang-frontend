import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../notifications/models/notifications.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../shared/model/constants';
import { DataCluster } from '../../../../tasks/task.model';

@Component({
  selector: 'gp-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  readonly dataField = 'state';

  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  state: string;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  get aggregateField() {
    return AGGREGATE_FIELDS.BASE_DATA_ADDRESS_STATE;
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    return DataCluster.BASE_DATA_ADDRESS_STATE
  }
}
