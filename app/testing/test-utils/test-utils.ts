/**
 * Wraps a test function to check a value is not null and returns a null save type
 */
export function nullSafeValue<T>(value: T | null): T {
  expect(value).not.toBeNull();
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  return value!;
}

/**
 * Fixes the Jest Error: Not implemented: navigation (except hash changes)
 * see https://github.com/facebook/jest/issues/890
 */
export function mockBrowserLocationReload(): void {
  window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      reload: jest.fn()
    },
    writable: true
  });
}

export function mockComputedStyleProperty(): void {
  window = Object.create(window);
  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      getPropertyValue: () => {
        return '';
      }
    })
  });
}
