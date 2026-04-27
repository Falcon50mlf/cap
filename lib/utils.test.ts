import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn (class merge helper)', () => {
  it('joins simple class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy entries', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('merges conflicting tailwind utilities (last wins)', () => {
    // px-2 should be overridden by px-4
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('preserves non-conflicting utilities', () => {
    const out = cn('rounded', 'bg-night', 'text-snow');
    expect(out).toContain('rounded');
    expect(out).toContain('bg-night');
    expect(out).toContain('text-snow');
  });

  it('flattens arrays of class names', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });
});
