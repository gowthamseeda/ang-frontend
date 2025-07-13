import { TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ApiService } from '../../../shared/services/api/api.service';
import { TestingModule } from '../../../testing/testing.module';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';

import { EditLayoutService } from './edit-layout.service';

describe('EditLayoutService', () => {
  let service: EditLayoutService;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let apiServiceSpy: Spy<ApiService>;

  beforeEach(
    waitForAsync(() => {
      apiServiceSpy = createSpyFromClass(ApiService);
      userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
      userSettingsServiceSpy.get.nextWith({ showMarginalColumn: false });

      TestBed.configureTestingModule({
        imports: [TestingModule],
        providers: [
          EditLayoutService,
          { provide: UserSettingsService, useValue: userSettingsServiceSpy },
          { provide: ApiService, useValue: apiServiceSpy }
        ]
      });

      service = TestBed.inject(EditLayoutService);
    })
  );

  describe('init', () => {
    it('should create', () => {
      expect(service).toBeTruthy();
    });

    it('should call get of settings service', () => {
      expect(userSettingsServiceSpy.get).toHaveBeenCalled();
    });
  });

  describe('toggleMarginalColumn', () => {
    beforeEach(() => {
      userSettingsServiceSpy.updateUserShowMarginalColumn.nextWith({});
    });

    it('should toggle value to true', () => {
      service.marginalColumnShown = false;
      service.toggleMarginalColumn();
      expect(service.marginalColumnVisible()).toBeTruthy();
    });

    it('should toggle value to false', () => {
      service.marginalColumnShown = true;
      service.toggleMarginalColumn();
      expect(service.marginalColumnVisible()).toBeFalsy();
    });

    it('should call update of settings service', () => {
      service.marginalColumnShown = false;
      service.toggleMarginalColumn();
      expect(userSettingsServiceSpy.updateUserShowMarginalColumn).toHaveBeenCalled();
    });
  });
});
