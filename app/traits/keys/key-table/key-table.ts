import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { KeyType, KeyTypeConfig, keyTypeConfigBy } from '../key-type.model';
import { GroupedKey } from '../key.model';

export namespace KeyTable {
  export function emptyRowExists(rows: UntypedFormArray): boolean {
    return rows.value
      .filter((row: GroupedKey) => !row.deleted)
      .some((row: GroupedKey) => row.type === null);
  }

  export function deleteRow(row: UntypedFormGroup): void {
    row.removeControl('key');
    row.removeControl('brands');
    row.patchValue({ deleted: true }, { onlySelf: false });
    row.markAsDirty();
  }

  export function resetControl(
    row: UntypedFormGroup,
    controlId: string,
    value: any,
    validators: ValidatorFn[]
  ): void {
    const control = KeyTable.controlByName(row, controlId);
    control.setValidators(validators);
    control.setValue(value);
    control.markAsUntouched();
  }

  export function controlByName(row: UntypedFormGroup, controlId: string): UntypedFormControl {
    return row.get(controlId) as UntypedFormControl;
  }

  export function hasBrandCode(rows: UntypedFormArray): boolean {
    return rows.controls.some(row => row.value.type === KeyType.BRAND_CODE && !row.value.deleted);
  }

  export function isNewRow(row: UntypedFormGroup): boolean {
    return row.value.type === null;
  }

  export function isBrandDependent(row: UntypedFormGroup): boolean {
    const keyTypeConfig: KeyTypeConfig = keyTypeConfigBy(row.value.type);
    return keyTypeConfig.brandDependent;
  }

  export function isLastBrandCode(currentRow: UntypedFormGroup, rows: UntypedFormArray): boolean {
    return (
      currentRow.value.type === KeyType.BRAND_CODE &&
      rows.value.filter(
        (row: GroupedKey) => row.type === KeyType.BRAND_CODE && row.deleted === false
      ).length === 1
    );
  }

  export function getSelectedKeyTypes(rows: UntypedFormArray): KeyType[] {
    return rows.value.filter((key: GroupedKey) => !key.deleted).map((key: GroupedKey) => key.type);
  }

  export function assignedKeys(rows: UntypedFormArray, keyType: KeyType): GroupedKey[] {
    return rows.controls
      .map((key: AbstractControl) => key.value as GroupedKey)
      .filter(key => key.type !== null)
      .filter(key => !key.deleted)
      .filter(key => key.type === keyType);
  }

  export function assignedBrandIds(rows: UntypedFormArray, keyType: KeyType): string[] {
    return this.assignedKeys(rows, keyType)
      .map((assignedKey: GroupedKey) => assignedKey.brands.map(brand => brand.brandId) as string[])
      .reduce(
        (brandIds: string[], currentBrandIds: string[]) => brandIds.concat(currentBrandIds),
        []
      );
  }

  export function brandRequiredForProductGroup(control: AbstractControl): ValidationErrors | null {
    if (control) {
      const formGroup = control.parent;
      const productGroupId = formGroup?.get('productGroupId');

      if (!control.value && productGroupId?.value) {
        return { required: true };
      }
    }

    return null;
  }
}
