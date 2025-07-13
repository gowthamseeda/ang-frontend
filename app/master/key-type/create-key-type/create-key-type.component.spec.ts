import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { getMasterKeyTypesMock } from '../../services/master-key/master-key.mock';
import { MasterKeyService } from '../../services/master-key/master-key.service';
import { CreateKeyTypeComponent } from './create-key-type.component';

describe('CreateKeyTypeComponent', () => {
  const servicesMock = getMasterKeyTypesMock();

  let component: CreateKeyTypeComponent;
  let fixture: ComponentFixture<CreateKeyTypeComponent>;
  let keyTypeServiceSpy: Spy<MasterKeyService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      keyTypeServiceSpy = createSpyFromClass(MasterKeyService);
      keyTypeServiceSpy.create.nextWith({});

      routerSpy = createSpyFromClass(Router);
      routerSpy.navigateByUrl.mockReturnValue('');
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [CreateKeyTypeComponent],
        imports: [MatInputModule, NoopAnimationsModule, ReactiveFormsModule, TestingModule],
        providers: [
          { provide: MasterKeyService, useValue: keyTypeServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateKeyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(servicesMock.keyTypes[0]);
    });

    it('should create the keyType', () => {
      expect(keyTypeServiceSpy.create).toHaveBeenCalledWith(servicesMock.keyTypes[0]);
    });

    it('should give a success message', () => {
      keyTypeServiceSpy.create.nextWith({});
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_KEY_TYPE_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      keyTypeServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
