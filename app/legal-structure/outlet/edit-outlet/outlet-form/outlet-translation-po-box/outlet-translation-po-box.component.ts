import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Outlet } from '../../../../shared/models/outlet.model';
import { POBox } from '../../../../shared/models/po-box.model';

@Component({
  selector: 'gp-outlet-translation-po-box',
  templateUrl: './outlet-translation-po-box.component.html',
  styleUrls: ['./outlet-translation-po-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletTranslationPoBoxComponent implements OnInit {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  outlet: Outlet;
  @Input()
  poBox: POBox;

  poBoxForm: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initPOBoxForm();
  }

  private initPOBoxForm(): void {
    this.poBoxForm = this.formBuilder.group({});
    if (this.parentForm.disabled) {
      this.poBoxForm.disable();
    }
    this.parentForm.addControl('poBox', this.poBoxForm);
  }
}
