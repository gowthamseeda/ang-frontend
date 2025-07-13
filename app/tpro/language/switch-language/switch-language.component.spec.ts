import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import moment from 'moment';

import { mockBrowserLocationReload } from '../../../testing/test-utils/test-utils';
import { TestingModule } from '../../../testing/testing.module';
import { hansSettingsMock } from '../../../user-settings/user-settings/model/user-settings.mock';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { getLanguageListMock } from '../language.mock';
import { Language } from '../language.model';
import { LanguageService } from '../language.service';

import { SwitchLanguageComponent } from './switch-language.component';

describe('SwitchLanguageComponent', () => {
  let component: SwitchLanguageComponent;
  let fixture: ComponentFixture<SwitchLanguageComponent>;
  let translateServiceSpy: Spy<TranslateService>;
  let languageServiceSpy: Spy<LanguageService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;

  const languagesMock: Language[] = getLanguageListMock();

  beforeEach(
    waitForAsync(() => {
      translateServiceSpy = createSpyFromClass(TranslateService);

      languageServiceSpy = createSpyFromClass(LanguageService);
      languageServiceSpy.getAll.nextWith(languagesMock);

      userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
      userSettingsServiceSpy.get.nextWith({ languageId: undefined });

      TestBed.configureTestingModule({
        declarations: [SwitchLanguageComponent],
        imports: [NoopAnimationsModule, FormsModule, MatSelectModule, TestingModule],
        providers: [
          { provide: TranslateService, useValue: translateServiceSpy },
          { provide: LanguageService, useValue: languageServiceSpy },
          { provide: UserSettingsService, useValue: userSettingsServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should load languages', done => {
      component.ngOnInit();
      component.languages.subscribe(languages => {
        expect(languages).toEqual(languagesMock);
        done();
      });
    });

    it('should set the used language according to user settings', () => {
      userSettingsServiceSpy.get.nextWith(hansSettingsMock);
      component.ngOnInit();
      expect(translateServiceSpy.use).toHaveBeenCalledWith(hansSettingsMock.languageId);
    });
  });

  describe('setSelectedLanguageId()', () => {
    beforeEach(() => {
      userSettingsServiceSpy.updateUserDefaultLanguage.nextWith();
      mockBrowserLocationReload();
    });

    it('should call the translations service with the changed language', () => {
      const language = 'de';
      component.setSelectedLanguageId(language);
      expect(translateServiceSpy.use).toHaveBeenCalledWith(language);
    });

    it('should save user settings with the changed language', () => {
      const language = 'de';
      component.setSelectedLanguageId(language);
      expect(userSettingsServiceSpy.updateUserDefaultLanguage).toHaveBeenCalledWith(language);
    });

    it('should save moment locale with the changed language', () => {
      const language = 'de';
      component.setSelectedLanguageId(language);
      expect(moment.locale()).toEqual(language);
    });
  });
});
