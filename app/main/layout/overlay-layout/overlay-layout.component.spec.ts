import { OverlayModule } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { appConfigMock } from '../../../app-config.mock';
import { AppConfigProvider } from '../../../app-config.service';

import { OverlayLayoutComponent } from './overlay-layout.component';

const appConfig = appConfigMock;

describe('DefaultLayoutComponent', () => {
  let component: OverlayLayoutComponent;
  let fixture: ComponentFixture<OverlayLayoutComponent>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;

  beforeEach(
    waitForAsync(() => {
      appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
      appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);

      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          }),
          OverlayModule
        ],
        providers: [
          {
            provide: AppConfigProvider,
            useValue: appConfigProviderSpy
          }
        ],
        declarations: [OverlayLayoutComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy()', () => {
    it('should close on component destroy', () => {
      jest.spyOn(component, 'close');
      component.ngOnDestroy();
      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('openWithTemplate()', () => {
    it('should create overlay reference and set isOpen to true on openWithTemplate', () => {
      expect(component.overlayRef).toBeFalsy();
      component.openWithTemplate();
      expect(component.overlayRef).toBeTruthy();
      expect(component.isOpen).toBeTruthy();
    });
  });

  describe('close()', () => {
    it('should dispose overlay reference and set isOpen to false on close if overlay exists', () => {
      component.openWithTemplate();
      expect(component.overlayRef).toBeTruthy();
      expect(component.isOpen).toBeTruthy();
      jest.spyOn(component.overlayRef, 'dispose').mockImplementation();

      component.close();
      expect(component.overlayRef.dispose).toHaveBeenCalled();
      expect(component.isOpen).toBeFalsy();
    });

    it('should set isOpen to false on close if overlay does not exists', () => {
      expect(component.overlayRef).toBeFalsy();

      component.close();
      expect(component.isOpen).toBeFalsy();
    });
  });

  describe('getOverlayPositionStrategy()', () => {
    it('should return overlay position strategy', () => {
      const result = component.getOverlayPositionStrategy();
      expect(result).toBeTruthy();
    });
  });

  describe('getEnableHideableCompanyNavigationConfig', () => {
    it('should return app config for enableHideableCompanyNavigation', () => {
      const result = component.getEnableHideableCompanyNavigationConfig();
      expect(result).toBeFalsy();
    });

    it('should return true if value is true for app config for enableHideableCompanyNavigation', () => {
      appConfig.enableHideableCompanyNavigation = true;

      appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);
      const result = component.getEnableHideableCompanyNavigationConfig();
      expect(result).toBeTruthy();
    });
  });
});
