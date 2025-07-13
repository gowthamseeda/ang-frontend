import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { isObservable } from 'rxjs';

import { UserAuthorizationService } from '../iam/user/user-authorization.service';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';

import { ContractsGuard } from './contracts.guard';

describe('ContractsGuard', () => {
  let guard: ContractsGuard;
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
    guard = TestBed.inject(ContractsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should be true', done => {
      const result = guard.canActivate();

      if (isObservable(result)) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTruthy();
          done();
        });
      }
    });
  });
});
