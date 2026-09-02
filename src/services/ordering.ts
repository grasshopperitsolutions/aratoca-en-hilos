/**
 * Comparators for ordering Firestore results in memory.
 *
 * Queries in this project deliberately never use `orderBy()`. Firestore
 * **silently excludes any document that lacks the field being ordered on**, so
 * a record created by hand in the console — or written before a field
 * existed — simply vanishes from the list with no error at all. That is how an
 * admin can disappear from the list of admins.
 *
 * Sorting here instead also removes the composite indexes that
 * equality-filter + `orderBy` combinations would otherwise require.
 *
 * The tradeoff is that every matching document is fetched. At this site's scale
 * that is irrelevant; if a collection ever outgrows it, the answer is real
 * pagination rather than moving the sort back into the query.
 */

type Sortable = number | string | null | undefined;

function isMissing(value: Sortable): boolean {
  return value === null || value === undefined || value === '';
}

/** ISO date strings compare chronologically, so they work here unchanged. */
function compare(a: Sortable, b: Sortable): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

/**
 * Ascending, with documents missing the value pushed to the end — the opposite
 * of `orderBy`, which would drop them from the results entirely.
 */
export function ascendingBy<T>(select: (item: T) => Sortable) {
  return (a: T, b: T): number => {
    const left = select(a);
    const right = select(b);
    if (isMissing(left) || isMissing(right)) {
      if (isMissing(left) && isMissing(right)) return 0;
      return isMissing(left) ? 1 : -1;
    }
    return compare(left, right);
  };
}

/** Descending. Missing values still sort last, not first. */
export function descendingBy<T>(select: (item: T) => Sortable) {
  return (a: T, b: T): number => {
    const left = select(a);
    const right = select(b);
    if (isMissing(left) || isMissing(right)) {
      if (isMissing(left) && isMissing(right)) return 0;
      return isMissing(left) ? 1 : -1;
    }
    return -compare(left, right);
  };
}
