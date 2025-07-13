import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SisterOutlet } from '../../../models/sister-outlet.model';

@Component({
  selector: 'gp-outlet-option',
  templateUrl: './outlet-option.component.html',
  styleUrls: ['./outlet-option.component.scss']
})
export class OutletOptionComponent implements OnInit {
  @Input() outlet: SisterOutlet;
  @Input() selected: boolean;
  @Output() outletSelected = new EventEmitter<string>();

  outletLabels: string[] = [];
  outletInactive: boolean = false;

  selectOutlet() {
    this.outletSelected.emit(this.outlet.id);
  }

  ngOnInit(): void {
    this.getLabels();
    this.getInactive();
  }

  getLabels() {
    const labels: string[] = [];
    const payloadDistributionLevels: string[] = [
      'applicant',
      'manufacturer',
      'retailer',
      'wholesaler'
    ];

    payloadDistributionLevels.map(distributionLevel => {
      if (this.outlet.distributionLevels) {
        const upperDistributionLevel = distributionLevel.toUpperCase();

        if (this.outlet.distributionLevels.includes(upperDistributionLevel)) {
          labels.push('DISTRIBUTION_LEVEL_' + upperDistributionLevel + '_LABEL');
        }
      }
    });

    this.outletLabels = labels;
  }

  getInactive() {
    if (this.outlet.active) {
      this.outletInactive = !this.outlet.active;
    } else {
      this.outletInactive = true;
    }
  }
}
