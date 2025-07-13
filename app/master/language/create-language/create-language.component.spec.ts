import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterLanguageMock } from '../master-language/master-language.mock';
import { MasterLanguageService } from '../master-language/master-language.service';

import { CreateLanguageComponent } from './create-language.component';

describe('CreateLanguageComponent', () => {
  const languagesMock = MasterLanguageMock.asList;

  let component: CreateLanguageComponent;
  let fixture: ComponentFixture<CreateLanguageComponent>;
  let languageServiceSpy: Spy<MasterLanguageService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  beforeEach(
    waitForAsync(() => {
      languageServiceSpy = createSpyFromClass(MasterLanguageService);
      languageServiceSpy.create.nextWith();
      languageServiceSpy.clearCacheAndFetchAll();
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);

      TestBed.configureTestingModule({
        declarations: [CreateLanguageComponent],
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
          { provide: Router, useValue: routerSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(languagesMock[0]);
    });

    it('should be able to create the language', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_LANGUAGE_SUCCESS');
    });

    it('should not be able to create the language', () => {
      const error = new Error('Error!');
      languageServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  it('Should validate language ID accordingly', () => {
    component.languageForm.controls['id'].setValue('de-DE');
    expect(component.languageForm.get('id')?.hasError('validId')).toBeFalsy();

    component.languageForm.controls['id'].setValue('???');
    expect(component.languageForm.get('id')?.hasError('validId')).toBeTruthy();
  });
});
