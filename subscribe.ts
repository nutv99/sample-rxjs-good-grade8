import { Observable, isObservable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

/**
 * A helper function that subscribes to observable and aggregates the values and errors in an array for ease of use.
 * 
 * @param to$ The observable to subscribe to
 * @param untilOrTimes The subscription ending count or other observable to signal the end of subscription
 * @example
 *  // arrange
    const o = merge(
      of(1),
      throwError(() => new Error('test'))
    );
    // act
    expect(subscribe(o, 2)).toEqual([1, new Error('test')]);
 */
export function subscribe<T>(
  to$: Observable<T>,
  untilOrTimes: number | Observable<any> = 1
) {
  const values = [];

  const piped$ = isObservable(untilOrTimes)
    ? to$.pipe(takeUntil(untilOrTimes))
    : to$.pipe(take(untilOrTimes));

  piped$.subscribe({
    next: (v) => values.push(v),
    error: (e) => values.push(e),
  });

  return values;
}
