import * as fc from 'fast-check';

describe('Setup Verification Tests', () => {
  test('Jest is configured correctly', () => {
    expect(true).toBe(true);
  });

  test('fast-check is configured correctly', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n === n;
      }),
      { numRuns: 100 }
    );
  });

  test('TypeScript compilation works', () => {
    const testObject: { name: string; value: number } = {
      name: 'test',
      value: 42
    };
    expect(testObject.name).toBe('test');
    expect(testObject.value).toBe(42);
  });
});
