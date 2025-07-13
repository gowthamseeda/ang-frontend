import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CustomLazyMapsAPILoader } from '../../google/google-maps-loader';
import { LocationApiService } from '../../legal-structure/location/services/location-api.service';

import { DisableByPermissionsDirective } from './directives/disable-by-permissions/disable-by-permissions.directive';
import { NotForRetailDirective } from './directives/not-for-retail/not-for-retail.directive';
import { OnlyForRetailDirective } from './directives/only-for-retail/only-for-retail.directive';
import { OnlyOwnCountryDirective } from './directives/only-own-country/only-own-country.directive';
import { RemoveByPermissionsDirective } from './directives/remove-by-permissions/remove-by-permissions.directive';
import { ShowByPermissionsDirective } from './directives/show-by-permissions/show-by-permissions.directive';

@NgModule({
  declarations: [
    DisableByPermissionsDirective,
    RemoveByPermissionsDirective,
    NotForRetailDirective,
    OnlyForRetailDirective,
    OnlyOwnCountryDirective,
    ShowByPermissionsDirective
  ],
  exports: [
    DisableByPermissionsDirective,
    RemoveByPermissionsDirective,
    NotForRetailDirective,
    OnlyForRetailDirective,
    OnlyOwnCountryDirective,
    ShowByPermissionsDirective
  ],
  imports: [CommonModule],
  providers: [LocationApiService, CustomLazyMapsAPILoader]
})
export class IamSharedModule {}
