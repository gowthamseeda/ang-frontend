import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContentDirective } from './content/content.directive';
import { DisableControlDirective } from './disable-control/disable-control.directive';
import { EnableIfMarkedForHighlightingDirective } from './enable-element-if-marked-for-highlighting/enable-if-marked-for-highlighting.directive';
import { FeatureToggleDirective } from './feature-toggle/feature-toggle.directive';
import { FeatureToggleService } from './feature-toggle/feature-toggle.service';
import { FocusDirective } from './focus/focus.directive';
import { IconButtonWithTextDirective } from './icon-button-with-text/icon-button-with-text.directive';
import { InactiveChipDirective } from './inactive-chip/inactive-chip.directive';
import { LinkButtonDirective } from './link-button/link-button.directive';
import { ScrollToViewDirective } from './scroll-to-view/scroll-to-view.directive';

@NgModule({
  imports: [CommonModule],
  exports: [
    ContentDirective,
    EnableIfMarkedForHighlightingDirective,
    InactiveChipDirective,
    FeatureToggleDirective,
    LinkButtonDirective,
    FocusDirective,
    DisableControlDirective,
    ScrollToViewDirective,
    IconButtonWithTextDirective
  ],
  declarations: [
    ContentDirective,
    EnableIfMarkedForHighlightingDirective,
    InactiveChipDirective,
    FeatureToggleDirective,
    LinkButtonDirective,
    FocusDirective,
    DisableControlDirective,
    ScrollToViewDirective,
    IconButtonWithTextDirective
  ],
  providers: [FeatureToggleService]
})
export class DirectivesModule {}
