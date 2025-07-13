/** Flat node with expandable and level information */
import { BrandCode, BusinessName } from '../../../model/outlet-structure.model';

export interface FlatStructureNode {
  expandable: boolean;
  subOutlet: boolean;
  lastOutlet: boolean;
  active: boolean;
  businessSiteId: string;
  city: string;
  countryId: string;
  outletTags: string[];
  distributionLevelTags: string[];
  brandCodes?: BrandCode[];
  businessNames?: BusinessName[];
}
