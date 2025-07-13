import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { hansSettingsMock } from '../user-settings/user-settings/model/user-settings.mock';
import { UserSettingsService } from '../user-settings/user-settings/services/user-settings.service';

import { CustomLazyMapsAPILoader } from './google-maps-loader';

describe('Service: CustomLazyMapsAPILoader', () => {
  let loader: CustomLazyMapsAPILoader;
  let userSettingsServiceMock: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomLazyMapsAPILoader,
        {
          provide: UserSettingsService,
          useValue: {
            getLanguageId: jest.fn()
          }
        }
      ]
    });

    loader = TestBed.inject(CustomLazyMapsAPILoader);
    userSettingsServiceMock = TestBed.inject(UserSettingsService);

    jest.spyOn(document, 'createElement');
    jest.spyOn(document.body, 'appendChild');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create', () => {
    expect(loader).toBeTruthy();
  });

  test('should create the default script URL', () => {
    jest
      .spyOn(userSettingsServiceMock, 'getLanguageId')
      .mockReturnValue(of(hansSettingsMock.languageId));

    loader.load();
    expect(document.createElement).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('script');
  });

  test('should load the script via http when provided', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    jest
      .spyOn(userSettingsServiceMock, 'getLanguageId')
      .mockReturnValue(of(hansSettingsMock.languageId));

    loader.load();

    expect(document.createElement).toHaveBeenCalled();
    expect(userSettingsServiceMock.getLanguageId).toHaveBeenCalled();
  });

  test('should not append a second script to body when window.google.maps is defined', () => {
    // @ts-ignore
    document.defaultView.google = {
      // @ts-ignore
      maps: {}
    };

    loader.load();
    expect(document.body.appendChild).not.toHaveBeenCalled();
  });
});
