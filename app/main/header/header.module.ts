import { NgModule } from '@angular/core';

import { NavigationPermissionsService } from '../../legal-structure/businessSite/services/navigation-permission.service';
import { SharedModule } from '../../shared/shared.module';
import { TproModule } from '../../tpro/tpro.module';

import { BreadcrumbItemComponent } from './components/breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from './components/header/header.component';
import { OutletHeaderComponent } from './components/outlet-header/outlet-header.component';

@NgModule({
  providers: [NavigationPermissionsService],
  declarations: [
    HeaderComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    OutletHeaderComponent
  ],
  imports: [SharedModule, TproModule],
  exports: [HeaderComponent, OutletHeaderComponent]
})
export class HeaderModule {}
