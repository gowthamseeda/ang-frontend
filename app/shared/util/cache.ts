import { ReplaySubject } from 'rxjs';

import { ApiService } from '../services/api/api.service';

export class Cache<T> {
  private cache = new Map<string, ReplaySubject<T>>();

  constructor(private apiService: ApiService, private urlBuilder: (key: string) => string) {}

  getOrLoad(key: string): ReplaySubject<T> {
    return this.cache.get(key) ?? this.load(key);
  }

  clearFor(key: string): void {
    this.cache.delete(key);
  }

  private load(key: string): ReplaySubject<T> {
    const cachedValue = new ReplaySubject<T>(1);
    this.cache.set(key, cachedValue);

    this.apiService.get<T>(this.urlBuilder(key)).subscribe(
      resource => cachedValue.next(resource),
      error => cachedValue.error(error),
      () => cachedValue.complete()
    );

    return cachedValue;
  }
}
