import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { Predecessor } from '../predecessor.model';

@Injectable()
export class PredecessorCollectionService extends EntityCollectionServiceBase<Predecessor> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Predecessor', serviceElementsFactory);
  }

  select(
    predecessorId: string
  ): MemoizedSelector<
    Object,
    Predecessor | undefined,
    DefaultProjectorFn<Predecessor | undefined>
  > {
    return createSelector(
      this.selectors.selectEntityMap,
      predecessors => predecessors[predecessorId]
    );
  }

  isLoaded(): MemoizedSelector<Object, boolean, DefaultProjectorFn<boolean>> {
    return createSelector(this.selectors.selectEntities, predecessors => predecessors.length > 0);
  }

  isChanged(predecessorId: string): MemoizedSelector<Object, boolean, DefaultProjectorFn<boolean>> {
    return createSelector(
      this.selectors.selectChangeState,
      changeStateMap => changeStateMap[predecessorId]?.changeType?.valueOf() === 3
    );
  }
}
