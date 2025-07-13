import { TestBed } from '@angular/core/testing';

import { ActiveLanguageService } from './active-language.service';

describe('ActiveLanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveLanguageService]
    });
  });

  it('should be created', () => {
    const service: ActiveLanguageService = TestBed.inject(ActiveLanguageService);
    expect(service).toBeTruthy();
  });
});
