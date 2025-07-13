import { Brand } from '../../brand.model';

import { AssignedBrandLabel, GroupedAssignedBrandLabel } from './assigned-brand-label';

export function getBrandLabelAssignments(): AssignedBrandLabel[] {
  const mb_1 = new AssignedBrandLabel();
  mb_1.brandId = 'MB';
  mb_1.labelId = 1;

  const myb_2 = new AssignedBrandLabel();
  myb_2.brandId = 'MYB';
  myb_2.labelId = 2;

  const bab_2 = new AssignedBrandLabel();
  bab_2.brandId = 'BAB';
  bab_2.labelId = 2;

  const smt_1 = new AssignedBrandLabel();
  smt_1.brandId = 'SMT';
  smt_1.labelId = 1;

  return [mb_1, myb_2, bab_2, smt_1];
}

export function getAssignedBrandLabels(): GroupedAssignedBrandLabel[] {
  const label_1 = new GroupedAssignedBrandLabel(1, [new Brand('MB'), new Brand('SMT')]);
  const label_2 = new GroupedAssignedBrandLabel(2, [new Brand('MYB'), new Brand('BAB')]);

  return [label_1, label_2];
}

export function getBrandIds(): string[] {
  return ['MB', 'MYB', 'BAB', 'SMT'];
}
