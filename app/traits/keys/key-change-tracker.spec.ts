import { KeyChangeTracker } from './key-change-tracker';
import { GroupedKey } from './key.model';
import { KeyType } from './key-type.model';

describe('KeyChangeTracker', () => {
  it('should track created keys', () => {
    const tracker = new KeyChangeTracker(new GroupedKey());
    tracker.currentState = new GroupedKey(KeyType.BRAND_CODE, 'Key', [
      { brandId: 'MB', readonly: false },
      { brandId: 'SMT', readonly: false }
    ]);

    expect(tracker.allChanges().creates).toEqual([
      { type: KeyType.BRAND_CODE, key: 'Key', brandId: 'MB' },
      { type: KeyType.BRAND_CODE, key: 'Key', brandId: 'SMT' }
    ]);
  });

  it('should track deleted keys', () => {
    const tracker = new KeyChangeTracker(
      new GroupedKey(KeyType.BRAND_CODE, 'Key', [
        { brandId: 'MB', readonly: false },
        { brandId: 'SMT', readonly: false }
      ])
    );
    tracker.currentState.deleted = true;

    expect(tracker.allChanges().deletes).toEqual([
      { type: KeyType.BRAND_CODE, key: 'Key', brandId: 'MB' },
      { type: KeyType.BRAND_CODE, key: 'Key', brandId: 'SMT' }
    ]);
  });

  it('should track added brand', () => {
    const tracker = new KeyChangeTracker(
      new GroupedKey(KeyType.BRAND_CODE, 'Key', [{ brandId: 'MB', readonly: false }])
    );
    tracker.currentState = new GroupedKey(KeyType.BRAND_CODE, 'Key', [
      { brandId: 'MB', readonly: false },
      { brandId: 'SMT', readonly: false }
    ]);

    expect(tracker.allChanges().creates).toEqual([
      { type: KeyType.BRAND_CODE, key: 'Key', brandId: 'SMT' }
    ]);
  });

  it('should track removed brand', () => {
    const tracker = new KeyChangeTracker(
      new GroupedKey(KeyType.BRAND_CODE, 'Key', [
        { brandId: 'MB', readonly: false },
        { brandId: 'SMT', readonly: false }
      ])
    );
    tracker.currentState = new GroupedKey(KeyType.BRAND_CODE, 'Key', [
      { brandId: 'MB', readonly: false }
    ]);

    expect(tracker.allChanges().deletes).toEqual([
      { type: KeyType.BRAND_CODE, key: 'Key', brandId: 'SMT' }
    ]);
  });

  it('should track changed keys', () => {
    const tracker = new KeyChangeTracker(
      new GroupedKey(KeyType.BRAND_CODE, 'Key', [{ brandId: 'MB', readonly: false }])
    );
    tracker.currentState = new GroupedKey(KeyType.BRAND_CODE, 'New Key', [
      { brandId: 'MB', readonly: false }
    ]);

    expect(tracker.allChanges().deletes).toEqual([
      { type: KeyType.BRAND_CODE, key: 'Key', brandId: 'MB' }
    ]);

    expect(tracker.allChanges().creates).toEqual([
      { type: KeyType.BRAND_CODE, key: 'New Key', brandId: 'MB' }
    ]);
  });

  it('should track changed keys of brand independent keys', () => {
    const tracker = new KeyChangeTracker(new GroupedKey(KeyType.ALIAS, 'Key'));
    tracker.currentState = new GroupedKey(KeyType.ALIAS, 'New Key');

    expect(tracker.allChanges().deletes).toEqual([]);

    expect(tracker.allChanges().creates).toEqual([{ type: KeyType.ALIAS, key: 'New Key' }]);
  });

  it('should track no changes of brand independent keys', () => {
    const tracker = new KeyChangeTracker(new GroupedKey(KeyType.ALIAS, 'Key'));
    tracker.currentState = new GroupedKey(KeyType.ALIAS, 'Key');

    expect(tracker.allChanges().deletes).toEqual([]);

    expect(tracker.allChanges().creates).toEqual([]);
  });

  it('should track no changes of brand independent keys', () => {
    const tracker = new KeyChangeTracker(new GroupedKey(KeyType.ALIAS, 'Key'));
    tracker.currentState = new GroupedKey(KeyType.ALIAS, 'Key');

    expect(tracker.allChanges().deletes).toEqual([]);

    expect(tracker.allChanges().creates).toEqual([]);
  });

  it('should track deleted brand independent keys', () => {
    const tracker = new KeyChangeTracker(new GroupedKey(KeyType.ALIAS, 'Key'));
    tracker.currentState = new GroupedKey(KeyType.ALIAS, 'New Key');
    tracker.currentState.deleted = true;

    expect(tracker.allChanges().deletes).toEqual([{ type: KeyType.ALIAS, key: 'Key' }]);
  });
});
