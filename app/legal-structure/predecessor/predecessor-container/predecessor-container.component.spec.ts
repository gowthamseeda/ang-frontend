import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject } from 'rxjs';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { getOutletMock } from '../../shared/models/outlet.mock';
import { OutletService } from '../../shared/services/outlet.service';
import { PredecessorService } from '../predecessor/predecessor.service';

import { PredecessorContainerComponent } from './predecessor-container.component';

function getFormMock() {
  return new FormBuilder().group({});
}

describe('PredecessorContainerComponent', () => {
  const outlet = getOutletMock();

  let outletServiceSpy: Spy<OutletService>;
  let predecessorServiceSpy: Spy<PredecessorService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  let component: PredecessorContainerComponent;
  let fixture: ComponentFixture<PredecessorContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      outletServiceSpy = createSpyFromClass(OutletService);
      outletServiceSpy.getOrLoadBusinessSite.nextWith(outlet);
      predecessorServiceSpy = createSpyFromClass(PredecessorService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.verify.nextWith(true);

      TestBed.configureTestingModule({
        declarations: [PredecessorContainerComponent],
        imports: [MatDialogModule, TranslateModule.forRoot({}), BrowserAnimationsModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { params: new BehaviorSubject({}) }
          },
          {
            provide: MatDialogRef,
            useValue: {
              open: jest.fn()
            }
          },
          {
            provide: OutletService,
            useValue: outletServiceSpy
          },
          {
            provide: PredecessorService,
            useValue: predecessorServiceSpy
          },
          {
            provide: SnackBarService,
            useValue: snackBarServiceSpy
          },
          {
            provide: UserAuthorizationService,
            useValue: {
              isAuthorizedFor: userAuthorizationServiceSpy
            }
          },
          MatDialog
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PredecessorContainerComponent);
    component = fixture.componentInstance;
    component.parentForm = getFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
