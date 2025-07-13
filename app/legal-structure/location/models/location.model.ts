export interface LocationAddress {
  streetNumber?: string;
  street?: string;
  city?: string;
  countryId: string;
  zipCode?: string;
}

export interface LocationRegion {
  state?: string;
  province?: string;
}

export interface LocationGps {
  latitude: string;
  longitude: string;
}

export interface Location {
  address: LocationAddress;
  region?: LocationRegion;
  gps?: LocationGps;
}
