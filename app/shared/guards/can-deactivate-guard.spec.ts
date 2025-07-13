import { inject, TestBed } from '@angular/core/testing';
import { CanDeactivateGuard } from './can-deactivate-guard.model';
import { TranslateService } from '@ngx-translate/core';
import { Spy, createSpyFromClass } from 'jest-auto-spies';

describe('CanDeactivateGuard', () => {
  let translateServiceSpy: Spy<TranslateService>;

  beforeEach(() => {
    translateServiceSpy = createSpyFromClass(TranslateService);

    TestBed.configureTestingModule({
      providers: [CanDeactivateGuard, { provide: TranslateService, useValue: translateServiceSpy }]
    });
  });

  it('should be truthy', inject([CanDeactivateGuard], (guard: CanDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
