import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { provideAutoSpy, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { getMasterCloseDownReasonsMock } from '../../services/master-close-down-reasons/master-close-down-reasons.mock';
import { MasterCloseDownReasonsService } from '../../services/master-close-down-reasons/master-close-down-reasons.service';

import { UpdateCloseDownReasonComponent } from './update-close-down-reason.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? '1' : null;
    }
  });
}

describe('UpdateCloseDownReasonComponent', () => {
  const closeDownReasonsMock = getMasterCloseDownReasonsMock();

  let component: UpdateCloseDownReasonComponent;
  let fixture: ComponentFixture<UpdateCloseDownReasonComponent>;
  let closeDownReasonsServiceSpy: Spy<MasterCloseDownReasonsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCloseDownReasonComponent],
      imports: [
        ReactiveFormsModule,
        TestingModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        provideAutoSpy(MasterCloseDownReasonsService),
        provideAutoSpy(Router),
        provideAutoSpy(SnackBarService)
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    snackBarServiceSpy = TestBed.inject<any>(SnackBarService);
    closeDownReasonsServiceSpy = TestBed.inject<any>(MasterCloseDownReasonsService);
    closeDownReasonsServiceSpy.get.nextWith(closeDownReasonsMock[0]);
    closeDownReasonsServiceSpy.update.nextWith({});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCloseDownReasonComponent);
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

    it('should update the close down reason', () => {
      expect(closeDownReasonsServiceSpy.update).toHaveBeenCalledWith('1', closeDownReasonsMock[0]);
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_CLOSE_DOWN_REASON_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      closeDownReasonsServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initCloseDownReasonForm()', () => {
    it('should have close down reason fields', done => {
      expect(component.closeDownReasonForm.controls['id']).toBeTruthy();
      expect(component.closeDownReasonForm.controls['name']).toBeTruthy();
      expect(component.closeDownReasonForm.controls['validity']).toBeTruthy();
      expect(component.closeDownReasonForm.controls['translations']).toBeTruthy();
      done();
    });
  });
});
