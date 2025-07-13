import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { getUserMock } from '../../iam/user/user.mock';
import { UserService } from '../../iam/user/user.service';
import { Brand } from '../brand.model';
import { getBrandCodeResourceMock } from '../shared/brand-code/brand-code.mock';
import { BrandCodeService } from '../shared/brand-code/brand-code.service';

import { getAdamIdResourceMock } from './adam-id/adam-id.mock';
import { AdamIdService } from './adam-id/adam-id.service';
import { AliasService } from './alias/alias.service';
import { FederalIdService } from './federal-id/federal-id.service';
import { KeyType, keyTypeConfigBy } from './key-type.model';
import { FlatKey, GroupedKey } from './key.model';
import { KeysService } from './keys.service';

describe('KeysService', () => {
  const brandCodesMock = getBrandCodeResourceMock();
  const adamIdMock = getAdamIdResourceMock();
  const userMock = getUserMock();
  let service: KeysService;
  let brandCodeServiceSpy: Spy<BrandCodeService>;
  let adamIdServiceSpy: Spy<AdamIdService>;
  let aliasServiceSpy: Spy<AliasService>;
  let federalIdServiceSpy: Spy<FederalIdService>;
  let userServiceSpy: Spy<UserService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(() => {
    brandCodeServiceSpy = createSpyFromClass(BrandCodeService, ['get', 'create', 'delete']);
    adamIdServiceSpy = createSpyFromClass(AdamIdService, ['get']);
    aliasServiceSpy = createSpyFromClass(AliasService, ['get', 'update', 'delete']);
    federalIdServiceSpy = createSpyFromClass(FederalIdService, ['get', 'update', 'delete']);
    userServiceSpy = createSpyFromClass(UserService, ['getUserDataRestrictions', 'getPermissions']);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService, [
      'permissions',
      'verify'
    ]);
    userAuthorizationServiceSpy.permissions.mockReturnValue(UserAuthorizationService);

    TestBed.configureTestingModule({
      providers: [
        KeysService,
        [
          { provide: BrandCodeService, useValue: brandCodeServiceSpy },
          { provide: AdamIdService, useValue: adamIdServiceSpy },
          { provide: AliasService, useValue: aliasServiceSpy },
          { provide: FederalIdService, useValue: federalIdServiceSpy },
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

    service = TestBed.inject(KeysService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    beforeEach(() => {
      brandCodeServiceSpy.get.nextWith(brandCodesMock);
      adamIdServiceSpy.get.nextWith(adamIdMock);
      aliasServiceSpy.get.nextWith({});
      federalIdServiceSpy.get.nextWith({});
      userServiceSpy.getUserDataRestrictions.nextWith(userMock.dataRestrictions);
      userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.verify.nextWith(false);
    });

    it('should get keys and group them', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      const expected: GroupedKey[] = [
        new GroupedKey(
          KeyType.BRAND_CODE,
          '1',
          [new Brand('MB', false), new Brand('FUSO', true)],
          false
        ),
        new GroupedKey(KeyType.BRAND_CODE, '2', [new Brand('MYB', true)], false),
        new GroupedKey(
          KeyType.BRAND_CODE,
          '3',
          [new Brand('SMT', true), new Brand('BAB', true)],
          false
        )
      ];

      brandCodeServiceSpy.get.nextWith(brandCodesMock);

      service.get('GS1234567').subscribe((keyItems: GroupedKey[]) => {
        expect(keyItems).toEqual(expected);
        done();
      });
    });

    it('should get empty list when user has no permission', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);

      service.get('GS1234567').subscribe((keyItems: GroupedKey[]) => {
        expect(keyItems).toEqual([]);
        done();
      });
    });

    it('should get read only keys when user has only read permission', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);

      service.get('GS1234567').subscribe((keyItems: GroupedKey[]) => {
        expect(keyItems.every(key => key.readonly)).toBeTruthy();
        done();
      });
    });

    it('should get only keys for retail user', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      const expected: GroupedKey[] = [
        new GroupedKey(
          KeyType.BRAND_CODE,
          '1',
          [new Brand('MB', false), new Brand('FUSO', true)],
          false
        ),
        new GroupedKey(KeyType.BRAND_CODE, '2', [new Brand('MYB', true)], false),
        new GroupedKey(
          KeyType.BRAND_CODE,
          '3',
          [new Brand('SMT', true), new Brand('BAB', true)],
          false
        )
      ];
      brandCodeServiceSpy.get.nextWith(brandCodesMock);

      service.get('GS1234567').subscribe((keyItems: GroupedKey[]) => {
        expect(userAuthorizationServiceSpy.permissions).toHaveBeenCalledWith(['app.retail.hide']);
        expect(keyItems).toEqual(expected);
        done();
      });
    });

    it('should not get Alias for retail user', done => {
      const groupedKey: GroupedKey = new GroupedKey(
        KeyType.ALIAS,
        'A1234',
        [new Brand('MB', false), new Brand('FUSO', true)],
        false
      );

      service.get('GS1234567').subscribe((keyItems: GroupedKey[]) => {
        expect(keyItems).not.toContain(groupedKey);
        done();
      });
    });

    it('should not get FederalID for retail user', done => {
      const groupedKey: GroupedKey = new GroupedKey(
        KeyType.FEDERAL_ID,
        '1',
        [new Brand('MB', false), new Brand('FUSO', true)],
        false
      );

      service.get('GS1234567').subscribe((keyItems: GroupedKey[]) => {
        expect(keyItems).not.toContain(groupedKey);
        done();
      });
    });
  });

  describe('update', () => {
    beforeEach(() => {
      brandCodeServiceSpy.create.nextWith('');
      brandCodeServiceSpy.delete.nextWith('');
      brandCodeServiceSpy.update.nextWith('');
      adamIdServiceSpy.create.nextWith('');
      adamIdServiceSpy.delete.nextWith('');
    });

    it('should call service create when adding brand to brand code', done => {
      const item: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '1',
        brandId: 'MB'
      };

      service.update('GS1234567', [item], []).subscribe(() => {
        done();
      });

      expect(brandCodeServiceSpy.create).toHaveBeenCalledWith('GS1234567', {
        brandCode: '1',
        brandId: 'MB'
      });
    });

    it('should call service delete when removing brand from brand code', done => {
      const item: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '1',
        brandId: 'MB'
      };

      service.update('GS1234567', [], [item]).subscribe(() => {
        done();
      });

      expect(brandCodeServiceSpy.delete).toHaveBeenCalledWith('GS1234567', 'MB');
    });

    it('should call service update when changing code of brand code', done => {
      const createKey: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '2',
        brandId: 'MB'
      };
      const deleteKey: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '1',
        brandId: 'MB'
      };

      service.update('GS1234567', [createKey], [deleteKey]).subscribe(() => {
        done();
      });

      expect(brandCodeServiceSpy.update).toHaveBeenCalledWith('GS1234567', {
        brandCode: '2',
        brandId: 'MB'
      });
      expect(brandCodeServiceSpy.create).not.toHaveBeenCalled();
      expect(brandCodeServiceSpy.delete).not.toHaveBeenCalled();
    });

    it('should call service update when changing code of brand code and support parallel creations', done => {
      const createKey: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '2',
        brandId: 'MB'
      };
      const deleteKey: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '1',
        brandId: 'MB'
      };

      const otherKeyCreation: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '1337',
        brandId: 'MYB'
      };

      service.update('GS1234567', [createKey, otherKeyCreation], [deleteKey]).subscribe(() => {
        done();
      });

      expect(brandCodeServiceSpy.update).toHaveBeenCalledWith('GS1234567', {
        brandCode: '2',
        brandId: 'MB'
      });
      expect(brandCodeServiceSpy.create).toHaveBeenCalledWith('GS1234567', {
        brandCode: '1337',
        brandId: 'MYB'
      });
      expect(brandCodeServiceSpy.delete).not.toHaveBeenCalled();
    });

    it('should call service update when changing code of brand code and support parallel deletions', done => {
      const createKey: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '2',
        brandId: 'MB'
      };
      const deleteKey: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '1',
        brandId: 'MB'
      };

      const otherKeyDeletion: FlatKey = {
        type: KeyType.BRAND_CODE,
        key: '4711',
        brandId: 'SMT'
      };

      service.update('GS1234567', [createKey], [deleteKey, otherKeyDeletion]).subscribe(() => {
        done();
      });

      expect(brandCodeServiceSpy.update).toHaveBeenCalledWith('GS1234567', {
        brandCode: '2',
        brandId: 'MB'
      });
      expect(brandCodeServiceSpy.create).not.toHaveBeenCalled();
      expect(brandCodeServiceSpy.delete).toHaveBeenCalledWith('GS1234567', 'SMT');
    });
  });

  describe('update', () => {
    beforeEach(() => {
      aliasServiceSpy.update.nextWith('');
      aliasServiceSpy.delete.nextWith('');
      federalIdServiceSpy.update.nextWith('');
      federalIdServiceSpy.delete.nextWith('');
    });

    it('should call service update when adding alias', done => {
      const item: FlatKey = {
        type: KeyType.ALIAS,
        key: '1'
      };

      service.update('GS1234567', [item], []).subscribe(() => {
        done();
      });

      expect(aliasServiceSpy.update).toHaveBeenCalledWith('GS1234567', {
        alias: '1'
      });
    });

    it('should call service delete when removing alias', done => {
      const item: FlatKey = {
        type: KeyType.ALIAS,
        key: '1'
      };

      service.update('GS1234567', [], [item]).subscribe(() => {
        done();
      });

      expect(aliasServiceSpy.delete).toHaveBeenCalledWith('GS1234567');
    });

    it('should call service update when adding federal ID', done => {
      const item: FlatKey = {
        type: KeyType.FEDERAL_ID,
        key: '1'
      };

      service.update('GS1234567', [item], []).subscribe(() => {
        done();
      });

      expect(federalIdServiceSpy.update).toHaveBeenCalledWith('GS1234567', {
        federalId: '1'
      });
    });

    it('should call service delete when removing federal ID', done => {
      const item: FlatKey = {
        type: KeyType.FEDERAL_ID,
        key: '1'
      };

      service.update('GS1234567', [], [item]).subscribe(() => {
        done();
      });

      expect(federalIdServiceSpy.delete).toHaveBeenCalledWith('GS1234567');
    });
  });

  describe('getUpdatableKeyTypesBy', () => {
    it('should return none when user has no permissions', done => {
      userServiceSpy.getPermissions.nextWith([]);

      service.getUpdatableKeyTypesBy('DE').subscribe(keyTypes => {
        expect(keyTypes).toEqual([]);
        done();
      });
    });

    it('should return those key types the user has update permissions for', done => {
      userServiceSpy.getPermissions.nextWith(keyTypeConfigBy(KeyType.BRAND_CODE).updatePermissions);

      service.getUpdatableKeyTypesBy('DE').subscribe(keyTypes => {
        expect(keyTypes).toEqual([KeyType.BRAND_CODE]);
        done();
      });
    });

    it('should exclude keys not available in a specific country', done => {
      userServiceSpy.getPermissions.nextWith(keyTypeConfigBy(KeyType.ALIAS).updatePermissions);

      service.getUpdatableKeyTypesBy('AU').subscribe(keyTypes => {
        expect(keyTypes).toEqual([]);
        done();
      });
    });

    it('should include keys available in a specific country', done => {
      userServiceSpy.getPermissions.nextWith(keyTypeConfigBy(KeyType.ALIAS).updatePermissions);

      service.getUpdatableKeyTypesBy('DE').subscribe(keyTypes => {
        expect(keyTypes).toEqual([KeyType.ALIAS]);
        done();
      });
    });
  });
});
