import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { combineLatest } from 'rxjs';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { UserService } from '../../iam/user/user.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import { ExternalKey } from './external-key.model';
import { ExternalKeyService } from './external-key.service';

describe('ExternalKeyService', () => {
  let service: ExternalKeyService;
  let userServiceSpy: Spy<UserService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(() => {
    userServiceSpy = createSpyFromClass(UserService);

    userServiceSpy.getBrandRestrictions.nextWith(['MB']);
    userServiceSpy.getProductGroupRestrictions.nextWith([]);

    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService, [
      'permissions',
      'verify'
    ]);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ExternalKeyService,
        ApiService,
        LoggingService,
        { provide: UserService, useValue: userServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        }
      ]
    });

    service = TestBed.inject(ExternalKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all external keys for a business site from the traits contract', done => {
      service.getAll('GS00000023').subscribe((externalKeyTypes: ExternalKey[]) => {
        expect(externalKeyTypes).toEqual([
          { keyType: 'COFICO01', value: '01', readonly: false },
          { keyType: 'COFICO02', value: '02-MB', brandId: 'MB', readonly: false },
          {
            keyType: 'COFICO03',
            value: '03-MB-PC',
            brandId: 'MB',
            productGroupId: 'PC',
            readonly: false
          }
        ]);
        done();
      });
    });

    it('should be able to handle it no keys are assigned to a business site from the traits contract', done => {
      service.getAll('GS00000021').subscribe((externalKeyTypes: ExternalKey[]) => {
        expect(externalKeyTypes).toEqual([]);
        done();
      });
    });

    it('should not load from contract when external keys are cached', done => {
      const apiService = TestBed.inject(ApiService);
      const apiServiceSpy = jest.spyOn(apiService, 'get');

      combineLatest([service.getAll('GS00000021'), service.getAll('GS00000021')]).subscribe(() => {
        done();
      });

      expect(apiServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveAll()', () => {
    it('should save new external keys for a business site from the traits contract', done => {
      let updated = false;

      service
        .saveAll('GS00000021', [
          { keyType: 'COFICO01', value: '01-new' },
          { keyType: 'COFICO02', value: '02-FUSO', brandId: 'FUSO' },
          { keyType: 'COFICO03', value: '03-FUSO-VAN', brandId: 'FUSO', productGroupId: 'VAN' }
        ])
        .subscribe(() => {
          [(updated = true)];
          done();
        });

      expect(updated).toBeTruthy();
    });
  });
});
