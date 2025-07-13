import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';

import { SearchModule } from '../search/search.module';
import { MaterialModule } from '../shared/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { TproModule } from '../tpro/tpro.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoComponent } from './dashboard/logo/logo.component';
import { EnvironmentComponent } from './environment/environment.component';
import { HeaderModule } from './header/header.module';
import { IeNotificationComponent } from './ie-notification/ie-notification.component';
import { LayoutModule } from './layout/layout.module';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LogoutComponent } from './logout/logout.component';
import { AdminMenuComponent } from './nav-bar/admin-menu/admin-menu.component';
import { AppMenuComponent } from './nav-bar/app-menu/app-menu.component';
import { CreationMenuComponent } from './nav-bar/creation-menu/creation-menu.component';
import { SideNavigationComponent } from './nav-bar/nav-bar.component';
import { StructuresMenuComponent } from './nav-bar/structures-menu/structures-menu.component';
import { TimeoutConfirmationComponent } from './session-manager/timeout-confirmation/timeout-confirmation.component';
import { SecurityPopUpComponent } from "./security-notification/security-pop-up.component";

@NgModule({
  imports: [
    SharedModule,
    SearchModule,
    TproModule,
    LayoutModule,
    MaterialModule,
    HeaderModule,
    QuillModule
  ],
  declarations: [
    DashboardComponent,
    LogoComponent,
    EnvironmentComponent,
    SideNavigationComponent,
    IeNotificationComponent,
    CreationMenuComponent,
    LegalNoticeComponent,
    StructuresMenuComponent,
    AppMenuComponent,
    AdminMenuComponent,
    TimeoutConfirmationComponent,
    LogoutComponent,
    SecurityPopUpComponent
  ],
  exports: [SideNavigationComponent, IeNotificationComponent, SecurityPopUpComponent],
  providers: []
})
export class MainModule {}
