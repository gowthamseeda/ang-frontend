import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CountryStructureDescription } from '../../../../../structures/country-structure-description/model/country-structure-description.model';
import { CountryStructureDescriptionService } from '../../../../../structures/country-structure-description/service/country-structure-description.service';
import { CountryStructureService } from '../../../../../structures/country-structure/service/country-structure.service';

@Component({
  selector: 'gp-country-structure-form',
  templateUrl: './country-structure-form.component.html',
  styleUrls: ['./country-structure-form.component.scss']
})
export class CountryStructureFormComponent {
  @Input()
  parentForm: UntypedFormGroup;

  selectedCountryStructureId: Observable<string | undefined>;
  countryStructureDescriptions: Observable<CountryStructureDescription[]>;

  constructor(
    private countryStructureDescriptionService: CountryStructureDescriptionService,
    private countryStructureService: CountryStructureService
  ) {
    this.countryStructureDescriptions = this.countryStructureDescriptionService.getAll();
  }

  @Input()
  set countryId(countryId: string) {
    this.countryStructureDescriptionService.fetchAllForCountry(countryId);
  }

  @Input()
  set businessSiteId(businessSiteId: string) {
    this.selectedCountryStructureId = this.countryStructureService.getCountryStructureIdBy(
      businessSiteId
    );
  }
}
