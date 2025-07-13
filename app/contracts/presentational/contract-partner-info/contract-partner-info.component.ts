import { Component, Input } from '@angular/core';

import { BusinessSite } from '../../model/business-site.model';
import { Company } from '../../model/company.model';

@Component({
  selector: 'gp-contract-partner-info',
  templateUrl: './contract-partner-info.component.html',
  styleUrls: ['./contract-partner-info.component.scss']
})
export class ContractPartnerInfoComponent {
  @Input() contractPartner: BusinessSite & Company;

  constructor() {}
}
