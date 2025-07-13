import { ConstraintType } from './outlet.model';

export interface SummaryTable {
  type: ConstraintType;
  translatedType?: string;
  ids?: string[];
  messages?: string[];
  isPassed: boolean;
}
