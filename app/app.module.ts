import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { provideUserIdleConfig } from 'angular-user-idle';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Angulartics2Module } from 'angulartics2';
import { NgxPermissionsModule } from 'ngx-permissions';

import translations from '../../translations/translations.json';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeographyModule } from './geography/geography.module';
import { MainModule } from './main/main.module';
import { SearchModule } from './search/search.module';
import { CustomEventBusService } from './shared/services/custom-event-bus/custom-event-bus.service';
import { AppErrorHandler } from './shared/services/logging/app-error-handler';
import { SharedModule } from './shared/shared.module';
import { AppStoreModule } from './store/app-store.module';
import { TproHttpLoader } from './tpro/tpro-http-loader';
import { TproModule } from './tpro/tpro.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Angulartics2Module.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TproHttpLoader,
        deps: [HttpClient]
      }
    }),
    AppStoreModule,
    AppRoutingModule,
    SharedModule,
    MainModule,
    SearchModule,
    GeographyModule,
    TproModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    LoadingBarHttpClientModule
  ],
  exports: [MatMomentDateModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (translateService: TranslateService) => () => {
        translateService.setTranslation('default', translations);
        translateService.setDefaultLang('default');
      },
      deps: [TranslateService],
      multi: true
    },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    CustomEventBusService,
    provideUserIdleConfig({ idle: 3300 })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
