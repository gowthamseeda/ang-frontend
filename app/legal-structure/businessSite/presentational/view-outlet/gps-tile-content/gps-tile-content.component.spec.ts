import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { CustomLazyMapsAPILoader } from '../../../../../google/google-maps-loader';
import { MapComponent } from '../../../../../google/map/map.component';
import { ApiService } from '../../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../../shared/services/logging/logging.service';
import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { TestingModule } from '../../../../../testing/testing.module';
import { UserSettingsService } from '../../../../../user-settings/user-settings/services/user-settings.service';

describe('GpsTileContentComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mapsAPILoaderSpy: Spy<CustomLazyMapsAPILoader>;

  beforeEach(
    waitForAsync(() => {
      mapsAPILoaderSpy = createSpyFromClass(CustomLazyMapsAPILoader);
      TestBed.configureTestingModule({
        declarations: [MapComponent, TranslatePipeMock],
        imports: [RouterTestingModule.withRoutes([]), TestingModule],
        providers: [
          { provide: CustomLazyMapsAPILoader, useValue: mapsAPILoaderSpy },
          CustomLazyMapsAPILoader,
          ApiService,
          UserSettingsService,
          LoggingService
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.tile = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display world map without marker when coordinates is empty', () => {
    component.mapConfiguration();
    expect(component.zoom).toEqual(1);
    expect(component.displayMarker).toBeFalsy();
  });

  it('set correct zoom level when tile is shown', () => {
    const latitudeMock = 40.632637;
    const longitudeMock = 22.954357;

    component.ngOnChanges({
      latitude: new SimpleChange(null, latitudeMock, true),
      longitude: new SimpleChange(null, longitudeMock, true)
    });
    expect(component.zoom).toEqual(15);
  });
});
