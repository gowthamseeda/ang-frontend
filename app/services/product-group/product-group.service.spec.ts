import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserService } from '../../iam/user/user.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../store/app-store.module';
import { TestingModule } from '../../testing/testing.module';

import { ProductGroupMock } from './product-group.mock';
import { ProductGroupService } from './product-group.service';

describe('ProductGroupService', () => {
  let service: ProductGroupService;
  let userServiceSpy: Spy<UserService>;

  beforeEach(() => {
    userServiceSpy = createSpyFromClass(UserService);

    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [
        ProductGroupService,
        ApiService,
        LoggingService,
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    service = TestBed.inject(ProductGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllForUserDataRestrictions', () => {
    it('should get all product groups filtered by current user data restriction when focus enabled', done => {
      userServiceSpy.getProductGroupRestrictions.nextWith(['PC']);

      service.getAllForUserDataRestrictions(true).subscribe(productGroups => {
        // @ts-ignore
        expect(productGroups).toEqual([ProductGroupMock.asMap()['PC']]);
        done();
      });
    });

    it('should get all product groups filtered by current user data restriction when focus disabled', done => {
      userServiceSpy.getProductGroupRestrictions.nextWith(['PC']);

      service.getAllForUserDataRestrictions(false).subscribe(productGroups => {
        // @ts-ignore
        expect(productGroups).toEqual([ProductGroupMock.asMap()['PC']]);
        done();
      });
    });

    it('should not get any product groups if user not restricted to any product group and focus enabled', done => {
      userServiceSpy.getProductGroupRestrictions.nextWith([]);

      service.getAllForUserDataRestrictions(true).subscribe(productGroups => {
        // @ts-ignore
        expect(productGroups).toEqual([]);
        done();
      });
    });

    it('should get all product groups if user not restricted to any product group and focus disabled', done => {
      userServiceSpy.getProductGroupRestrictions.nextWith([]);

      service.getAllForUserDataRestrictions(false).subscribe(productGroups => {
        // @ts-ignore
        expect(productGroups).toEqual(ProductGroupMock.asList());
        done();
      });
    });
  });
});
