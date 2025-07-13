import { fakeAsync, TestBed } from '@angular/core/testing';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ProgressBarService } from './progress-bar.service';

describe('ProgressBarService', () => {
  let service: ProgressBarService;
  let loader: Spy<LoadingBarService>;

  beforeEach(() => {
    loader = createSpyFromClass(LoadingBarService, {
      observablePropsToSpyOn: ['value$']
    });
    TestBed.configureTestingModule({
      providers: [ProgressBarService,
        {
          provide: LoadingBarService,
          useValue: loader
        }
      ]
    });

    service = TestBed.inject(ProgressBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should invoke subscribe function when start', fakeAsync(() => {
    jest.spyOn(service, 'subscribe');

    service.start();
    expect(service.subscribe).toHaveBeenCalled();
  }));

  it('should subscribe to LoadingBarService when subscribe', fakeAsync(() => {
    jest.spyOn(loader.value$, 'subscribe');
    service.subscribe();
    expect(loader.value$.subscribe).toHaveBeenCalledWith(service.progressChanges);
  }));

});
