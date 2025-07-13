import { diff } from '../../shared/util/arrays';

import { keyTypeConfigBy } from './key-type.model';
import { FlatKey, GroupedKey } from './key.model';

const EMPTY_CHANGES: KeyChanges = {
  creates: [],
  deletes: []
};

export class KeyChangeTracker {
  currentState: GroupedKey;

  constructor(private initialState: GroupedKey) {
    this.currentState = this.initialState;
  }

  allChanges(): KeyChanges {
    const keyType = this.currentState.type;
    const keyTypeConfig = keyTypeConfigBy(keyType);

    if (keyTypeConfig.brandDependent) {
      return this.allBrandDependentChanges();
    } else {
      return this.allBrandIndependentChanges();
    }
  }

  private allBrandIndependentChanges(): KeyChanges {
    if (this.initialState.key === this.currentState.key) {
      return EMPTY_CHANGES;
    }

    return {
      creates: this.toKeyChange(this.currentState),
      deletes: this.currentState.deleted ? this.toKeyChange(this.initialState) : []
    };
  }

  private toKeyChange(state: any): FlatKey[] {
    if (state.type && state.key) {
      return [
        {
          type: state.type,
          key: state.key
        }
      ];
    }

    return [];
  }

  private allBrandDependentChanges(): KeyChanges {
    if (this.currentState.deleted) {
      return this.toBrandKeyChanges(
        [],
        this.initialState.brands.map(brand => brand.brandId)
      );
    }

    return this.determineBrandChanges();
  }

  private determineBrandChanges(): KeyChanges {
    const brandDiff = diff(this.brandIdsInitialState(), this.brandIdsCurrentState());

    const brandChanges = this.toBrandKeyChanges(brandDiff.added, brandDiff.removed);
    const keyChanges = this.determineBrandKeyChanges(brandDiff);

    return {
      creates: [...brandChanges.creates, ...keyChanges.creates],
      deletes: [...brandChanges.deletes, ...keyChanges.deletes]
    };
  }

  private brandIdsInitialState(): string[] {
    if (this.initialState.brands !== undefined) {
      return this.initialState.brands.map(brand => brand.brandId);
    }
    return [];
  }

  private brandIdsCurrentState(): string[] {
    if (this.currentState.brands !== undefined) {
      return this.currentState.brands.map(brand => brand.brandId);
    }
    return [];
  }

  private determineBrandKeyChanges(brandDiff: any): KeyChanges {
    if (this.initialState.key === this.currentState.key) {
      return EMPTY_CHANGES;
    }

    return this.toBrandKeyChanges(brandDiff.intersection, brandDiff.intersection);
  }

  private toBrandKeyChanges(addedBrandIds: string[], removedBrandIds: string[]): KeyChanges {
    return {
      creates: addedBrandIds.map(brandId => this.toFlatKey(this.currentState, brandId)),
      deletes: removedBrandIds.map(brandId => this.toFlatKey(this.initialState, brandId))
    };
  }

  private toFlatKey(state: GroupedKey, brandId: string): any {
    return {
      type: state.type,
      key: state.key,
      brandId: brandId
    };
  }
}

export interface KeyChanges {
  readonly creates: FlatKey[];
  readonly deletes: FlatKey[];
}
