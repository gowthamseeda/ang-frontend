import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { BrandComponent } from './components/brand-icon/brand.component';
import { BrandProductGroupsDataTableComponent } from './components/brand-product-groups-data-table/brand-product-groups-data-table.component';
import { BrandProductGroupsMultiEditDataTableComponent } from './components/brand-product-groups-multi-edit-data-table/brand-product-groups-multi-edit-data-table.component';
import { ProductGroupComponent } from './components/product-group/product-group.component';
import { SharedModule } from '../../shared/shared.module';
import { SelectOutletsDialogComponent } from './components/select-outlets-dialog/select-outlets-dialog.component';
import { OutletOptionComponent } from './components/select-outlets-dialog/outlet-option/outlet-option.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ProductGroupComponent, BrandProductGroupsDataTableComponent, BrandProductGroupsMultiEditDataTableComponent, BrandComponent, SelectOutletsDialogComponent, OutletOptionComponent],
  exports: [ProductGroupComponent, BrandProductGroupsDataTableComponent, BrandProductGroupsMultiEditDataTableComponent, BrandComponent]
})
export class ServicesSharedModule {}
