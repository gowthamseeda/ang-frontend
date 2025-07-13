import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { take } from 'rxjs';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });

    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get',()=>{
    it('should return undefined if current value is undefined', (done) => {
      service.get().pipe(take(1)).subscribe(value => {
        expect(value).toBeUndefined();
        done();
      });

      service.clearCache();
    });

    it('should return value if current value is not undefined', (done) => {
      service.get().pipe(take(1)).subscribe(value => {
        expect(value['testKey']).toBeTruthy();
        done();
      });

      service.add('testKey', true);
    });
  })

  it('should clear the cache', (done) => {
    service.add('testKey', true);

    service.get().pipe(take(1)).subscribe(value => {
      expect(value).toBeUndefined();
      done();
    });

    service.clearCache();
  });
});
