export interface StandardOpeningHourResponse {
  brand: string;
  productGroups: string[];
  openingHours: OpeningHourResponse[];
}

export interface SpecialOpeningHourResponse extends StandardOpeningHourResponse {
  startDate: string;
  endDate: string;
}

export interface OpeningHourResponse {
  day: string;
  times: Times[];
  closed: boolean;
}

export interface Times {
  begin: string;
  end: string;
}

export interface Response {
  businessSiteId: string;
  countryId: string;
  productCategoryId: string;
  serviceId: number;
  serviceCharacteristicId: string;
  serviceName: string;
  serviceCharacteristicName: string;
  standardOpeningHours: StandardOpeningHourResponse[];
  specialOpeningHours?: SpecialOpeningHourResponse[];
  translations: {};
}
