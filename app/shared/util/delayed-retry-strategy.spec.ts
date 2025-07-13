import { of } from 'rxjs';
import { retryWhen, switchMap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

import {delayedRetryStrategy} from './delayed-retry-strategy';
import createSpy = jasmine.createSpy;


const createRetryableStream = (...resp: any[]): any => {
  const send = createSpy('send');
  send.and.returnValues(...resp);

  return of(undefined).pipe(switchMap(() => send()));
};

describe('delayedRetryStrategy', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should fail after the 4th attempt', () => {
    scheduler.run(({ expectObservable, cold }) => {
      const source = createRetryableStream(
        cold('-#'),
        cold('-#'),
        cold('-#'),
        cold('-#'),
        cold('-#')
      ).pipe(
        retryWhen(
          delayedRetryStrategy({
            scalingDuration: 100
          })
        )
      );

      expectObservable(source).toBe('604ms #');
    });
  });

  it('should fail 2 times and succeed on the 3rd', () => {
    scheduler.run(({ expectObservable, cold }) => {
      const source = createRetryableStream(
        cold('-#'),
        cold('-#'),
        cold('-a', { a: 'Success' })
      ).pipe(
        retryWhen(
          delayedRetryStrategy({
            scalingDuration: 100
          })
        )
      );

      expectObservable(source).toBe('303ms a', { a: 'Success' });
    });
  });

  it('should succeed', () => {
    scheduler.run(({ expectObservable, cold }) => {
      const source = createRetryableStream(cold('-a', { a: 'Success' })).pipe(
        retryWhen(
          delayedRetryStrategy({
            scalingDuration: 100
          })
        )
      );

      expectObservable(source).toBe('-a', { a: 'Success' });
    });
  });
});
