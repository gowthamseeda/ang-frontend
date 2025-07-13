import { TaskData } from 'app/tasks/task.model';

import { diff, isEqual } from '../../shared/util/arrays';

import { FlatBusinessName, GroupedBusinessName } from './business-names.model';

const EMPTY_CHANGES: BusinessNameChanges = {
  creates: [],
  updates: [],
  deletes: []
};

export class BusinessNamesChangeTracker {
  currentState: GroupedBusinessName;
  taskData?: TaskData;

  constructor(private initialState: GroupedBusinessName) {
    this.currentState = this.initialState;
  }

  allChanges(taskData?: TaskData): BusinessNameChanges {
    this.taskData = taskData;

    if (this.currentState.deleted) {
      return this.toBrandChanges(
        [],
        [],
        this.initialState.brands.map(brand => brand.brandId)
      );
    }

    return this.determineBrandChanges();
  }

  private optimizeChanges(changes: BusinessNameChanges): any {
    let updates = changes.updates;

    if (changes.creates.length > 0) {
      const createBrandIds = changes.creates.map((value: FlatBusinessName) => value.brandId);

      updates = changes.updates.filter(
        (value: FlatBusinessName) => !createBrandIds.includes(value.brandId)
      );
    }

    return {
      creates: changes.creates,
      updates: updates,
      deletes: changes.deletes
    };
  }

  private determineBrandChanges(): BusinessNameChanges {
    const brandIdDiff = diff(
      this.initialState.brands.map(brand => brand.brandId),
      this.currentState.brands.map(brand => brand.brandId)
    );
    const brandIdChanges = this.toBrandChanges(brandIdDiff.added, [], brandIdDiff.removed);
    const businessNameChanges = this.determineBusinessNameChanges(brandIdDiff);
    const businessNameTranslationChanges = this.determineBusinessNameTranslationChanges();

    return this.optimizeChanges({
      creates: [...brandIdChanges.creates, ...businessNameChanges.creates],
      updates: [...businessNameTranslationChanges.updates],
      deletes: [...brandIdChanges.deletes, ...businessNameChanges.deletes]
    });
  }

  private determineBusinessNameChanges(brandDiff: any): BusinessNameChanges {
    if (this.initialState.name === this.currentState.name) {
      return EMPTY_CHANGES;
    }

    return this.toBrandChanges(brandDiff.intersection, [], brandDiff.intersection);
  }

  private determineBusinessNameTranslationChanges(): BusinessNameChanges {
    if (isEqual(this.initialState.translations, this.currentState.translations)) {
      return EMPTY_CHANGES;
    }

    const translationDiff = diff(this.initialState.translations, this.currentState.translations);

    return this.toBrandChanges(
      [],
      translationDiff !== undefined ? this.currentState.brands.map(brand => brand.brandId) : [],
      []
    );
  }

  private toBrandChanges(
    addedBrandIds: string[],
    changedBrandIds: string[],
    removedBrandIds: string[]
  ): BusinessNameChanges {
    return {
      creates: addedBrandIds.map(brandId => this.toFlatBusinessName(this.currentState, brandId)),
      updates: changedBrandIds.map(brandId => this.toFlatBusinessName(this.currentState, brandId)),
      deletes: removedBrandIds.map(brandId => this.toFlatBusinessName(this.currentState, brandId))
    };
  }

  private toFlatBusinessName(state: GroupedBusinessName, brandId: string): FlatBusinessName {
    const translations = this.emptyTranslationFilter(state.translations);

    return {
      businessName: state.name,
      taskData: this.taskData,
      brandId: brandId,
      translations: translations.length > 0 ? translations : undefined
    };
  }

  private emptyTranslationFilter(translations?: any): any[] {
    if (translations === undefined) {
      return [];
    }

    return translations.filter((translation: any) => translation.name !== '');
  }
}

export interface BusinessNameChanges {
  readonly creates: FlatBusinessName[];
  readonly updates: FlatBusinessName[];
  readonly deletes: FlatBusinessName[];
}
