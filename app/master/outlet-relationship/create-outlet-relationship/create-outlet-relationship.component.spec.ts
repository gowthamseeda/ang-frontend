import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOutletRelationshipComponent } from './create-outlet-relationship.component';
import { ReactiveFormsModule } from '@angular/forms';
import {createSpyFromClass, Spy} from "jest-auto-spies";
import {Router} from "@angular/router";
import {SnackBarService} from "../../../shared/services/snack-bar/snack-bar.service";
import {
  MasterOutletRelationshipService
} from "../../services/master-outlet-relationship/master-outlet-relationship.service";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {TestingModule} from "../../../testing/testing.module";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {
  getMasterOutletRelationshipMock
} from "../../services/master-outlet-relationship/master-outlet-relationship.mock";
describe('CreateOutletRelationshipComponent', () => {
  const servicesMock = getMasterOutletRelationshipMock();
  let component: CreateOutletRelationshipComponent;
  let fixture: ComponentFixture<CreateOutletRelationshipComponent>;
  let outletRelationshipServiceSpy: Spy<MasterOutletRelationshipService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(async () => {
    outletRelationshipServiceSpy = createSpyFromClass(MasterOutletRelationshipService);
    outletRelationshipServiceSpy.create.nextWith({});

    routerSpy = createSpyFromClass(Router);
    routerSpy.navigateByUrl.mockReturnValue('');
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    await TestBed.configureTestingModule({
      declarations: [ CreateOutletRelationshipComponent ],
      imports: [MatInputModule, NoopAnimationsModule, ReactiveFormsModule, TestingModule],
      providers: [
        { provide: MasterOutletRelationshipService, useValue: outletRelationshipServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOutletRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(servicesMock.outletRelationships[0]);
    });

    it('should create the keyType', () => {
      expect(outletRelationshipServiceSpy.create).toHaveBeenCalledWith(servicesMock.outletRelationships[0]);
    });

    it('should give a success message', () => {
      outletRelationshipServiceSpy.create.nextWith({});
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_OUTLET_RELATIONSHIP_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      outletRelationshipServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
