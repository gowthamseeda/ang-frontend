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
import { UpdateOutletRelationshipComponent } from './update-outlet-relationship.component';
import { MasterOutletRelationshipService } from "../../services/master-outlet-relationship/master-outlet-relationship.service";
import { getMasterOutletRelationshipMock } from "../../services/master-outlet-relationship/master-outlet-relationship.mock";

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? 'is_Branch_of' : null;
    }
  });
}

describe('UpdateKeyTypeComponent', () => {
  const outletRelationshipMock = getMasterOutletRelationshipMock();

  let component: UpdateOutletRelationshipComponent;
  let fixture: ComponentFixture<UpdateOutletRelationshipComponent>;
  let outletRelationshipServiceSpy: Spy<MasterOutletRelationshipService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(waitForAsync(() => {
    outletRelationshipServiceSpy = createSpyFromClass(MasterOutletRelationshipService);
    outletRelationshipServiceSpy.get.nextWith(outletRelationshipMock.outletRelationships[0]);
    outletRelationshipServiceSpy.update.nextWith();
    routerSpy = createSpyFromClass(Router);
    routerSpy.navigateByUrl.mockReturnValue('');
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      declarations: [UpdateOutletRelationshipComponent],
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
        { provide: MasterOutletRelationshipService, useValue: outletRelationshipServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOutletRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(outletRelationshipMock.outletRelationships[0]);
    });

    it('should update the key type', () => {
      expect(outletRelationshipServiceSpy.update).toHaveBeenCalledWith(outletRelationshipMock.outletRelationships[0]);
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_OUTLET_RELATIONSHIP_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      outletRelationshipServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initKeyTypeForm()', () => {
    it('should have key type fields', done => {
      expect(component.outletRelationshipForm.controls['id']).toBeTruthy();
      expect(component.outletRelationshipForm.controls['name']).toBeTruthy();
      expect(component.outletRelationshipForm.controls['description']).toBeTruthy();
      done();
    });
  });
});
