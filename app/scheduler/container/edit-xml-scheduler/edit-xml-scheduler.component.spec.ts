import { LayoutModule } from '@angular/cdk/layout';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { TestingModule } from '../../../testing/testing.module';
import { getXMLSchedulerJobs } from '../../model/scheduler.mock';
import { XmlSchedulerService } from '../../services/xml-scheduler.service';

import { EditXmlSchedulerComponent } from './edit-xml-scheduler.component';

class ActivatedRouteStub {
  paramMap = of({ get: () => getXMLSchedulerJobs()[0].schedulerId });
}

describe('EditXmlComponent', () => {
  let component: EditXmlSchedulerComponent;
  let fixture: ComponentFixture<EditXmlSchedulerComponent>;
  let xmlSchedulerServiceSpy: Spy<XmlSchedulerService>;

  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  beforeEach(
    waitForAsync(() => {
      xmlSchedulerServiceSpy = createSpyFromClass(XmlSchedulerService);
      xmlSchedulerServiceSpy.get.nextWith(getXMLSchedulerJobs()[0]);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userAuthorizationServiceSpy.verify.nextWith(true);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);

      TestBed.configureTestingModule({
        declarations: [EditXmlSchedulerComponent, TranslatePipeMock],
        imports: [
          TestingModule,
          ReactiveFormsModule,
          MatInputModule,
          MatSlideToggleModule,
          NoopAnimationsModule,
          RouterTestingModule.withRoutes([]),
          LayoutModule
        ],
        providers: [
          { provide: XmlSchedulerService, useValue: xmlSchedulerServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
          {
            provide: UserAuthorizationService,
            useValue: {
              isAuthorizedFor: {
                permissions: () => userAuthorizationServiceSpy
              }
            }
          },
          {
            provide: SnackBarService,
            useValue: snackBarServiceSpy
          }
        ],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditXmlSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init indicator for api and xml', () => {
      expect(component.isLoading).toBeFalsy();
      expect(component.isJobFound).toBeTruthy();
    });

    it('should call functions when init', () => {
      jest.spyOn(component, 'initXmlJobForm');
      jest.spyOn(component, 'initXmlSchedulerJob');
      component.ngOnInit();

      expect(component.initXmlJobForm).toHaveBeenCalled();
      expect(component.initXmlSchedulerJob).toHaveBeenCalled();
    });
  });
});
