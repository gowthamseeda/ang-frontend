import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterLanguageMock } from '../master-language/master-language.mock';
import { MasterLanguage } from '../master-language/master-language.model';
import { MasterLanguageService } from '../master-language/master-language.service';

import { UpdateLanguageComponent } from './update-language.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? 'de-DE' : null;
    }
  });
}

describe('UpdateLanguageComponent', () => {
  const masterLanguageMock = MasterLanguageMock.asList();

  let component: UpdateLanguageComponent;
  let fixture: ComponentFixture<UpdateLanguageComponent>;

  let languageServiceSpy: Spy<MasterLanguageService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  beforeEach(
    waitForAsync(() => {
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);

      languageServiceSpy = createSpyFromClass(MasterLanguageService);
      languageServiceSpy.fetchBy.nextWith(masterLanguageMock[4]);
      languageServiceSpy.update.nextWith();
      languageServiceSpy.clearCacheAndFetchAll();

      TestBed.configureTestingModule({
        declarations: [UpdateLanguageComponent],
        imports: [
          MatInputModule,
          MatSelectModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
          TestingModule
        ],
        providers: [
          { provide: MasterLanguageService, useValue: languageServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      const language: MasterLanguage = {
        id: 'de-DE',
        name: 'Mercedes-Benz',
        representation: 'Mercedes-Benz'
      };
      component.submit(language);
    });

    it('should be able to update the language', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_LANGUAGE_SUCCESS');
    });

    it('should not be able to update the language', () => {
      const error = new Error('Error!');
      languageServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initLanguageForm()', () => {
    it('should have languages fields', done => {
      expect(component.languageForm.controls['id']).toBeTruthy();
      expect(component.languageForm.controls['name']).toBeTruthy();
      expect(component.languageForm.controls['representation']).toBeTruthy();
      done();
    });
  });
});
