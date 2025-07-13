import { DataRestriction } from './data-restriction.model';

export function getDataRestrictionMock(): DataRestriction {
  return { id: 'Country', items: ['FR', 'GB'] };
}

export function getBusinessSiteDataRestrictionMock(): string[] {
  return ['GS1234567', 'GS1234568', 'GS1234569'];
}
