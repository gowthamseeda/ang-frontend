import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';

import { TooltipDefaultPipeMock } from '../../../../testing/pipe-mocks/tooltipDefault';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { ServiceActionTabsComponent } from './service-action-tabs.component';

describe('ServiceActionTabsComponent', () => {
  let component: ServiceActionTabsComponent;
  let fixture: ComponentFixture<ServiceActionTabsComponent>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(
    waitForAsync(() => {
      distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
      distributionLevelsServiceSpy.get.nextWith([]);

      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);

      TestBed.configureTestingModule({
        declarations: [ServiceActionTabsComponent, TranslatePipeMock, TooltipDefaultPipeMock],
        providers: [
          TranslatePipeMock,
          provideMockStore(),
          {
            provide: DistributionLevelsService,
            useValue: distributionLevelsServiceSpy
          },
          {
            provide: UserAuthorizationService,
            useValue: userAuthorizationServiceSpy
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceActionTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
