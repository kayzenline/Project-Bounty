import {
  difference,
  chunk,
  omit,
  capitalizeWords,
} from './assorted';

describe('difference', () => {
  test('returns empty if all overlap', () => {
    expect(difference([1, 2, 3], [1, 2, 3])).toEqual([]);
  });

  test('returns elements if some overlap', () => {
    expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
  });

  test('returns first array if no common elements', () => {
    expect(difference([1, 2], [3, 4])).toEqual([1, 2]);
  });

  test('works with empty arrays', () => {
    expect(difference([], [1, 2])).toEqual([]);
    expect(difference([], [])).toEqual([]);
  });
});

describe('chunk', () => {
  test('splits array into chunks of given size', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('returns empty array for empty input', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  test('handles chunk size larger than array', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
  });

  test('handles chunk size of 1', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });
});

describe('omit', () => {
  test('removes specified keys from object', () => {
    expect(omit({a:1, b:2, c:3}, ['b', 'c'])).toEqual({a:1});
  });

  test('returns same object if no keys match', () => {
    expect(omit({a:1}, ['x'])).toEqual({a:1});
  });

  test('works with empty object', () => {
    expect(omit({}, ['a'])).toEqual({});
  });
});

describe('capitalizeWords', () => {
  test('capitalizes single word', () => {
    expect(capitalizeWords('hello')).toBe('Hello');
  });

  test('capitalizes multiple words', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
    expect(capitalizeWords('a quick brown fox')).toBe('A Quick Brown Fox');
  });

  test('handles empty string', () => {
    expect(capitalizeWords('')).toBe('');
  });

  test('preserves capitalization of existing letters', () => {
    expect(capitalizeWords('javaScript is fun')).toBe('JavaScript Is Fun');
  });
});
