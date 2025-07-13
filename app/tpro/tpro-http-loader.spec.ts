import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TproHttpLoader } from './tpro-http-loader';

describe('TproHttpLoader', () => {
  const language = 'en';
  const response = {
    translations: {
      KEY: 'translation'
    }
  };
  const expectedResult = response.translations;

  let httpClient: HttpClient;
  let tproHttpLoader: TproHttpLoader;

  describe('getTranslation()', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      httpClient = TestBed.inject(HttpClient);
      tproHttpLoader = new TproHttpLoader(httpClient);
    });

    afterEach(() => {
      expect(httpClient.get).toHaveBeenCalledWith(
        `/tpro/gssnplus/languages/${language}/translations`
      );
    });

    it('should return the translations from the response', done => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(response.translations));
      tproHttpLoader.getTranslation(language).subscribe(result => {
        expect(result).toBe(expectedResult);
        done();
      });
    });

    it('should return the whole response when there are no nested translations', done => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(response));
      tproHttpLoader.getTranslation(language).subscribe(result => {
        expect(result).toBe(expectedResult);
        done();
      });
    });
  });
});
