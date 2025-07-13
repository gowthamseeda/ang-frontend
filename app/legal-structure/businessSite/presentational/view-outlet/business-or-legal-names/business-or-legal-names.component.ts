import { Component, Input } from '@angular/core';

@Component({
  selector: 'gp-business-or-legal-names',
  templateUrl: './business-or-legal-names.component.html',
  styleUrls: ['./business-or-legal-names.component.scss']
})
export class BusinessOrLegalNamesComponent {
  @Input()
  businessNames: Array<any>;
  @Input()
  legalName: string;
}
