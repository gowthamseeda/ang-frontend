import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GeographyModule } from '../geography/geography.module';
import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SharedModule } from '../shared/shared.module';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { RetailEmailComponent } from './container/retail-email/retail-email.component';

@NgModule({
  declarations: [RetailEmailComponent],
  imports: [
    NotificationsRoutingModule,
    CommonModule,
    SharedModule,
    LayoutModule,
    HeaderModule,
    GeographyModule
  ]
})
export class NotificationsModule {}
