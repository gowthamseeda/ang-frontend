import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { Language } from '../language.model';
import { LanguageService } from '../language.service';

@Component({
  selector: 'gp-switch-language',
  templateUrl: './switch-language.component.html',
  styleUrls: ['./switch-language.component.scss']
})
export class SwitchLanguageComponent implements OnInit, OnDestroy {
  languages: Observable<Language[]>;

  private unsubscribe = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    private languagesService: LanguageService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.languages = this.languagesService.getAll();

    this.userSettingsService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(userSettings => {
        if (userSettings.languageId != null) {
          this.translateService.use(userSettings.languageId);
          moment.locale(userSettings.languageId);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getSelectedLanguageId(): string | undefined {
    return this.translateService.currentLang || this.translateService.defaultLang;
  }

  setSelectedLanguageId(languageId: string): void {
    localStorage.setItem('googleMapLanguage', languageId);
    this.translateService.use(languageId);
    moment.locale(languageId);
    this.userSettingsService
      .updateUserDefaultLanguage(languageId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        location.reload();
      });
  }
}
