import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { of } from 'rxjs';

import { MatDialogModule } from '@angular/material/dialog';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { getMasterKeyTypesMock } from '../../services/master-key/master-key.mock';
import { MasterKeyService } from '../../services/master-key/master-key.service';

import { TranslationDialogKeyComponent } from '../translation/translation-dialog-key/translation-dialog-key.component';
import { UpdateKeyTypeComponent } from './update-key-type.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? 'COFICO01' : null;
    }
  });
}

describe('UpdateKeyTypeComponent', () => {
  const keyTypeMock = getMasterKeyTypesMock();

  let component: UpdateKeyTypeComponent;
  let fixture: ComponentFixture<UpdateKeyTypeComponent>;
  let keyTypeServiceSpy: Spy<MasterKeyService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(waitForAsync(() => {
    keyTypeServiceSpy = createSpyFromClass(MasterKeyService);
    keyTypeServiceSpy.get.nextWith(keyTypeMock.keyTypes[0]);
    keyTypeServiceSpy.update.nextWith();
    routerSpy = createSpyFromClass(Router);
    routerSpy.navigateByUrl.mockReturnValue('');
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    keyTypeServiceSpy.getAll.nextWith([
      {
        id: 'COFICO01',
        name: 'Cofico System ID 1',
        maxValueLength: 256,
        description: 'Description For COFICO01'
      }
    ]);

    TestBed.configureTestingModule({
      declarations: [UpdateKeyTypeComponent],
      imports: [
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        TestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: MasterKeyService, useValue: keyTypeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateKeyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(keyTypeMock.keyTypes[0]);
    });

    it('should update the key type', () => {
      expect(keyTypeServiceSpy.update).toHaveBeenCalledWith(keyTypeMock.keyTypes[0]);
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_KEY_TYPE_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      keyTypeServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initKeyTypeForm()', () => {
    it('should have key type fields', done => {
      expect(component.keyTypeForm.controls['id']).toBeTruthy();
      expect(component.keyTypeForm.controls['name']).toBeTruthy();
      expect(component.keyTypeForm.controls['maxValueLength']).toBeTruthy();
      expect(component.keyTypeForm.controls['description']).toBeTruthy();
      expect(component.keyTypeForm.controls['translations']).toBeTruthy();
      done();
    });
  });

  describe('remove translation', () => {
    it('should remove the translation from translation table', () => {
      const expectedData = {
        'de-DE': {
          description: 'Electronic Parts Vertrieb'
        }
      };
      component.currentTranslations = {
        'en-EN': {
          description: 'Electronic Parts Sales'
        },
        'de-DE': {
          description: 'Electronic Parts Vertrieb'
        }
      };
      component.removeSingleTranslation('en-EN');
      expect(component.currentTranslations).toEqual(expectedData);
    });
  });

  describe('addNewTranslation', () => {
    it('should call open and pass in current keyType id', () => {
      spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of() });

      component.addNewTranslation(new Event('click'));
      expect(component.dialog.open).toHaveBeenCalledWith(TranslationDialogKeyComponent, {
        width: '650px',
        data: {
          keyId: 'COFICO01'
        }
      });
    });

    it('should open create new translation dialog to add translation and after closed set new translations to form', () => {
      component.currentTranslations = keyTypeMock.keyTypes[0].translations;
      const translations = component.currentTranslations;

      const translation = {
        'fr-CH': {
          description: 'Pièces en gros'
        }
      };

      const newTranslations = {
        ...translations,
        ...translation
      };

      spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(translation) });
      spyOn(component.keyTypeForm, 'setValue');

      component.addNewTranslation(new Event('click'));

      expect(component.dialog.open).toHaveBeenCalled();
      expect(component.keyTypeForm.controls['translations'].value).toEqual(newTranslations);
    });
  });

  describe('editTranslation', () => {
    it('should trigger remove current translation if new translation language key has changed', () => {
      const removeSpy = spyOn(component, 'removeSingleTranslation');

      component.currentTranslations = {
        key: 'en-UK',
        value: {
          description: 'Pièces en gros'
        }
      };
      const currentTranslation = component.currentTranslations;

      const newTranslation = {
        'en-EN': {
          description: 'Pièces en gros'
        }
      };

      spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(newTranslation) });

      component.editTranslation(currentTranslation);
      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
