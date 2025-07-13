import { Pipe, PipeTransform } from '@angular/core';

import { Translatable } from './translatable.model';
import { TranslateOutputType } from './translate-output-type.model';

@Pipe({
  name: 'translateData'
})
export class TranslateDataPipe implements PipeTransform {
  transform(data: Translatable, languageId: string | undefined, postfixId: boolean = false, type: TranslateOutputType = TranslateOutputType.name): string {
    languageId = languageId ?? '';
    const postfix = postfixId && data.id ? ` (${data.id})` : '';

    if(type == TranslateOutputType.name) {
      if (data.translations && data.translations[languageId] && data.translations[languageId].serviceName) {
        return `${data.translations[languageId].serviceName}${postfix}`;
      } else if(data.translations && data.translations[languageId]) {
        return `${data.translations[languageId]}${postfix}`;
      }
    } else if(type = TranslateOutputType.description) {
      if (data.translations && data.translations[languageId] && data.translations[languageId].serviceDescription) {
        return `${data.translations[languageId].serviceDescription}${postfix}`;
      }

      return data.description ? `${data.description}${postfix}` : ``;
    }

    return `${data.name}${postfix}`;
  }
}
