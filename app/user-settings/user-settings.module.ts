import { NgModule } from '@angular/core';

import { GeographyModule } from '../geography/geography.module';
import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SharedModule } from '../shared/shared.module';

import { NotificationComponent } from './notification/notification.component';
import { EditUserSettingsComponent } from './user-settings/container/edit-user-settings/edit-user-settings.component';
import { UserSettingsRoutingModule } from './user-settings/user-settings-routing.module';

@NgModule({
  imports: [SharedModule, LayoutModule, HeaderModule, GeographyModule, UserSettingsRoutingModule],
  exports: [NotificationComponent],
  declarations: [NotificationComponent, EditUserSettingsComponent]
})
export class UserSettingsModule {}
