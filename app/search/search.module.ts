import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { MasterCountryModule } from '../master/country/master-country/master-country.module';
import { SharedModule } from '../shared/shared.module';

import { RetailerOutletsComponent } from './retailer-outlets/retailer-outlets.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchService } from './search.service';
import { SearchFieldComponent } from './searchfield/searchfield.component';
import { GroupedFiltersComponent } from './shared/grouped-filters/grouped-filters.component';
import { OutletResultLabelComponent } from './shared/outlet-result-label/outlet-result-label.component';
import { OutletResultComponent } from './shared/outlet-result/outlet-result.component';
import { SearchFilterChipListComponent } from './shared/search-filter-chip-list/search-filter-chip-list.component';
import { SuggestedFilterComponent } from './shared/suggested-filter/suggested-filter.component';
import { TranslatedBrandFlagComponent } from './shared/translated-brand-flag/translated-brand-flag.component';
import {
  TranslatedProductGroupFlagComponent
} from "./shared/translated-product-group-flag/translated-product-group-flag.component";

@NgModule({
    imports: [SharedModule, MatChipsModule],
    exports: [
        SearchFieldComponent,
        OutletResultComponent,
        RetailerOutletsComponent,
        MasterCountryModule
    ],
    declarations: [
        SearchFieldComponent,
        SearchFilterChipListComponent,
        OutletResultComponent,
        SearchResultComponent,
        SuggestedFilterComponent,
        OutletResultLabelComponent,
        TranslatedBrandFlagComponent,
      TranslatedProductGroupFlagComponent,
        GroupedFiltersComponent,
        RetailerOutletsComponent
    ],
    providers: [SearchService]
})
export class SearchModule {}
