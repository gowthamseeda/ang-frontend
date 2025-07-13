import { fakeAsync, TestBed} from '@angular/core/testing';

import { ContentLoaderService } from './content-loader.service';

describe('ContentLoaderService', () => {
  let service: ContentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentLoaderService]
    });

    service = TestBed.inject(ContentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('start() and stop()', () => {
    it('should make the loader appear', fakeAsync(() => {
      service.start();

      expect(service.visibleChanges.getValue()).toBeTruthy();
    }));

    it('should make the loader stop', fakeAsync(() => {
      service.start();
      service.stop();

      expect(service.visibleChanges.getValue()).toBeFalsy();
    }));
  });
});
