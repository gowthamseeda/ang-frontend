import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SharedModule } from '../shared/shared.module';

import { IamRoutingModule } from './iam-routing.module';
import { UserDataRestrictionMapperService } from './shared/services/user-data-restriction-mapper/user-data-restriction-mapper.service';
import { BusinessSiteSelectDialogComponent } from './user-data-restrictions/data-restriction-assigner/business-site-select-dialog/business-site-select-dialog.component';
import { DataRestrictionAssignerComponent } from './user-data-restrictions/data-restriction-assigner/data-restriction-assigner.component';
import { SelectDialogComponent } from './user-data-restrictions/data-restriction-assigner/select-dialog/select-dialog.component';
import { HistoryDetailComponent } from './user-data-restrictions/history/history-detail/history-detail.component';
import { HistoryComponent } from './user-data-restrictions/history/history.component';
import { SettingComponent } from './user-data-restrictions/setting/setting.component';
import { UserDataRestrictionsComponent } from './user-data-restrictions/user-data-restrictions.component';
import { IAMManagementComponent } from './iam-management/iam-management.component';

@NgModule({
    imports: [SharedModule, LayoutModule, IamRoutingModule, MatDatepickerModule, HeaderModule],
    declarations: [
        UserDataRestrictionsComponent,
        DataRestrictionAssignerComponent,
        SelectDialogComponent,
        BusinessSiteSelectDialogComponent,
        HistoryComponent,
        HistoryDetailComponent,
        SettingComponent,
        IAMManagementComponent
    ],
    providers: [UserDataRestrictionMapperService]
})
export class IamModule {}
