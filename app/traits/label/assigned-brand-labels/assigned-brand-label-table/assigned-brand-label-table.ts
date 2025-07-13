import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { GroupedAssignedBrandLabel } from '../assigned-brand-label';

export namespace AssignedBrandLabelTable {
  export function emptyRowExists(rows: UntypedFormArray): boolean {
    return rows.value
      .filter((row: GroupedAssignedBrandLabel) => !row.deleted)
      .some((row: GroupedAssignedBrandLabel) => row.labelId === null);
  }

  export function selectedBrandIds(rows: UntypedFormArray): string[] {
    return rows.controls
      .map(row => row.value as GroupedAssignedBrandLabel)
      .filter(assignedBrandLabel => !assignedBrandLabel.deleted)
      .map(assignedBrandLabel => assignedBrandLabel.brands.map(brand => brand.brandId) as string[])
      .reduce(
        (filteredBrandIds: string[], currentBrandIds: string[]) =>
          filteredBrandIds.concat(currentBrandIds),
        []
      );
  }

  export function deleteRow(row: UntypedFormGroup): void {
    row.removeControl('labelId');
    row.removeControl('brands');
    row.patchValue({ deleted: true }, { onlySelf: false });
    row.markAsDirty();
  }

  export function controlByName(row: UntypedFormGroup, controlId: string): UntypedFormControl {
    return row.get(controlId) as UntypedFormControl;
  }
}
