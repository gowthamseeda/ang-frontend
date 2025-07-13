import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { isObservable } from 'rxjs';
import { UserAuthorizationService } from '../iam/user/user-authorization.service';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';
import { CommunicationGuard } from './communication.guard';

describe('CommunicationGuard', () => {
  let guard: CommunicationGuard;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(() => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.verify.nextWith(true);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      providers: [
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
      ]
    });
    guard = TestBed.inject(CommunicationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    test('communication guard should be true', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      const result = guard.canActivate();

      if (isObservable(result)) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTruthy();
          done();
        });
      }
    });

    test('communication guard should be false', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      const result = guard.canActivate();

      if (isObservable(result)) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalsy();
          done();
        });
      }
    });
  });
});
