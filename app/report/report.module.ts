import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { PowerBiComponent } from './power-bi/power-bi.component';
import { PowerBiService } from './power-bi/service/power-bi.service';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  declarations: [PowerBiComponent],
  imports: [CommonModule, HeaderModule, LayoutModule, ReportRoutingModule, PowerBIEmbedModule],
  providers: [PowerBiService]
})
export class ReportModule {}
