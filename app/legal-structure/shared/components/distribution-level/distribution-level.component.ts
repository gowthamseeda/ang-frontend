import { Component, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'gp-distribution-level',
  templateUrl: './distribution-level.component.html',
  styleUrls: ['./distribution-level.component.scss']
})
export class DistributionLevelComponent implements OnInit {
  @Input()
  parentForm: UntypedFormGroup;

  @Input()
  outletId: string;
  @Input()
  registeredOffice: boolean;
  @Input()
  testOutlet: boolean = false;
  @Input()
  productResponsible: boolean = false;
  @Input()
  marketResponsible: boolean = false;
  @Input()
  isEditPage: boolean = true;
  @Output()
  distributionFormInvalid: Subject<boolean> = new Subject();

  distributionLevelsFormControl = new UntypedFormControl([], [Validators.required]);

  constructor() {}

  ngOnInit(): void {
    this.initDistributionLevelFormControl();
  }

  private initDistributionLevelFormControl(): void {
    if (this.parentForm.disabled) {
      this.distributionLevelsFormControl.disable();
    }
    this.parentForm.addControl('distributionLevels', this.distributionLevelsFormControl);
  }
}
