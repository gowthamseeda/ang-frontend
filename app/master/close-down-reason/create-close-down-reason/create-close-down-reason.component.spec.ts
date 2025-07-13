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
import { getMasterCloseDownReasonsMock } from '../../services/master-close-down-reasons/master-close-down-reasons.mock';
import { MasterCloseDownReasonsService } from '../../services/master-close-down-reasons/master-close-down-reasons.service';

import { CreateCloseDownReasonComponent } from './create-close-down-reason.component';

describe('CreateCloseDownReasonComponent', () => {
  const closeDownReasonsMock = getMasterCloseDownReasonsMock();

  let component: CreateCloseDownReasonComponent;
  let fixture: ComponentFixture<CreateCloseDownReasonComponent>;
  let closeDownReasonsServiceSpy: Spy<MasterCloseDownReasonsService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      closeDownReasonsServiceSpy = createSpyFromClass(MasterCloseDownReasonsService);
      closeDownReasonsServiceSpy.create.nextWith({});
      routerSpy = createSpyFromClass(Router);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [CreateCloseDownReasonComponent],
        imports: [
          ReactiveFormsModule,
          TestingModule,
          MatInputModule,
          MatSelectModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: MasterCloseDownReasonsService, useValue: closeDownReasonsServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCloseDownReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(closeDownReasonsMock[0]);
    });

    it('should create the close down reason', () => {
      expect(closeDownReasonsServiceSpy.create).toHaveBeenCalledWith(closeDownReasonsMock[0]);
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_CLOSE_DOWN_REASON_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      closeDownReasonsServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
