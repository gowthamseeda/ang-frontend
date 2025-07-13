export interface LocationAddressRequestParams {
  city: string;
  countryId: string;
  language?: string;
  street?: string;
  streetNumber?: string;
  zipCode?: string;
}

export interface LocationCoordinatesRequestParams {
  language?: string;
  latitude: string;
  longitude: string;
}

export interface LocationResponse {
  city?: string;
  country?: string;
  countryId?: string;
  language?: string;
  latitude?: number;
  longitude?: number;
  province?: string;
  state?: string;
  street?: string;
  streetNumber?: string;
  zipCode?: string;
}
