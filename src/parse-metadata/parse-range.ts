/**
 * Parse a numeric range string into an array of line numbers.
 *
 * Supports:
 * - Single numbers: "1" → [1]
 * - Comma-separated: "1,3,5" → [1, 3, 5]
 * - Ranges with dash: "1-5" → [1, 2, 3, 4, 5]
 * - Ranges with dots: "1..5" → [1, 2, 3, 4, 5]
 * - Mixed: "1,3-5,7" → [1, 3, 4, 5, 7]
 *
 * Only positive integers are supported (line numbers).
 *
 * @param input - The range string to parse
 * @returns Array of positive line numbers
 * @internal
 */
export function parseRange(input: string): number[] {
  const result: number[] = [];

  for (const part of input.split(",")) {
    const str = part.trim();
    if (!str) continue;

    // Single number
    if (/^\d+$/.test(str)) {
      const num = parseInt(str, 10);
      if (num > 0) result.push(num);
      continue;
    }

    // Range: 1-5 or 1..5
    const match = str.match(/^(\d+)(-|\.\.)(\d+)$/);
    if (match) {
      const [, lhsStr, , rhsStr] = match;
      const lhs = parseInt(lhsStr, 10);
      const rhs = parseInt(rhsStr, 10);

      if (lhs > 0 && rhs > 0) {
        const start = Math.min(lhs, rhs);
        const end = Math.max(lhs, rhs);
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
      }
    }
  }

  return result;
}
