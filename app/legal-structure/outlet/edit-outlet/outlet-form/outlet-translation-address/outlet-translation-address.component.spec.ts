import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { getRegionMappingMock } from '../../../../../geography/regionmapping/regionmapping.mock';
import { RegionMappingService } from '../../../../../geography/regionmapping/regionmapping.service';
import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { LocationService } from '../../../../location/services/location-service.model';
import { MessageService } from '../../../../shared/services/message.service';

import { OutletTranslationAddressComponent } from './outlet-translation-address.component';

function getFormMock() {
  return new UntypedFormBuilder().group({});
}

describe('OutletTranslationAddressComponent', () => {
  let component: OutletTranslationAddressComponent;
  let fixture: ComponentFixture<OutletTranslationAddressComponent>;

  let locationServiceSpy: Spy<LocationService>;
  let regionMappingServiceSpy: Spy<RegionMappingService>;
  let messageServiceSpy: Spy<MessageService>;

  beforeEach(
    waitForAsync(() => {
      locationServiceSpy = createSpyFromClass(LocationService);
      locationServiceSpy.updateLocationDataInStoreFor.mockReturnValue('');
      regionMappingServiceSpy = createSpyFromClass(RegionMappingService);
      regionMappingServiceSpy.get.nextWith(getRegionMappingMock());
      messageServiceSpy = createSpyFromClass(MessageService);
      messageServiceSpy.get.nextWith({});

      TestBed.configureTestingModule({
        declarations: [OutletTranslationAddressComponent, TranslatePipeMock],
        providers: [
          UntypedFormBuilder,
          { provide: LocationService, useValue: locationServiceSpy },
          { provide: RegionMappingService, useValue: regionMappingServiceSpy },
          { provide: MessageService, useValue: messageServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletTranslationAddressComponent);
    component = fixture.componentInstance;
    component.parentForm = getFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
