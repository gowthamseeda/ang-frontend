import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../notifications/models/notifications.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../shared/model/constants';
import { DataCluster } from '../../../../tasks/task.model';

@Component({
  selector: 'gp-name-addition',
  templateUrl: './name-addition.component.html',
  styleUrls: ['./name-addition.component.scss']
})
export class NameAdditionComponent implements OnInit {
  readonly dataField = 'nameAddition';
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  name: string;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  get aggregateField() {
    return AGGREGATE_FIELDS.BASE_DATA_NAME_ADDITION;
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    return DataCluster.BASE_DATA_NAME_ADDITION
  }
}
