import { TestBed } from '@angular/core/testing';
import { clone } from 'ramda';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import { hansSettingsMock } from '../model/user-settings.mock';

import { UserSettingsService } from './user-settings.service';

const expectedSettings = hansSettingsMock;

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, UserSettingsService]
    });

    service = TestBed.inject(UserSettingsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get() ', () => {
    it('should get the user settings from the user-settings contract', done => {
      service.get().subscribe(response => {
        expect(response).toEqual(expectedSettings);
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update the user settings from the user-settings contract', done => {
      service.update({ languageId: 'en-UK' }).subscribe(response => {
        expect(response.status).toEqual('UPDATED');
        done();
      });
    });
  });

  describe('updateAndFetch()', () => {
    it('should update user settings by replacing languageId to existing settings', done => {
      spyOn(service, 'update').and.callThrough();

      const result = clone(expectedSettings);
      result.languageId = 'en-UK';

      service.updateAndFetch({ languageId: 'en-UK' }).subscribe(() => {
        expect(service.update).toHaveBeenCalledWith(result);
        done();
      });
    });

    it('should update user settings by replacing searchOutletByDefaultCountry to existing settings', done => {
      spyOn(service, 'update').and.callThrough();

      const result = clone(expectedSettings);
      result.searchOutletByDefaultCountry = false;

      service.updateAndFetch({ searchOutletByDefaultCountry: false }).subscribe(() => {
        expect(service.update).toHaveBeenCalledWith(result);
        done();
      });
    });

    it('should update user settings by replacing defaultCountry & searchOutletByDefaultCountry to existing settings', done => {
      spyOn(service, 'update').and.callThrough();

      const result = clone(expectedSettings);
      result.defaultCountry = 'GB';
      result.searchOutletByDefaultCountry = false;

      service
        .updateAndFetch({ defaultCountry: 'GB', searchOutletByDefaultCountry: false })
        .subscribe(() => {
          expect(service.update).toHaveBeenCalledWith(result);
          done();
        });
    });

    it('should update user settings by replacing searchOutletByActiveOutlet to existing settings', done => {
      spyOn(service, 'update').and.callThrough();

      const result = clone(expectedSettings);
      result.searchOutletByActiveOutlet = false;

      service.updateAndFetch({ searchOutletByActiveOutlet: false }).subscribe(() => {
        expect(service.update).toHaveBeenCalledWith(result);
        done();
      });
    });

    it('should update user settings by replacing doNotShowMultiSelectConfirmationDialog to existing settings', done => {
      spyOn(service, 'update').and.callThrough();

      const result = clone(expectedSettings);
      result.doNotShowMultiSelectConfirmationDialog = true;

      service.updateAndFetch({ doNotShowMultiSelectConfirmationDialog: true }).subscribe(() => {
        expect(service.update).toHaveBeenCalledWith(result);
        done();
      });
    });
  });

  describe('updateUserSettings()', () => {
    it('should updateAndFetch with user settings fields', done => {
      spyOn(service, 'updateAndFetch').and.callThrough();

      const defaultCountry = 'GB';
      const searchOutletByDefaultCountry = false;
      const searchOutletByActiveOutlet = true;
      const doNotShowMultiSelectConfirmationDialog = false;

      service
        .updateUserSettings(
          defaultCountry,
          searchOutletByDefaultCountry,
          searchOutletByActiveOutlet,
          doNotShowMultiSelectConfirmationDialog
        )
        .subscribe(() => {
          expect(service.updateAndFetch).toHaveBeenCalledWith({
            defaultCountry,
            searchOutletByDefaultCountry,
            searchOutletByActiveOutlet,
            doNotShowMultiSelectConfirmationDialog
          });
          done();
        });
    });
  });

  describe('getSearchOutletByDefaultCountryFlag', () => {
    it('should return searchOutletByDefaultCountry', done => {
      service.getSearchOutletByDefaultCountryFlag().subscribe(value => {
        expect(value).toBeTruthy();
        done();
      });
    });
  });
});
