import { Component, OnDestroy, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Event, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { Angulartics2Matomo } from 'angulartics2';

import { FEATURE_NAMES } from './shared/model/constants';
import { LocaleService } from './shared/services/locale/locale.service';
import { ProgressBarService } from './shared/services/progress-bar/progress-bar.service';
import { UserSettingsService } from './user-settings/user-settings/services/user-settings.service';
import { TaskWebSocketService } from './tasks/service/task-websocket.service';
import { environment } from 'environments/environment';
import { SessionInvalidatorService } from "./main/session-manager/session-invalidator/session-invalidator.service";

const path = 'tasks/ws';
const protocol = 'wss';
const host = location.host;

@Component({
  selector: 'gp-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  loadProgress = 0;
  downtimeNotificationFeatureToggleName = FEATURE_NAMES.DOWNTIME_ADVANCE_NOTIFICATION;

  constructor(
    private angulartics2matomo: Angulartics2Matomo,
    private router: Router,
    private progressBarService: ProgressBarService,
    private userSettingsService: UserSettingsService,
    private dateFormatAdapter: DateAdapter<any>,
    private localeService: LocaleService,
    private taskWebSocketService: TaskWebSocketService,
    private sessionInvalidator: SessionInvalidatorService
  ) {
    this.angulartics2matomo.startTracking();
  }

  ngOnInit(): void {
    this.showProgressBarOnModuleLoad();
    this.listenToProgressBarChanges();
    this.initUserSettings();
    this.setupTaskWebSocketConnection();
    this.sessionInvalidator.initTimer();
  }

  ngOnDestroy(): void {
    this.taskWebSocketService.disconnect();
    this.sessionInvalidator.removeTimer();
  }

  private setupTaskWebSocketConnection(): void {
    let baseUrl = environment.settings.baseUrl || '/';
    if (baseUrl === '/local/') {
      baseUrl = '/';
    }
    const websocketUrl = `${protocol}://${host}${baseUrl}${path}`;

    this.taskWebSocketService.connect(websocketUrl);
  }

  private listenToProgressBarChanges(): void {
    this.progressBarService.progressChanges.subscribe(progress => {
      this.loadProgress = progress;
    });
  }

  private initUserSettings(): void {
    this.userSettingsService.get().subscribe(userSettings => {
      let lang = userSettings.languageId;
      if (lang) {
        if (lang === 'en') {
          lang = 'en-GB';
        }
        this.dateFormatAdapter.setLocale(lang);
        this.localeService.initializeTranslationLocale(lang);
      }
    });
  }

  private showProgressBarOnModuleLoad(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.progressBarService.start();
      } else if (event instanceof RouteConfigLoadEnd) {
        this.progressBarService.stop();
      }
    });
  }
}
