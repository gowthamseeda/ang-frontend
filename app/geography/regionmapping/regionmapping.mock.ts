import { RegionMapping } from './regionmapping.model';

export function getRegionMappingMock(): RegionMapping {
  return {
    id: 'DE',
    stateLevel: 1,
    provinceLevel: 2
  };
}
