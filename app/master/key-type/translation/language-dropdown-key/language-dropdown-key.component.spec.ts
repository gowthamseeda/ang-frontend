import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Spy, createSpyFromClass } from 'jest-auto-spies';

import { getLanguageListMock } from '../../../../tpro/language/language.mock';
import { MasterLanguageService } from '../../../language/master-language/master-language.service';
import { LanguageDropdownKeyComponent } from './language-dropdown-key.component';

class ActivatedRouteStub {
  queryParamMap = {
    get: (value: string) => {
      return value === 'targetLang' ? 'de-DE' : null;
    }
  };
}

describe('LanguageDropdownKeyComponent', () => {
  let component: LanguageDropdownKeyComponent;
  let fixture: ComponentFixture<LanguageDropdownKeyComponent>;
  let languageServiceSpy: Spy<MasterLanguageService>;

  beforeEach(waitForAsync(() => {
    languageServiceSpy = createSpyFromClass(MasterLanguageService);

    TestBed.configureTestingModule({
      declarations: [LanguageDropdownKeyComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: new ActivatedRouteStub()
          }
        },
        { provide: MasterLanguageService, useValue: languageServiceSpy }
      ],
      imports: [
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({}),
        RouterTestingModule.withRoutes([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(TestBed.inject(Router), 'navigate');
    fixture = TestBed.createComponent(LanguageDropdownKeyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the select box', () => {
    const languageDropDown = fixture.debugElement.nativeElement.querySelector('.mat-mdc-select');
    expect(languageDropDown).toBeTruthy();
  });

  it('should contain the languages', () => {
    languageServiceSpy.getAll.nextWith(getLanguageListMock());
    fixture.detectChanges();
    expect(component.languages).toBeTruthy();
    expect(component.languages.length).toBe(getLanguageListMock().length);
  });

  describe('select default language', () => {
    beforeEach(() => {
      spyOn(TestBed.inject(ActivatedRoute).snapshot.queryParamMap, 'get').and.returnValue(null);
      languageServiceSpy.getLanguage.mockReturnValue(null);
    });

    it('should select English as default language', () => {
      languageServiceSpy.getAll.nextWith(getLanguageListMock());
      fixture.detectChanges();
      expect(component.languageControl.value.name).toEqual('English');
    });

    it('should select nothing when the language list is empty', () => {
      languageServiceSpy.getAll.nextWith([]);
      fixture.detectChanges();
      expect(component.languageControl.value).toBeUndefined();
    });
  });

  describe('select current language', () => {
    beforeEach(() => {
      spyOn(TestBed.inject(ActivatedRoute).snapshot.queryParamMap, 'get').and.returnValue(null);
      languageServiceSpy.getLanguage.mockReturnValue(getLanguageListMock()[0]);
    });

    it('should select current language', () => {
      languageServiceSpy.getAll.nextWith(getLanguageListMock());
      fixture.detectChanges();
      expect(component.languageControl.value.name).toEqual('English');
    });
  });
});
