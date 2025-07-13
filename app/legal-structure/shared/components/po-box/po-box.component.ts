import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { POBoxValidators } from '../../../../shared/validators/pobox-validators';
import { POBox } from '../../models/po-box.model';
import { DataNotification, DataNotificationChangeFields } from "../../../../notifications/models/notifications.model";
import { BaseDataUtil } from "../common/baseDataUtil";

@Component({
  selector: 'gp-po-box',
  templateUrl: './po-box.component.html',
  styleUrls: ['./po-box.component.scss']
})
export class PoBoxComponent implements OnInit, OnChanges {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  readonly = false;
  @Input()
  countryId: string;
  @Input()
  poBox: POBox;
  @Input()
  dataNotification: DataNotification[];
  @Input()
  isRetailOutlet: boolean = false;

  poBoxForm: UntypedFormGroup;
  dataNotificationChangeFields = new DataNotificationChangeFields()

  constructor(private baseDataUtils: BaseDataUtil) {}

  ngOnInit(): void {
    this.initPOBoxForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initDataNotificationsChangesFields();
  }


  poBoxNumberRequired(form: UntypedFormGroup): boolean {
    return POBoxValidators.poBoxNumberRequired(form.get('poBox'));
  }

  poBoxZipCodeRequired(form: UntypedFormGroup): boolean {
    return POBoxValidators.poBoxZipCodeRequired(this.countryId, form.get('poBox'));
  }

  poBoxCityRequired(form: UntypedFormGroup): boolean {
    return (
      POBoxValidators.poBoxCityRequired(this.countryId, form.get('poBox')) ||
      this.parentForm.hasError('translationRequired')
    );
  }

  private initPOBoxForm(): void {
    this.poBoxForm = new UntypedFormBuilder().group({});
    this.patchValuesFromPOBox();
    if (this.parentForm.disabled) {
      this.poBoxForm.disable();
    }
    this.parentForm.addControl('poBox', this.poBoxForm);
  }

  private patchValuesFromPOBox(): void {
    if (this.poBox) {
      this.poBoxForm.patchValue(this.poBox);
    }
  }

  private initDataNotificationsChangesFields() {
    this.dataNotificationChangeFields = {...this.baseDataUtils.getDataNotificationChangeFields(this.dataNotification)};
  }
}
