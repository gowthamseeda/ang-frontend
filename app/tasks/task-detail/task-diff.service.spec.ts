import { TestBed } from '@angular/core/testing';

import { TaskDiffService } from './task-diff.service';

describe('TaskDiffService', () => {
  let service: TaskDiffService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskDiffService]
    });
    service = TestBed.inject(TaskDiffService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('highlighted()', () => {
    it('should return true if key exists in diffData', () => {
      const key = 'street';
      const mockDiff = {
        street: '12',
        city: 'Berlin'
      };
      const result = service.highlighted(key, mockDiff);
      expect(result).toBeTruthy();
    });
    it('should return false if key not in diffData', () => {
      const key = 'street';
      const mockDiff = {
        name: '12',
        city: 'Berlin'
      };
      const result = service.highlighted(key, mockDiff);
      expect(result).toBeFalsy();
    });
  });

  describe('diff()', () => {
    it('should return a Object with Items that are changed', () => {
      const taskOld = {
        Business1: ['FUSO', 'FTL'],
        Business2: ['MB', 'SMT']
      };
      const taskNew = {
        Business1: ['FUSO', 'MCD'],
        Business2: ['MB', 'SMT']
      };
      const expectedDiff = {
        Business1: ['FUSO', 'MCD']
      };

      const result = service.diff(taskOld, taskNew);
      expect(result).toMatchObject(expectedDiff);
    });
  });

  describe('removedDiff()', () => {
    it('should return all removed Items', () => {
      const taskOld = {
        Business1: ['FUSO', 'FTL'],
        Business2: ['MB', 'SMT']
      };
      const taskNew = {
        Business1: ['FUSO', 'MCD']
      };
      const expectedDiff = {
        Business2: ['MB', 'SMT']
      };

      const result = service.removedDiff(taskOld, taskNew);
      expect(result).toMatchObject(expectedDiff);
    });
  });
});
