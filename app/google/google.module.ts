import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

import { SharedModule } from '../shared/shared.module';

import { CustomLazyMapsAPILoader } from './google-maps-loader';
import { MapMessageComponent } from './map-message/map-message.component';
import { MapComponent } from './map/map.component';

@NgModule({
  imports: [SharedModule, GoogleMapsModule],
  exports: [MapComponent, MapMessageComponent],
  declarations: [MapComponent, MapMessageComponent],
  providers: [CustomLazyMapsAPILoader]
})
export class GoogleModule {}
