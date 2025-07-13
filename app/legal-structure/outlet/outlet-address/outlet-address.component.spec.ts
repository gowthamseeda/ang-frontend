import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { getRegionMappingMock } from '../../../geography/regionmapping/regionmapping.mock';
import { RegionMappingService } from '../../../geography/regionmapping/regionmapping.service';
import { FeatureToggleDirective } from '../../../shared/directives/feature-toggle/feature-toggle.directive';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { LocationService } from '../../location/services/location-service.model';
import { MessageService } from '../../shared/services/message.service';

import { OutletAddressComponent } from './outlet-address.component';
import {of} from "rxjs";
import {BaseData4rService} from "../base-data-4r.service";

function getOutletFormMock() {
  return new FormBuilder().group({});
}

describe('OutletAddressComponent', () => {
  let component: OutletAddressComponent;
  let fixture: ComponentFixture<OutletAddressComponent>;

  let locationServiceSpy: Spy<LocationService>;
  let regionMappingServiceSpy: Spy<RegionMappingService>;
  let messageServiceSpy: Spy<MessageService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let baseData4rServiceSpy: Spy<BaseData4rService>;

  beforeEach(waitForAsync(() => {
    locationServiceSpy = createSpyFromClass(LocationService);
    locationServiceSpy.selectRegion.nextWith({});
    messageServiceSpy = createSpyFromClass(MessageService);
    messageServiceSpy.get.nextWith({});

    regionMappingServiceSpy = createSpyFromClass(RegionMappingService);
    regionMappingServiceSpy.get.nextWith(getRegionMappingMock());

    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(false);
    baseData4rServiceSpy = createSpyFromClass(BaseData4rService);
    baseData4rServiceSpy.isOpenVerificationTaskByAggregateField.mockReturnValue(of(true));

    TestBed.configureTestingModule({
      declarations: [OutletAddressComponent, TranslatePipeMock, FeatureToggleDirective],
      providers: [
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: RegionMappingService, useValue: regionMappingServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: BaseData4rService, useValue: baseData4rServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletAddressComponent);
    component = fixture.componentInstance;
    component.parentForm = getOutletFormMock();
    component.dataNotification = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit countryIdSelection', () => {
    const spy = spyOn(component.countryIdSelection, 'emit');
    component.emitCountryId({} as string);
    expect(spy).toHaveBeenCalled();
  });
});
