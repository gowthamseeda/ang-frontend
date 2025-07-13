import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';
import { NgxPermissionsModule } from 'ngx-permissions';

import { MaterialModule } from '../material/material.module';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ContentLoaderComponent } from './content-loader/content-loader.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { DefaultEditActionsComponent } from './default-edit-actions/default-edit-actions.component';
import { DowntimeNotificationComponent } from './downtime-notification/downtime-notification.component';
import { EsHighlightComponent } from './es-highlight/es-highlight.component';
import { ExpandableTableComponent } from './expandable-table/expandable-table.component';
import { GridLoaderComponent } from './grid-loader/grid-loader.component';
import { HeaderImageComponent } from './header-image/header-image.component';
import { IconComponent } from './icon/icon.component';
import { LanguageSelectionComponent } from './language-selection/language-selection.component';
import { LeaveComponent } from './leave-component/leave-component.component';
import { LinkOutButtonComponent } from './link-out-button/link-out-button.component';
import { LinkOutToOutletComponent } from './link-out-to-outlet/link-out-to-outlet.component';
import { MessageComponent } from './message/message.component';
import { BrandCodeSyncMessageComponent } from './outlet-error-notification/brand-code-sync-message/brand-code-sync-message.component';
import { DistributionLevelMessageComponent } from './outlet-error-notification/distribution-level-message/distribution-level-message.component';
import { DuplicateKeysMessageComponent } from './outlet-error-notification/duplicate-keys-message/duplicate-keys-message.component';
import { OutletErrorNotificationComponent } from './outlet-error-notification/outlet-error-notification.component';
import { OutletMenuComponent } from './outlet-menu/outlet-menu.component';
import { PopupComponent } from './popup/popup.component';
import { ServicesChipComponent } from './services-chip/services-chip.component';
import { SpeechBubbleComponent } from './speech-bubble/speech-bubble.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { TileComponent } from './tile/tile.component';
import { TaskCommentComponent } from "./task-comment/task-comment.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatInputModule,
    TranslateModule,
    NgScrollbarModule,
    NgScrollbarReachedModule,
    OverlayModule,
    NgxPermissionsModule,
    ReactiveFormsModule,
    ContentLoaderModule
  ],
  declarations: [
    EsHighlightComponent,
    AutocompleteComponent,
    ConfirmDialogComponent,
    MessageComponent,
    IconComponent,
    GridLoaderComponent,
    TileComponent,
    LinkOutButtonComponent,
    ContentLoaderComponent,
    LeaveComponent,
    SpeechBubbleComponent,
    OutletErrorNotificationComponent,
    BrandCodeSyncMessageComponent,
    DistributionLevelMessageComponent,
    DuplicateKeysMessageComponent,
    ContextMenuComponent,
    DowntimeNotificationComponent,
    ServicesChipComponent,
    DefaultEditActionsComponent,
    OutletMenuComponent,
    LinkOutToOutletComponent,
    HeaderImageComponent,
    ExpandableTableComponent,
    PopupComponent,
    TextAreaComponent,
    LanguageSelectionComponent,
    TaskCommentComponent
  ],
  exports: [
    EsHighlightComponent,
    AutocompleteComponent,
    ConfirmDialogComponent,
    MessageComponent,
    IconComponent,
    GridLoaderComponent,
    TileComponent,
    LinkOutButtonComponent,
    ContentLoaderComponent,
    LeaveComponent,
    SpeechBubbleComponent,
    OutletErrorNotificationComponent,
    BrandCodeSyncMessageComponent,
    DistributionLevelMessageComponent,
    DuplicateKeysMessageComponent,
    ServicesChipComponent,
    DefaultEditActionsComponent,
    ContextMenuComponent,
    DowntimeNotificationComponent,
    OutletMenuComponent,
    LinkOutToOutletComponent,
    HeaderImageComponent,
    ExpandableTableComponent,
    PopupComponent,
    TextAreaComponent,
    LanguageSelectionComponent
  ]
})
// compodoc won't add the module to the dependency graph if the module name contains 'components'
export class CompModule {}
