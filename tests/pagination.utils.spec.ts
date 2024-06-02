import { mergeDeep } from '../lib/common';
import { PaginationOptions } from '../lib';

// Test cases
describe('mergeDeep', () => {
  test('should merge shallow properties correctly', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = mergeDeep(target, source);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  test('should not overwrite properties that are defined with null or undefined', () => {
    const target = { a: 1, b: 2 };
    const source = { b: null, c: 4 };
    const result = mergeDeep(target, source);
    expect(result).toEqual({ a: 1, b: 2, c: 4 });
  });

  test('should deeply merge nested objects', () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };
    const result = mergeDeep(target, source);
    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  test('should handle multiple sources correctly', () => {
    const target = { a: 1 };
    const source1 = { b: 2 };
    const source2 = { c: 3 };
    const result = mergeDeep(target, source1, source2);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('should work with default options in PaginationOptions', () => {
    const defaultOptions: PaginationOptions = {
      path: null,
      withDetails: true,
      limit: 50,
      page: 1,
    };

    const userOptions: Partial<PaginationOptions> = {
      path: '/home',
      limit: 10,
      page: undefined,
    };

    const result = mergeDeep(defaultOptions, userOptions);
    expect(result).toEqual({
      path: '/home',
      withDetails: true,
      limit: 10,
      page: 1,
    });
  });
});
