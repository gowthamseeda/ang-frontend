import { diff } from '../../../shared/util/arrays';

import { FlatAssignedBrandLabel, GroupedAssignedBrandLabel } from './assigned-brand-label';

const EMPTY_CHANGES: AssignedBrandLabelChanges = {
  creates: [],
  deletes: []
};

export class AssignedBrandLabelsChangeTracker {
  currentState: GroupedAssignedBrandLabel;
  initialState: GroupedAssignedBrandLabel;

  constructor(initialState: GroupedAssignedBrandLabel) {
    this.initialState = initialState;
    this.currentState = initialState;
  }

  reset(): void {
    this.initialState = this.currentState;
  }

  allChanges(): AssignedBrandLabelChanges {
    if (this.currentState.deleted) {
      return this.toBrandChanges(
        [],
        this.initialState.brands.map(brand => brand.brandId)
      );
    }

    return this.determineBrandChanges();
  }

  private determineBrandChanges(): AssignedBrandLabelChanges {
    const brandDiff = diff(
      this.initialState.brands.map(brand => brand.brandId),
      this.currentState.brands.map(brand => brand.brandId)
    );

    const brandChanges = this.toBrandChanges(brandDiff.added, brandDiff.removed);
    const labelChanges = this.determineLabelChanges(brandDiff);

    return {
      creates: [...brandChanges.creates, ...labelChanges.creates],
      deletes: [...brandChanges.deletes, ...labelChanges.deletes]
    };
  }

  private determineLabelChanges(brandDiff: any): AssignedBrandLabelChanges {
    if (this.initialState.labelId === this.currentState.labelId) {
      return EMPTY_CHANGES;
    }

    return this.toBrandChanges(brandDiff.intersection, brandDiff.intersection);
  }

  private toBrandChanges(
    addedBrands: string[],
    removedBrands: string[]
  ): AssignedBrandLabelChanges {
    return {
      creates: addedBrands.map(brandId =>
        this.toFlatAssignedBrandLabel(this.currentState, brandId)
      ),
      deletes: removedBrands.map(brandId =>
        this.toFlatAssignedBrandLabel(this.initialState, brandId)
      )
    };
  }

  private toFlatAssignedBrandLabel(
    row: GroupedAssignedBrandLabel,
    brandId: string
  ): FlatAssignedBrandLabel {
    return {
      labelId: row.labelId,
      brandId: brandId
    };
  }
}

export interface AssignedBrandLabelChanges {
  readonly creates: FlatAssignedBrandLabel[];
  readonly deletes: FlatAssignedBrandLabel[];
}
