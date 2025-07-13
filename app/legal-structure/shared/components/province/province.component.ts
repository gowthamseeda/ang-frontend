import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../notifications/models/notifications.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../shared/model/constants';
import { DataCluster } from '../../../../tasks/task.model';

@Component({
  selector: 'gp-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent implements OnInit {
  readonly dataField = 'province';

  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  province: string;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }


  get aggregateField() {
    return AGGREGATE_FIELDS.BASE_DATA_ADDRESS_PROVINCE;
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    return DataCluster.BASE_DATA_ADDRESS_PROVINCE
  }
}
