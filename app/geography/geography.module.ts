import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { CountryDropdownComponent } from './country/country-dropdown/country-dropdown.component';
import { CountryService } from './country/country.service';
import { LanguageService } from './language/language.service';
import { RegionMappingService } from './regionmapping/regionmapping.service';

@NgModule({
  imports: [SharedModule],
  exports: [CountryDropdownComponent],
  declarations: [CountryDropdownComponent],
  providers: [CountryService, LanguageService, RegionMappingService]
})
export class GeographyModule {}
