import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppConfigProvider, WindowUrlProvider } from '../../app-config.service';

import { ApiService } from './api/api.service';
import { LegalService } from './legal/legal.service';
import { LoggingService } from './logging/logging.service';
import { NavigationService } from './navigation/navigation.service';
import { SnackBarService } from './snack-bar/snack-bar.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    ApiService,
    LoggingService,
    SnackBarService,
    WindowUrlProvider,
    AppConfigProvider,
    LegalService,
    NavigationService
  ]
})
export class ServicesModule {}
