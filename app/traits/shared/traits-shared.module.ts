import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ServicesSharedModule } from '../../services/shared/services-shared.module';
import { SharedModule } from '../../shared/shared.module';

import { BrandCodeComponent } from './brand-code/brand-code.component';

@NgModule({
  declarations: [BrandCodeComponent],
  imports: [CommonModule, SharedModule, ServicesSharedModule],
  exports: [BrandCodeComponent]
})
export class TraitsSharedModule {}
