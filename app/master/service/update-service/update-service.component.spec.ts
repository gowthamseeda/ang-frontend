import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { of } from 'rxjs';

import { MatDialogModule } from '@angular/material/dialog';
import { TranslationDialogComponent } from 'app/master/shared/translation/translation-dialog/translation-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterServiceMock } from '../master-service/master-service.mock';
import { MasterService } from '../master-service/master-service.model';
import { MasterServiceService } from '../master-service/master-service.service';
import { UpdateServiceComponent } from './update-service.component';
import { ContentChange } from 'ngx-quill';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? '1' : null;
    }
  });
}

describe('UpdateServiceComponent', () => {
  const masterServiceMock = MasterServiceMock.asList();

  let component: UpdateServiceComponent;
  let fixture: ComponentFixture<UpdateServiceComponent>;
  let serviceServiceSpy: Spy<MasterServiceService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(waitForAsync(() => {
    routerSpy = createSpyFromClass(Router);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    serviceServiceSpy = createSpyFromClass(MasterServiceService);
    serviceServiceSpy.fetchBy.nextWith(masterServiceMock[0]);
    serviceServiceSpy.update.nextWith();
    serviceServiceSpy.clearCacheAndFetchAll();

    TestBed.configureTestingModule({
      declarations: [UpdateServiceComponent],
      imports: [
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        TestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: MasterServiceService, useValue: serviceServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    const service: MasterService = {
      name: 'After-sales',
      active: true,
      id: 10,
      position: 10,
      openingHoursSupport: false,
      retailerVisibility: false,
      allowedDistributionLevels: ['WHOLESALER'],
      description: 'new description',
      translations: {
        'en-EN': {
          serviceName: 'Electronic Parts Sales'
        },
        'de-DE': {
          serviceName: 'Electronic Parts Vertrieb'
        }
      }
    };

    beforeEach(() => {
      component.submit(service);
    });

    it('should update the service', () => {
      expect(serviceServiceSpy.update).toHaveBeenCalledWith(service);
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_SERVICE_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      serviceServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initServiceForm()', () => {
    it('should have services fields', done => {
      expect(component.serviceForm.controls['id']).toBeTruthy();
      expect(component.serviceForm.controls['name']).toBeTruthy();
      expect(component.serviceForm.controls['active']).toBeTruthy();
      expect(component.serviceForm.controls['openingHoursSupport']).toBeTruthy();
      expect(component.serviceForm.controls['retailerVisibility']).toBeTruthy();
      expect(component.serviceForm.controls['allowedDistributionLevels']).toBeTruthy();
      expect(component.serviceForm.controls['translations']).toBeTruthy();
      expect(component.serviceForm.controls['position']).toBeTruthy();
      expect(component.serviceForm.controls['description']).toBeTruthy();
      done();
    });
  });

  describe('remove translation', () => {
    it('should remove the translation from translation table', () => {
      const expectData = {
        'de-DE': {
          serviceName: 'Electronic Parts Vertrieb'
        }
      };
      component.currentTranslations = {
        'en-EN': {
          serviceName: 'Electronic Parts Sales'
        },
        'de-DE': {
          serviceName: 'Electronic Parts Vertrieb'
        }
      };
      component.removeSingleTranslation('en-EN');
      expect(component.currentTranslations).toEqual(expectData);
    });
  });

  describe('addNewTranslation', () => {
    it('should call open and pass in current service id', () => {
      spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of() });

      component.addNewTranslation(new Event('click'));
      expect(component.dialog.open).toHaveBeenCalledWith(TranslationDialogComponent, {
        width: '650px',
        data: {
          serviceId: 1
        }
      });
    });

    it('should open create new translation dialog to add translation and after closed set new translations to form', () => {
      component.currentTranslations = masterServiceMock[2].translations;
      const translations = component.currentTranslations;

      const translation = {
        'fr-CH': {
          serviceName: 'Pièces en gros',
          description: 'Pièces en gros'
        }
      };

      const newTranslations = {
        ...translations,
        ...translation
      };

      spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(translation) });
      spyOn(component.serviceForm, 'setValue');

      component.addNewTranslation(new Event('click'));

      expect(component.dialog.open).toHaveBeenCalled();
      expect(component.serviceForm.controls['translations'].value).toEqual(newTranslations);
    });
  });

  describe('editTranslation', () => {
    it('should trigger remove current translation if new translation language key has changed', () => {
      const removeSpy = spyOn(component, 'removeSingleTranslation');

      component.currentTranslations = {
        key: 'en-UK',
        value: {
          serviceName: 'Pièces en gros'
        }
      };
      const currentTranslation = component.currentTranslations;

      const newTranslation = {
        'en-EN': {
          serviceName: 'Pièces en gros'
        }
      };

      spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(newTranslation) });
      component.editTranslation(currentTranslation);
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe('detailDescription', () => {
    it('should display detail description when clicked', () => {
      const testDetailDescription = '<p>testing detail description</p>';
      component.serviceForm.controls['detailDescription'].setValue(testDetailDescription);

      component.openDetailDescription();
      expect(component.showDetailDescription).toBeTruthy();
      expect(component.formGroup.controls['content'].value).toEqual(testDetailDescription);
    });

    it('should hide detail description when closed', () => {
      component.showDetailDescription = true;
      component.closeDetailDescription();
      expect(component.showDetailDescription).toBeFalsy();
    });

    it('should update detail description when content changed', () => {
      const changedContent = "<h1>I'm Header 1</h1>";
      component.contentChanged({ html: changedContent } as ContentChange);

      expect(component.serviceForm.controls['detailDescription'].value).toEqual(changedContent);
      expect(component.serviceForm.dirty).toBeTruthy();
    });

    it('should return detail description', () => {
      const testDetailDescription = '<p>testing getting detail description</p>';
      component.serviceForm.controls['detailDescription'].setValue(testDetailDescription);

      const retrievedDetailDescription = component.getDetailDescription();

      expect(retrievedDetailDescription).toEqual(testDetailDescription);
    });

    it('should disable popup if detail description is undefined', () => {
      component.serviceForm.controls['detailDescription'].setValue(undefined);

      const isEmpty = component.detailDescriptionEmpty();

      expect(isEmpty).toBeTruthy();
    });

    it('should disable popup if detail description is null', () => {
      component.serviceForm.controls['detailDescription'].setValue(null);

      const isEmpty = component.detailDescriptionEmpty();

      expect(isEmpty).toBeTruthy();
    });

    it('should disable popup if detail description is null', () => {
      component.serviceForm.controls['detailDescription'].setValue("   ");

      const isEmpty = component.detailDescriptionEmpty();

      expect(isEmpty).toBeTruthy();
    });

    it('should NOT disable popup if detail description has any value', () => {
      component.serviceForm.controls['detailDescription'].setValue("<h2>Test Header 2 Description</h2>");

      const isEmpty = component.detailDescriptionEmpty();

      expect(isEmpty).toBeFalsy();
    });
  });
});
