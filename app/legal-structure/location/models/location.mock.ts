import { Location, LocationAddress, LocationGps, LocationRegion } from './location.model';

export function getLocationAddressMock(): LocationAddress {
  return {
    city: 'Berlin',
    countryId: 'DE',
    street: 'Leipziger Street',
    streetNumber: '1',
    zipCode: '10117'
  };
}

export function getLocationGpsMock(): LocationGps {
  return { latitude: '50.123456', longitude: '10.123456' };
}

export function getLocationRegionMock(): LocationRegion {
  return { state: 'state', province: 'province' };
}

export function getLocationMock(): Location {
  return {
    address: { ...getLocationAddressMock() },
    gps: { ...getLocationGpsMock() },
    region: { ...getLocationRegionMock() }
  };
}
