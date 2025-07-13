import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LegalStructureModule } from 'app/legal-structure/legal-structure.module';
import { HeaderModule } from 'app/main/header/header.module';
import { LayoutModule } from 'app/main/layout/layout.module';
import { SearchModule } from 'app/search/search.module';
import { SharedModule } from 'app/shared/shared.module';

import { StructuresModule } from '../structures/structures.modules';

import { CurrencyModule } from './currency/currency.module';
import { CapitalFormComponent } from './investee-container/capital-form/capital-form.component';
import { InvesteeContainerComponent } from './investee-container/investee-container.component';
import { InvestmentTableComponent } from './investee-container/investment-table/investment-table.component';
import { InvestorDialogComponent } from './investee-container/investor-dialog/investor-dialog.component';
import { InvesteeModule } from './investee/investee.module';
import { InvestorsRoutingModule } from './investors-routing.module';

@NgModule({
    imports: [
        InvestorsRoutingModule,
        CommonModule,
        SharedModule,
        LayoutModule,
        LegalStructureModule,
        HeaderModule,
        SearchModule,
        InvesteeModule,
        CurrencyModule,
        StructuresModule
    ],
    declarations: [
        InvesteeContainerComponent,
        CapitalFormComponent,
        InvestmentTableComponent,
        InvestorDialogComponent
    ]
})
export class InvestorsModule {}
