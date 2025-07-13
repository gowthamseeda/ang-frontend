import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UserSettingsService } from '../user-settings/user-settings/services/user-settings.service';

import { LanguageService } from './language/language.service';
import { SwitchLanguageComponent } from './language/switch-language/switch-language.component';
import { LinkOutTproComponent } from './link-out-tpro/link-out-tpro.component';

@NgModule({
  imports: [SharedModule],
  exports: [SwitchLanguageComponent, LinkOutTproComponent],
  declarations: [SwitchLanguageComponent, LinkOutTproComponent]
})
export class TproModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [LanguageService, UserSettingsService]
    };
  }
}
