import { Component, Input } from '@angular/core';

import { SearchItem } from '../../models/search-item.model';
import { OutletResult } from '../outlet-result/outlet-result.model';

@Component({
  selector: 'gp-outlet-result-label',
  templateUrl: './outlet-result-label.component.html',
  styleUrls: ['./outlet-result-label.component.scss']
})
export class OutletResultLabelComponent {
  @Input()
  searchItem: SearchItem<OutletResult>;

  constructor() {}

  get labels(): string[] {
    const labels: string[] = [];
    const payloadDistributionLevels: string[] = [
      'applicant',
      'manufacturer',
      'retailer',
      'wholesaler'
    ];
    const searchItem = this.searchItem;

    if (this.searchItem && this.searchItem.payload) {
      if (this.searchItem.payload.registeredOffice) {
        labels.push('RO_LABEL');
      }

      if (this.searchItem.payload.mainOutlet) {
        labels.push('MAIN_LABEL');
      }

      if (this.searchItem.payload.subOutlet) {
        labels.push('SUB_LABEL');
      }

      if (this.searchItem.payload.affiliate) {
        labels.push('AFFILIATE_LABEL');
      }

      payloadDistributionLevels.forEach(function (distributionLevel): void {
        if (searchItem.payload['distributionLevels_' + distributionLevel]) {
          labels.push('DISTRIBUTION_LEVEL_' + distributionLevel.toUpperCase() + '_LABEL');
        }
      });
    }
    return labels;
  }

  get inactive(): boolean {
    if (this.searchItem && this.searchItem.payload && this.searchItem.payload.active) {
      return !this.searchItem.payload.active;
    }
    return true;
  }
}
