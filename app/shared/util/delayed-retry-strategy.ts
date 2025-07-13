import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// Copied from RxJS documentation: https://www.learnrxjs.io/operators/error_handling/retrywhen.html
export const delayedRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 200,
  excludedStatusCodes = []
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;

      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return throwError(error);
      }

      return timer(retryAttempt * scalingDuration);
    })
  );
};
