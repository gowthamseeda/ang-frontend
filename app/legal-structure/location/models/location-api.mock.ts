import { LocationResponse } from './location-api';

export function getLocationApiMock(): LocationResponse {
  return {
    city: 'Berlin',
    country: 'Germany',
    countryId: 'DE',
    language: 'en',
    latitude: 50.123456,
    longitude: 10.123456,
    province: 'province',
    state: 'state',
    street: 'Leipziger Street',
    streetNumber: '1',
    zipCode: '10117'
  };
}
