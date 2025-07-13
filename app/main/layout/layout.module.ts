import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { TproModule } from '../../tpro/tpro.module';

import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { EditLayoutComponent } from './edit-layout/edit-layout.component';
import { EditLayoutService } from './edit-layout/edit-layout.service';
import { EditSectionComponent } from './edit-layout/edit-section.component';
import { OverlayLayoutComponent } from './overlay-layout/overlay-layout.component';

@NgModule({
  imports: [SharedModule, TproModule, OverlayModule],
  providers: [EditLayoutService],
  declarations: [
    DefaultLayoutComponent,
    EditLayoutComponent,
    EditSectionComponent,
    OverlayLayoutComponent
  ],
  exports: [
    DefaultLayoutComponent,
    EditLayoutComponent,
    EditSectionComponent,
    OverlayLayoutComponent
  ]
})
export class LayoutModule {}
