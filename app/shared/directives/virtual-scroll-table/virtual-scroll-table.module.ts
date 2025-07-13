import { NgModule } from '@angular/core';

import { VirtualScrollTableSettingDirective } from './virtual-scroll-table-setting.directive';
import { VirtualTableDirective } from './virtual-table.directive';

@NgModule({
  declarations: [VirtualTableDirective, VirtualScrollTableSettingDirective],
  exports: [VirtualTableDirective, VirtualScrollTableSettingDirective]
})
export class VirtualScrollTableModule {}
