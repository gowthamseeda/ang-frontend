import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgStringPipesModule } from 'ngx-pipes';

import { EmptyValuePipe } from './empty-value/empty-value.pipe';
import { AdjustFilterPipe } from './filter/adjustFilter';
import { KeysPipe } from './keys/keys.pipe';
import { LocaleDateTimePipe } from './locale-date-time/locale-date-time.pipe';
import { TooltipDefaultPipe } from './tooltip/tooltipdefaults.pipe';
import {TranslateCountryPipe} from './translate-country/translate-country.pipe';
import { TranslateDataPipe } from './translate-data/translate-data.pipe';
import { SnakeCasePipe } from './snakeCase/snake-case.pipe';
import { SafeHtmlPipe } from './safe-html/safe-html.pipe';
@NgModule({
  imports: [CommonModule],
  exports: [
    TooltipDefaultPipe,
    KeysPipe,
    AdjustFilterPipe,
    NgStringPipesModule,
    TranslateDataPipe,
    LocaleDateTimePipe,
    EmptyValuePipe,
    TranslateCountryPipe,
    SnakeCasePipe,
    SafeHtmlPipe
  ],
  declarations: [
    TooltipDefaultPipe,
    KeysPipe,
    AdjustFilterPipe,
    TranslateDataPipe,
    LocaleDateTimePipe,
    EmptyValuePipe,
    TranslateCountryPipe,
    SnakeCasePipe,
    SafeHtmlPipe,
  ]
})
export class PipesModule {}
