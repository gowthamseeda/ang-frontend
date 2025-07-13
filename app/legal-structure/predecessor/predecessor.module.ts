import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SearchModule } from '../../search/search.module';
import { SharedModule } from '../../shared/shared.module';
import { TraitsSharedModule } from '../../traits/shared/traits-shared.module';

import { PredecessorContainerComponent } from './predecessor-container/predecessor-container.component';
import { PredecessorDialogComponent } from './predecessor-container/predecessor-dialog/predecessor-dialog.component';
import { PredecessorsTableComponent } from './predecessor-container/predecessors-table/predecessors-table.component';
import { PredecessorService } from './predecessor/predecessor.service';
import { PredecessorCollectionService } from './predecessor/store/predecessor-collection.service';
import { PredecessorDataService } from './predecessor/store/predecessor-data.service';
import { predecessorEntityMetadata } from './predecessor/store/predecessor-entity-metadata';

@NgModule({
  declarations: [
    PredecessorContainerComponent,
    PredecessorDialogComponent,
    PredecessorsTableComponent
  ],
  imports: [CommonModule, SearchModule, SharedModule, LayoutModule, TraitsSharedModule],
  providers: [PredecessorCollectionService, PredecessorDataService, PredecessorService],
  exports: [PredecessorContainerComponent]
})
export class PredecessorModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    predecessorDataService: PredecessorDataService
  ) {
    entityDefinitionService.registerMetadataMap(predecessorEntityMetadata);
    entityDataService.registerService('Predecessor', predecessorDataService);
  }
}
