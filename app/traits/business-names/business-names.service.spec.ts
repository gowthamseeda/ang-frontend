import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { combineLatest, of } from 'rxjs';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { getUserMock } from '../../iam/user/user.mock';
import { UserService } from '../../iam/user/user.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { Brand } from '../brand.model';

import { GroupedBusinessName } from './business-names.model';
import { BusinessNamesService } from './business-names.service';

describe('BusinessNamesService', () => {
  const userMock = getUserMock();

  let service: BusinessNamesService;
  let userServiceSpy: Spy<UserService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(() => {
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getUserDataRestrictions.nextWith(userMock.dataRestrictions);

    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ApiService,
        LoggingService,
        BusinessNamesService,
        [
          { provide: UserService, useValue: userServiceSpy },
          {
            provide: UserAuthorizationService,
            useValue: {
              isAuthorizedFor: userAuthorizationServiceSpy
            }
          }
        ]
      ]
    });

    service = TestBed.inject(BusinessNamesService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get business names and group them', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);

      const expected: GroupedBusinessName[] = [
        new GroupedBusinessName(
          'Foo',
          [new Brand('MB', false), new Brand('SMT', true), new Brand('STR', true)],
          { 'zh-CN': 'Translated Foo' },
          false
        ),
        new GroupedBusinessName('TBB BS', [new Brand('TBB', true)], undefined, false)
      ];

      service.get('GS00000003').subscribe(businessNames => {
        expect(businessNames).toEqual(expected);
        done();
      });
    });

    it('should get read only business names when user has only read permission', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);

      service.get('GS00000003').subscribe(businessNames => {
        expect(
          businessNames.every((businessName: GroupedBusinessName) => businessName.readonly)
        ).toBeTruthy();
        done();
      });
    });

    it('should not load from contract when business names are cached', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);

      const apiService = TestBed.inject(ApiService);
      const apiServiceSpy = jest.spyOn(apiService, 'get');

      combineLatest([service.get('GS00000003'), service.get('GS00000003')]).subscribe(() => {
        done();
      });

      expect(apiServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('should create new values', done => {
      const post = jest.spyOn(TestBed.inject(ApiService), 'post').mockReturnValue(of({id: 'ID', status: 'STATUS'}));

      service
        .save(
          'GS00000003',
          [
            {
              businessName: 'ACME',
              brandId: 'MYB',
              translations: [{ languageId: 'de-CH', name: 'Translation' }]
            }
          ],
          [],
          []
        )
        .subscribe(() => {
          done();
        });

      expect(post).toHaveBeenCalled();
    });

    it('should update values', done => {
      const put = jest.spyOn(TestBed.inject(ApiService), 'put').mockReturnValue(of({id: 'ID', status: 'STATUS'}));

      service
        .save(
          'GS00000003',
          [],
          [
            {
              businessName: 'ACME',
              brandId: 'MYB',
              translations: [{ languageId: 'de-CH', name: 'Translation' }]
            }
          ],
          []
        )
        .subscribe(() => {
          done();
        });

      expect(put).toHaveBeenCalled();
    });

    it('should delete values', done => {
      const del = jest.spyOn(TestBed.inject(ApiService), 'delete').mockReturnValue(of({id: 'ID', status: 'STATUS'}));

      service
        .save(
          'GS00000003',
          [],
          [],
          [
            {
              businessName: 'ACME',
              brandId: 'MYB',
              translations: [{ languageId: 'de-CH', name: 'Translation' }]
            }
          ]
        )
        .subscribe(() => {
          done();
        });

      expect(del).toHaveBeenCalled();
    });
  });

  describe('emptyRequest', () => {
    it('should create empty request', done => {
      const post = jest.spyOn(TestBed.inject(ApiService), 'post').mockReturnValue(of({id: 'ID', status: 'STATUS'}));

      service.emptyRequest('GS00000003').subscribe(() => {
        done();
      });

      expect(post).toHaveBeenCalled();
    });
  });
});
