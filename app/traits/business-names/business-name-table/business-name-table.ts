import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { GroupedBusinessName } from '../business-names.model';

export namespace BusinessNameTable {
  export function emptyRowExists(rows: UntypedFormArray): boolean {
    return rows.value
      .filter((row: GroupedBusinessName) => !row.deleted)
      .some((row: GroupedBusinessName) => row.name === '');
  }

  export function allAvailableBrandIdsSelected(
    availableBrandIds: string[],
    rows: UntypedFormArray
  ): boolean {
    return availableBrandIds.every(brandId => this.selectedBrandIds(rows).includes(brandId));
  }

  export function selectedBrandIds(rows: UntypedFormArray): string[] {
    return rows.controls
      .map(row => row.value as GroupedBusinessName)
      .filter(businessName => !businessName.deleted)
      .map(businessName => businessName.brands.map(brand => brand.brandId) as string[])
      .reduce(
        (filteredBrandIds: string[], currentBrandIds: string[]) =>
          filteredBrandIds.concat(currentBrandIds),
        []
      );
  }

  export function deleteRow(row: UntypedFormGroup): void {
    row.removeControl('name');
    row.removeControl('brands');
    row.removeControl('translations');
    row.patchValue({ deleted: true }, { onlySelf: false });
    row.markAsDirty();
  }

  export function controlByName(row: UntypedFormGroup, controlId: string): UntypedFormControl {
    return row.get(controlId) as UntypedFormControl;
  }
}
