import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StructuresModule } from 'app/structures/structures.modules';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { ServicesSharedModule } from '../services/shared/services-shared.module';
import { MaterialModule } from '../shared/material/material.module';
import { SharedModule } from '../shared/shared.module';

import { BrandSelectionComponent } from './brand/brand-selection/brand-selection.component';
import { BusinessNameTableComponent } from './business-names/business-name-table/business-name-table.component';
import { BusinessNamesService } from './business-names/business-names.service';
import { ContractStatusApiService } from './contract-status/contract-status-api.service';
import { DistributionLevelSelectDialogComponent } from './distribution-levels/distribution-level-selection/distribution-level-select-dialog/distribution-level-select-dialog.component';
import { DistributionLevelSelectionComponent } from './distribution-levels/distribution-level-selection/distribution-level-selection.component';
import { ExternalKeyService } from './external-key/external-key.service';
import { AdamIdService } from './keys/adam-id/adam-id.service';
import { AliasService } from './keys/alias/alias.service';
import { EditKeysComponent } from './keys/edit-keys/edit-keys.component';
import { ExternalKeyTypeSelectionComponent } from './keys/external-key-type-selection/external-key-type-selection.component';
import { ExternalKeyTypeService } from './keys/external-key-type-selection/external-key-type.service';
import { FederalIdService } from './keys/federal-id/federal-id.service';
import { KeyTableComponent } from './keys/key-table/key-table.component';
import { KeyTypeSelectionComponent } from './keys/key-type-selection/key-type-selection.component';
import { KeysTileComponent } from './keys/keys-tile/keys-tile.component';
import { KeysService } from './keys/keys.service';
import { AssignedBrandLabelTableComponent } from './label/assigned-brand-labels/assigned-brand-label-table/assigned-brand-label-table.component';
import { LabelsTileComponent } from './label/assigned-brand-labels/assigned-brand-label-tile/labels-tile.component';
import { AssignedBrandLabelsService } from './label/assigned-brand-labels/assigned-brand-labels.service';
import { EditLabelsComponent } from './label/edit-labels/edit-labels.component';
import { LabelSelectionComponent } from './label/label-selection/label-selection.component';
import { LabelService } from './label/label.service';
import { ProductGroupSelectionComponent } from './product-group/product-group-selection/product-group-selection.component';
import { TraitsSharedModule } from './shared/traits-shared.module';
import { MasterKeyService } from "../master/services/master-key/master-key.service";
import {SingleBrandSelectionComponent} from "./brand/single-brand-selection/single-brand-selection.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LayoutModule,
        MaterialModule,
        StructuresModule,
        HeaderModule,
        TraitsSharedModule,
        ServicesSharedModule
    ],
    declarations: [
        KeyTypeSelectionComponent,
        KeyTableComponent,
        BusinessNameTableComponent,
        AssignedBrandLabelTableComponent,
        LabelSelectionComponent,
        LabelsTileComponent,
        KeysTileComponent,
        EditKeysComponent,
        EditLabelsComponent,
        DistributionLevelSelectionComponent,
        DistributionLevelSelectDialogComponent,
        ExternalKeyTypeSelectionComponent,
        BrandSelectionComponent,
        ProductGroupSelectionComponent,
        SingleBrandSelectionComponent
    ],
    providers: [
        KeysService,
        BusinessNamesService,
        AdamIdService,
        LabelService,
        AssignedBrandLabelsService,
        AliasService,
        FederalIdService,
        ExternalKeyTypeService,
        ExternalKeyService,
        ContractStatusApiService,
        MasterKeyService
    ],
    exports: [
        BusinessNameTableComponent,
        KeyTableComponent,
        AssignedBrandLabelTableComponent,
        LabelSelectionComponent,
        LabelsTileComponent,
        EditKeysComponent,
        EditLabelsComponent,
        KeysTileComponent,
        DistributionLevelSelectionComponent,
        DistributionLevelSelectDialogComponent,
        KeyTypeSelectionComponent,
        SingleBrandSelectionComponent,
        ProductGroupSelectionComponent
    ]
})
export class TraitsModule {}
