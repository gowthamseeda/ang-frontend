import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export class TproHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  public getTranslation(lang: string): any {
    return this.http
      .get(`${environment.settings.backend}/tpro/gssnplus/languages/${lang}/translations`)
      .pipe(
        map((response: any) => {
          if (response.translations) {
            return response.translations;
          }
          return response;
        })
      );
  }
}
