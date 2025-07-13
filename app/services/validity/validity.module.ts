import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderModule } from '../../main/header/header.module';
import { LayoutModule } from '../../main/layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { StructuresModule } from '../../structures/structures.modules';
import { ServicesSharedModule } from '../shared/services-shared.module';
import { ValidityConfirmationComponent } from './presentational/validity-confirmation/validity-confirmation.component';
import { ValidityMultiEditTableComponent } from './containers/validity-multi-edit-table/validity-multi-edit-table.component';
import { ValidityMultiEditComponent } from './containers/validity-multi-edit/validity-multi-edit.component';

import { ValidityTableComponent } from './containers/validity-table/validity-table.component';
import { ValidityComponent } from './containers/validity/validity.component';
import { ValidityMultiEditTableLayoutComponent } from './presentational/validity-multi-edit-table-layout/validity-multi-edit-table-layout.component';
import { ValidityTableLayoutComponent } from './presentational/validity-table-layout/validity-table-layout.component';
import { ValidityTableService } from './services/validity-table.service';
import { ValidityRoutingModule } from './validity-routing.module';

@NgModule({
  imports: [
    ValidityRoutingModule,
    CommonModule,
    LayoutModule,
    SharedModule,
    ServicesSharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    HeaderModule,
    StructuresModule
  ],
  declarations: [
    ValidityComponent,
    ValidityMultiEditComponent,
    ValidityTableComponent,
    ValidityMultiEditTableComponent,
    ValidityTableLayoutComponent,
    ValidityConfirmationComponent,
    ValidityMultiEditTableLayoutComponent
  ],
  providers: [ValidityTableService]
})
export class ValidityModule {}
