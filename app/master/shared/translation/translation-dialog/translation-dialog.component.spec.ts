import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from "@angular/router";
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { SnackBarService } from "../../../../shared/services/snack-bar/snack-bar.service";
import { TestingModule } from "../../../../testing/testing.module";
import { MasterLanguageMock } from "../../../language/master-language/master-language.mock";
import { MasterLanguage } from "../../../language/master-language/master-language.model";
import { MasterTranslationMock } from "../master-translation.mock";
import { MasterTranslation } from '../master-translation.model';
import { TranslationDialogComponent } from './translation-dialog.component';

describe('TranslationDialogComponent', () => {
  const translationMock = MasterTranslationMock.asList();
  const languageMock = MasterLanguageMock.asList();
  let component: TranslationDialogComponent;
  let fixture: ComponentFixture<TranslationDialogComponent>;
  let matDialogRefSpy: Spy<MatDialogRef<any>>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;


  beforeEach(
    waitForAsync(() => {
      matDialogRefSpy = createSpyFromClass(MatDialogRef, ['close']);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);

      TestBed.configureTestingModule({
        declarations: [TranslationDialogComponent],
        imports: [
          MatInputModule,
          MatDialogModule,
          MatSlideToggleModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
          TestingModule,
          MatDialogModule
        ],
        providers: [
          {provide: MatDialogRef, useValue: matDialogRefSpy},
          {provide: SnackBarService, useValue: snackBarServiceSpy},
          {provide: Router, useValue: routerSpy},
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              serviceId: 7
            }
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initTranslationForm()', () => {
    it('should have translation fields', done => {
      expect(component.translationForm.controls['translation']).toBeTruthy();
      expect(component.translationForm.controls['descriptionTranslation']).toBeTruthy();
      done();
    });

    it('should init the translation field with previous translation if previous translation is not undefined', done =>{
      const oldTranslation : MasterTranslation = { serviceName: 'Service Change', serviceDescription: "Service Change" }
      component.translation = {key: "tr-TR", value: oldTranslation}
      component.ngOnInit()

      expect(component.translationForm.get('translation')?.value).toEqual(oldTranslation.serviceName);
      done();
    });

    it('should init the translation field to empty if previous translation is undefined', done =>{
      component.ngOnInit()

      expect(component.translationForm.get('translation')?.value).toEqual("");
      done();
    });
  });

  describe('changeLanguage()', () => {
    it('should change language and not mark form as dirty if previous translation is undefined', (done) => {
      const formSpy = jest.spyOn(component.translationForm, 'markAsDirty')
      const language: MasterLanguage = {
        id: 'en-UK',
        name: 'English (United Kingdom)',
        representation: 'English (United Kingdom)'
      };
      component.changeLanguage(languageMock[0]);

      expect(component.language).toEqual(language)
      expect(formSpy).not.toHaveBeenCalled()
      done();
    });

    it('should not mark form as dirty if previous translation exists but no changes on the language', (done) => {
      const formSpy = jest.spyOn(component.translationForm, 'markAsDirty')
      const oldTranslation : MasterTranslation = { serviceName: 'Service Change', serviceDescription: 'Service Change' }
      component.translation = {key: "en-UK", value: oldTranslation}

      component.changeLanguage(languageMock[0]);

      expect(formSpy).not.toHaveBeenCalled()
      done();
    });

    it('should mark form as dirty if previous translation exists and have changes on the language', (done) => {
      const formSpy = jest.spyOn(component.translationForm, 'markAsDirty')
      const oldTranslation : MasterTranslation = { serviceName: 'Service Change', serviceDescription: 'Service Change' }
      component.translation = {key: "tr-TR", value: oldTranslation}

      component.changeLanguage(languageMock[0]);

      expect(formSpy).toHaveBeenCalled()
      done();
    });

  });

  describe('onChange', () => {
    let spyDialog: jest.SpyInstance
    let language: MasterLanguage

    beforeEach(() => {
      spyDialog = jest.spyOn(component.dialogRef, 'close');
      const serviceName = 'Service';
      const serviceDescription = 'Service';
      component.data.serviceId = 7;
      language = {
        id: 'tr-TR',
        name: ' Turkish (Turkey)',
        representation: ' Turkish (Turkey)'
      }
      component.language = language;
      component.translationForm.controls['translation'].setValue(serviceName);
      component.translationForm.controls['descriptionTranslation'].setValue(serviceDescription);
    });

    describe('create translation', () => {
      it('should be able to pass the translation when the dialog close the route back to update service page', () => {
        component.onChange()

        expect(spyDialog).toHaveBeenCalledWith({[language.id]: translationMock[4]});
        expect(routerSpy.navigateByUrl).toBeCalledWith(`/master/service/${component.data.serviceId}`);
        expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_TRANSLATION_SUCCESS');
      });
    })

    describe("update translation", () => {
      it('should update translation when onChange is called', function() {
        const oldTranslation : MasterTranslation = { serviceName: 'Service Change', serviceDescription: 'Service Change' }
        component.translation = {key: "tr-TR", value: oldTranslation}

        component.onChange()

        expect(spyDialog).toHaveBeenCalledWith({[language.id]: translationMock[4]});
        expect(routerSpy.navigateByUrl).toBeCalledWith(`/master/service/${component.data.serviceId}`);
        expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_TRANSLATION_SUCCESS');
      });
    })
  });
});
