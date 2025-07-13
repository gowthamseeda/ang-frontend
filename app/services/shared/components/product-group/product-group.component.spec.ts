import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { ProductGroup } from '../../../product-group/product-group.model';
import { ProductGroupService } from '../../../product-group/product-group.service';

import { ProductGroupComponent } from './product-group.component';

describe('ProductGroupComponent', () => {
  let component: ProductGroupComponent;
  let fixture: ComponentFixture<ProductGroupComponent>;

  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let productGroupService: Spy<ProductGroupService>;
  let userSettingsService: Spy<UserSettingsService>;

  const productGroups: ProductGroup[] = [
    {
      id: 'PC',
      name: 'Passenger Cars',
      shortName: 'Cars',
      translations: {
        'de-DE': {
          name: 'Personenkraftwagen',
          shortName: 'PKW'
        },
        'en-GB': {
          name: 'Passenger Cars',
          shortName: 'PC'
        }
      }
    }
  ];

  beforeEach(
    waitForAsync(() => {
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.brand.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.productGroup.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.distributionLevels.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.verify.nextWith(true);

      distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
      distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

      productGroupService = createSpyFromClass(ProductGroupService);
      productGroupService.getAll.nextWith(productGroups);

      userSettingsService = createSpyFromClass(UserSettingsService);
      userSettingsService.getLanguageId.nextWith('de-DE');

      TestBed.configureTestingModule({
        declarations: [ProductGroupComponent],
        providers: [
          {
            provide: UserAuthorizationService,
            useValue: {
              isAuthorizedFor: userAuthorizationServiceSpy
            }
          },
          {
            provide: DistributionLevelsService,
            useValue: distributionLevelsServiceSpy
          },
          {
            provide: ProductGroupService,
            useValue: productGroupService
          },
          {
            provide: UserSettingsService,
            useValue: userSettingsService
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupComponent);
    component = fixture.componentInstance;

    component.brandId = 'MB';
    component.productGroupId = 'PC';
    component.countryId = 'DE';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('evaluateUserPermissions()', () => {
      it('should return  ...', done => {
        component.brandId = 'BRANDLESS';
        component.productGroupId = 'PC';
        fixture.detectChanges();
        component.userHasPermission.subscribe(userHasPermission => {
          expect(userHasPermission).toBeTruthy();
          done();
        });
      });

      it('should return true when user have all permissions', done => {
        component.userHasPermission.subscribe(userHasPermission => {
          expect(userHasPermission).toBeTruthy();
          done();
        });
      });

      it('should return false when user does not have update permission', done => {
        userAuthorizationServiceSpy.verify.nextWith(false);
        component.userHasPermission.subscribe(userHasPermission => {
          expect(userHasPermission).toBeFalsy();
          done();
        });
      });
    });

    describe('findTooltip()', () => {
      it('should set tooltip according to language', done => {
        component.tooltip.subscribe((tooltip: string) => {
          expect(tooltip).toEqual('Personenkraftwagen');
          done();
        });
      });

      it('should deal with unknown product group', done => {
        productGroupService.getAll.nextWith([]);
        component.tooltip.subscribe((tooltip: string) => {
          expect(tooltip).toEqual('');
          done();
        });
      });

      it('should deal with missing translations', done => {
        productGroupService.getAll.nextWith([
          {
            id: 'PC',
            name: 'Passenger Cars',
            shortName: 'Cars'
          }
        ]);

        component.tooltip.subscribe((tooltip: string) => {
          expect(tooltip).toEqual('Passenger Cars');
          done();
        });
      });

      it('should deal with missing translations', done => {
        userSettingsService.getLanguageId.nextWith('fr-FR');
        component.tooltip.subscribe((tooltip: string) => {
          expect(tooltip).toEqual('Passenger Cars');
          done();
        });
      });
    });

    describe('getColor()', () => {
      it('should return white color if isHover is true', () => {
        component.isHover = true
        const result = component.getColor()

        expect(result).toEqual('white')
      });

      it('should return selected/default color if isHover is false', () => {
        component.isHover = false
        const result = component.getColor()

        expect(result).toEqual('petrol')
      });
    })
  });
});
