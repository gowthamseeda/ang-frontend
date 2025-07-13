import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

import { UserSearchResults } from '../../iam/user-search/user-search.model';
import { UserSearchService } from '../../iam/user-search/user-search.service';
import { UserService } from '../../iam/user/user.service';
import { TranslatePipeMock } from '../../testing/pipe-mocks/translate';
import { UserSettingsModule } from '../../user-settings/user-settings.module';
import { UserSettings } from '../../user-settings/user-settings/model/user-settings.model';
import { UserSettingsService } from '../../user-settings/user-settings/services/user-settings.service';
import { User, Video } from '../help.model';
import { HelpComponent } from './help.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const FALLBACK_LANGUAGE = 'en';
const OTHER_LANGUAGE = 'fr';

class MockUserSettingsService {
  get(): Observable<UserSettings> {
    return of({
      languageId: FALLBACK_LANGUAGE
    } as UserSettings);
  }
}

class MockUserService {
  getCountryRestrictions(): Observable<string[]> {
    return of(['MY']);
  }

  getBusinessSiteRestrictions(): Observable<string[]> {
    return of(['GS0000001']);
  }

  getRoles(): Observable<string[]> {
    return of(['GSSNPLUS.ProductResponsible']);
  }
}

class MockUserSearchService {
  get(): Observable<any> {
    return of({
      userSearchResults: [
        {
          givenName: 'Helge',
          familyName: 'Schneider',
          email: 'helge.schneider@daimler.com',
          phone: '+49 123/45 67 89-911'
        } as User
      ]
    } as UserSearchResults);
  }
}

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let injectedUserSettingService;
  let injectedMatDialog;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [HelpComponent, TranslatePipeMock],
      imports: [MatDialogModule, UserSettingsModule,NoopAnimationsModule],
      providers: [
        { provide: UserSettingsService, useClass: MockUserSettingsService },
        { provide: UserService, useClass: MockUserService },
        { provide: UserSearchService, useClass: MockUserSearchService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    injectedUserSettingService = TestBed.inject(UserSettingsService);
    injectedMatDialog = TestBed.inject(MatDialog);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should set languageId', () => {
    it('should set languageId from user settings', () => {
      spyOn(injectedUserSettingService, 'get').and.returnValue(of({ languageId: OTHER_LANGUAGE }));
      component.ngOnInit();
      expect(component.language).toBe(OTHER_LANGUAGE);
    });

    it('should set languageId to fallback languageId', () => {
      spyOn(injectedUserSettingService, 'get').and.returnValue(of({ languageId: null }));
      component.ngOnInit();
      expect(component.language).toBe(FALLBACK_LANGUAGE);
    });
  });

  it('should open video dialog', () => {
    const spy = spyOn(injectedMatDialog, 'open');
    component.playVideo({} as Video);
    expect(spy).toHaveBeenCalled();
  });
});
