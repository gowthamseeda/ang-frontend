import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

export interface DistributionLevel {
  id: string;
  name: string;
}
@Component({
  selector: 'gp-distribution-selection',
  templateUrl: './distribution-selection.component.html',
  styleUrls: ['./distribution-selection.component.scss']
})
export class DistributionSelectionComponent {
  @Input()
  fControl: UntypedFormControl;
  @Input()
  placeholder: string;
  @Input()
  required = true;

  distributionLevelSelection: DistributionLevel[] = [
    { id: 'RETAILER', name: 'RETAILER' } as DistributionLevel,
    { id: 'APPLICANT', name: 'APPLICANT' } as DistributionLevel,
    { id: 'WHOLESALER', name: 'WHOLESALER' } as DistributionLevel,
    { id: 'MANUFACTURER', name: 'MANUFACTURER' } as DistributionLevel
  ];

  change(): void {
    this.fControl.markAsDirty();
    this.fControl.markAsTouched();
  }
}
