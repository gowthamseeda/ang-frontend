import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { AppConfigProvider, AppConfigService, WindowUrlProvider } from './app-config.service';
import { LoggingService } from './shared/services/logging/logging.service';
import { TestingModule } from './testing/testing.module';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let windowUrlProviderSpy: Spy<WindowUrlProvider>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;

  beforeEach(() => {
    windowUrlProviderSpy = createSpyFromClass(WindowUrlProvider, ['getCurrentUrl']);
    appConfigProviderSpy = createSpyFromClass(AppConfigProvider, ['getAppConfig']);

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AppConfigService,
        LoggingService,
        { provide: WindowUrlProvider, useValue: windowUrlProviderSpy },
        { provide: AppConfigProvider, useValue: appConfigProviderSpy }
      ]
    });

    service = TestBed.inject(AppConfigService);

    windowUrlProviderSpy.getCurrentUrl.mockReturnValue('http://localhost');
    appConfigProviderSpy.getAppConfig.mockReturnValue({
      environment: 'Local',
      urlExtern: 'https://extern_current_url',
      production: false,
      backend: '',
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
