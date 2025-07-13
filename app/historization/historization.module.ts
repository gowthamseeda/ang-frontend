import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SharedModule } from '../shared/shared.module';
import { OutletHistoryComponent } from './container/outlet-history/outlet-history.component';
import { DataClusterSnapshotComponent } from './presentational/data-cluster-snapshot/data-cluster-snapshot.component';
import { HistorizationTimelineComponent } from './presentational/historization-timeline/historization-timeline.component';
import { HistorySnapshotComponent } from './presentational/history-snapshot/history-snapshot.component';
import { SnapshotBusinessNamesComponent } from './presentational/snapshot-business-names/snapshot-business-names.component';
import { SnapshotLegalFooterTranslationsComponent } from './presentational/snapshot-legal-footer-translations/snapshot-legal-footer-translations.component';
import { SnapshotOfferedServicesComponent } from './presentational/snapshot-offered-services/snapshot-offered-services.component';
import { SnapshotPredecessorsComponent } from './presentational/snapshot-predecessors/snapshot-predecessors.component';

import { ServicesSharedModule } from '../services/shared/services-shared.module';
import { DetailOfferedServiceComponent } from './presentational/detail-offered-service/detail-offered-service.component';
import { DetailSnapshotMasterDataComponent } from './presentational/detail-snapshot-master-data/detail-snapshot-master-data.component';
import { HistorizationExpandCollapseNodeToggleComponent } from './presentational/historization-expand-collapse-node-toggle/historization-expand-collapse-node-toggle.component';
import { HistorizationHideAdditionalTranslationsToggleComponent } from './presentational/historization-hide-additional-translations/historization-hide-additional-translations-toggle.component';
import { HistorizationHideEditorToggleComponent } from './presentational/historization-hide-editor-toggle/historization-hide-editor-toggle.component';
import { HistorizationShowChangeOnlyToggleComponent } from './presentational/historization-show-change-only-toggle/historization-show-change-only-toggle.component';
import { HistorizationToggleComponent } from './presentational/historization-toggle/historization-toggle.component';
import { SnapshotAdditionalTranslationsComponent } from './presentational/snapshot-additional-translations/snapshot-additional-translations.component';
import { SnapshotAssignedKeysBrandCodesComponent } from './presentational/snapshot-assigned-keys-brand-codes/snapshot-assigned-keys-brand-codes.component';
import { SnapshotAssignedKeysExternalKeysComponent } from './presentational/snapshot-assigned-keys-external-keys/snapshot-assigned-keys-external-keys.component';
import { SnapshotAssignedLabelsComponent } from './presentational/snapshot-assigned-labels/snapshot-assigned-labels.component';
import { SnapshotGeneralCommunicationsComponent } from './presentational/snapshot-general-communications/snapshot-general-communications.component';
import { SnapshotLegalContractStatusComponent } from './presentational/snapshot-legal-contract-status/snapshot-legal-contract-status.component';
import { SnapshotOutletRelationshipComponent } from './presentational/snapshot-outlet-relationship/snapshot-outlet-relationship.component';
import { HistorizationService } from './service/historization.service';
import {
  HistorizationHideExtraInformationToggleComponent
} from './presentational/historization-hide-extra-information/historization-hide-extra-information-toggle.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    HeaderModule,
    MatTreeModule,
    MatIconModule,
    ServicesSharedModule
  ],
  declarations: [
    OutletHistoryComponent,
    HistorizationTimelineComponent,
    HistorySnapshotComponent,
    HistorizationToggleComponent,
    HistorizationHideEditorToggleComponent,
    HistorizationHideAdditionalTranslationsToggleComponent,
    HistorizationShowChangeOnlyToggleComponent,
    HistorizationHideExtraInformationToggleComponent,
    DataClusterSnapshotComponent,
    SnapshotBusinessNamesComponent,
    SnapshotPredecessorsComponent,
    SnapshotLegalFooterTranslationsComponent,
    SnapshotAdditionalTranslationsComponent,
    SnapshotOfferedServicesComponent,
    SnapshotAssignedKeysBrandCodesComponent,
    SnapshotAssignedKeysExternalKeysComponent,
    SnapshotAssignedLabelsComponent,
    SnapshotGeneralCommunicationsComponent,
    HistorizationExpandCollapseNodeToggleComponent,
    SnapshotLegalContractStatusComponent,
    SnapshotOutletRelationshipComponent,
    DetailOfferedServiceComponent,
    DetailSnapshotMasterDataComponent
  ],
  providers: [HistorizationService],
  exports: []
})
export class HistorizationModule {}
