import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { FeatureToggleDirective } from '../../../../shared/directives/feature-toggle/feature-toggle.directive';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { LocationService } from '../../../location/services/location-service.model';
import { MessageService } from '../../services/message.service';

import { GpsComponent } from './gps.component';
import { GPS } from '../../models/gps.model';
import { ComparableAddress } from '../../../../google/map-message/comparable-address.model';

function getParentFormMock() {
  return new UntypedFormBuilder().group({
    address: new UntypedFormBuilder().group({
      streetNumber: '',
      street: '',
      zipCode: '',
      city: ''
    }),
    countryId: new UntypedFormBuilder().control(''),
    countryName: new UntypedFormBuilder().control('')
  });
}

function getGpsFormMock() {
  return new UntypedFormBuilder().group({
    gps: new UntypedFormBuilder().group({
      latitude: '',
      longitude: ''
    })
  });
}

describe('GpsFormComponent', () => {
  let component: GpsComponent;
  let fixture: ComponentFixture<GpsComponent>;

  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let locationServiceSpy: Spy<LocationService>;
  let messageServiceSpy: Spy<MessageService>;

  beforeEach(waitForAsync(() => {
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    locationServiceSpy = createSpyFromClass(LocationService);
    messageServiceSpy = createSpyFromClass(MessageService);
    messageServiceSpy.add.mockReturnValue('');
    messageServiceSpy.get.nextWith({});

    TestBed.configureTestingModule({
      declarations: [GpsComponent, TranslatePipeMock, FeatureToggleDirective],
      providers: [
        UntypedFormBuilder,
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsComponent);
    component = fixture.componentInstance;
    component.parentForm = getParentFormMock();
    component.gpsForm = getGpsFormMock();
    component.dataNotification = [];
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    locationServiceSpy.selectGpsCoordinates.nextWith({ latitude: '5', longitude: '6' });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the GPS form and subscribe to value changes', () => {
      const initGPSFormSpy = spyOn<any>(component, 'initGPSForm');
      const initGPSChangeFieldsSpy = spyOn<any>(component, 'initGPSChangeFields');
      const subscribeToLocationGpsCoordinatesChangesSpy = spyOn<any>(component, 'subscribeToLocationGpsCoordinatesChanges');

      component.ngOnInit();

      expect(initGPSFormSpy).toHaveBeenCalled();
      expect(initGPSChangeFieldsSpy).toHaveBeenCalled();
      expect(subscribeToLocationGpsCoordinatesChangesSpy).toHaveBeenCalled();
    });
  });

  it('should set gpsCoordsForMap and call compareLocationsAddressAndUpdateMismatch after 2 seconds', (done) => {
    const mockGPS: GPS = { latitude: '40.7128', longitude: '-74.0060' };

    component.gps = mockGPS;

    expect(component.gpsCoordsForMap).toEqual(mockGPS);

    setTimeout(() => {
      expect(locationServiceSpy.compareLocationsAddressAndUpdateMismatch).toHaveBeenCalledWith(
        mockGPS.latitude,
        mockGPS.longitude,
        new ComparableAddress()
      );
      done();
    }, 2000);
  });

});
