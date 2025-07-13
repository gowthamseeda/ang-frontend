import { TestBed } from '@angular/core/testing';

import { TestingModule } from '../../../testing/testing.module';
import { AppStateService } from './app-state-service';

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AppStateService]
    });

    service = TestBed.inject(AppStateService);
    service.save('key', 'value');
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('save', () => {
    it('should save value', () => {
      service.save('key2', 'value2');

      expect(service.get('key2')).toBe('value2');
    });

    it('should overwrite value', () => {
      service.save('key', 'new value');
      expect(service.get('key')).toBe('new value');
    });
  });

  describe('get', () => {
    it('should get value', () => {
      expect(service.get('key')).toBe('value');
    });

    it('should return undefined for non-existant key', () => {
      expect(service.get('non-existant')).toBeUndefined();
    });

    it('should return value with default', () => {
      expect(service.get('non-existant', 'default')).toBe('default');
    });
  });
});
