import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { MasterLanguageMock } from '../../../language/master-language/master-language.mock';
import { MasterLanguage } from '../../../language/master-language/master-language.model';
import { MasterTranslationKeyMock } from '../master-translation-key.mock';
import { MasterTranslationKey } from '../master-translation-key.model';
import { TranslationDialogKeyComponent } from './translation-dialog-key.component';

describe('TranslationDialogKeyComponent', () => {
  const translationMock = MasterTranslationKeyMock.asList();
  const languageMock = MasterLanguageMock.asList();
  let component: TranslationDialogKeyComponent;
  let fixture: ComponentFixture<TranslationDialogKeyComponent>;
  let matDialogRefSpy: Spy<MatDialogRef<any>>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  //let routerSpy: Spy<Router>;

  beforeEach(waitForAsync(() => {
    matDialogRefSpy = createSpyFromClass(MatDialogRef, ['close']);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      declarations: [TranslationDialogKeyComponent],
      imports: [
        MatInputModule,
        MatDialogModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TestingModule,
        MatDialogModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        //{provide: Router, useValue: routerSpy},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 7
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationDialogKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initTranslationForm()', () => {
    it('should have translation fields', done => {
      expect(component.translationForm.controls['translation']).toBeTruthy();
      done();
    });

    it('should init the translation field with previous translation if previous translation is not undefined', done => {
      const oldTranslation: MasterTranslationKey = { description: 'Description Change' };
      component.translation = { key: 'tr-TR', value: oldTranslation };
      component.ngOnInit();

      expect(component.translationForm.get('translation')?.value).toEqual(
        oldTranslation.description
      );
      done();
    });

    it('should init the translation field to empty if previous translation is undefined', done => {
      component.ngOnInit();

      expect(component.translationForm.get('translation')?.value).toEqual('');
      done();
    });
  });

  describe('changeLanguage()', () => {
    it('should change language and not mark form as dirty if previous translation is undefined', done => {
      const formSpy = spyOn(component.translationForm, 'markAsDirty');
      const language: MasterLanguage = {
        id: 'en-UK',
        name: 'English (United Kingdom)',
        representation: 'English (United Kingdom)'
      };
      component.changeLanguage(languageMock[0]);

      expect(component.language).toEqual(language);
      expect(formSpy).not.toHaveBeenCalled();
      done();
    });

    it('should not mark form as dirty if previous translation exists but no changes on the language', done => {
      const formSpy = spyOn(component.translationForm, 'markAsDirty');
      const oldTranslation: MasterTranslationKey = { description: 'Service Change' };
      component.translation = { key: 'en-UK', value: oldTranslation };

      component.changeLanguage(languageMock[0]);

      expect(formSpy).not.toHaveBeenCalled();
      done();
    });

    it('should mark form as dirty if previous translation exists and have changes on the language', done => {
      const formSpy = spyOn(component.translationForm, 'markAsDirty');
      const oldTranslation: MasterTranslationKey = { description: 'Service Change' };
      component.translation = { key: 'tr-TR', value: oldTranslation };

      component.changeLanguage(languageMock[0]);

      expect(formSpy).toHaveBeenCalled();
      done();
    });
  });

  describe('onChange', () => {
    let router: jasmine.Spy;
    let spyDialog: jasmine.Spy;
    let language: MasterLanguage;

    beforeEach(() => {
      router = spyOn(TestBed.inject(Router), 'navigateByUrl');
      spyDialog = spyOn(component.dialogRef, 'close');
      const description = 'Service';
      component.data.id = 7;
      language = {
        id: 'tr-TR',
        name: ' Turkish (Turkey)',
        representation: ' Turkish (Turkey)'
      };
      component.language = language;
      component.translationForm.controls['translation'].setValue(description);
    });

    describe('create translation', () => {
      it('should be able to pass the translation when the dialog close the route back to update key page', () => {
        component.onChange();

        expect(spyDialog).toHaveBeenCalledWith({ [language.id]: translationMock[4] });
        expect(router).toBeCalledWith(`/master/keyType/${component.data.keyId}`);
        expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_TRANSLATION_SUCCESS');
      });
    });

    describe('update translation', () => {
      it('should update translation when onChange is called', function () {
        const oldTranslation: MasterTranslationKey = { description: 'Service Change' };
        component.translation = { key: 'tr-TR', value: oldTranslation };

        component.onChange();

        expect(spyDialog).toHaveBeenCalledWith({ [language.id]: translationMock[4] });
        expect(router).toBeCalledWith(`/master/keyType/${component.data.keyId}`);
        expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_TRANSLATION_SUCCESS');
      });
    });
  });
});
