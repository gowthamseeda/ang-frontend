import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { ServiceTableRow } from '../../models/service-table-row.model';
import { ServiceMock } from '../../models/service.mock';

import { ServiceTableNameCellComponent } from './service-table-name-cell.component';

describe('ServiceTableNameCellComponent', () => {
  const serviceEntities = ServiceMock.asList();

  let component: ServiceTableNameCellComponent;
  let fixture: ComponentFixture<ServiceTableNameCellComponent>;

  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;

  beforeEach(
    waitForAsync(() => {
      distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);
      distributionLevelServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);

      userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
      userSettingsServiceSpy.getLanguageId.nextWith('en');

      TestBed.configureTestingModule({
        declarations: [ServiceTableNameCellComponent],
        providers: [
          { provide: DistributionLevelsService, useValue: distributionLevelServiceSpy },
          { provide: UserAuthorizationService, useValue: userAuthorizationServiceSpy },
          { provide: UserSettingsService, useValue: userSettingsServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTableNameCellComponent);
    component = fixture.componentInstance;

    component.serviceTableRow = new ServiceTableRow();
    component.serviceTableRow.entry = serviceEntities['1'];

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
