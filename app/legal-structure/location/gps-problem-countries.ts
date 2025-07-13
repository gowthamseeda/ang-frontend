const GPS_PROBLEM_COUNTRIES = ['CN'];

export function getGpsProblemCountryList(): string[] {
  return GPS_PROBLEM_COUNTRIES;
}

export function isGPSProblemCountry(countryId: string | undefined): boolean {
  if (!countryId) {
    return false;
  }
  return getGpsProblemCountryList().indexOf(countryId.toUpperCase()) >= 0;
}
