import { subscribe } from './subscribe';
import { Subject, of, merge, throwError } from 'rxjs';

describe('subscribe', () => {
  it('should subscribe to passed in observable and aggregate the values in the returned array', () => {
    // arrange
    const o = of(1);
    // act
    expect(subscribe(o)).toEqual([1]);
  });

  it('should subscribe to passed in observable and aggregate only the first value in the returned array', () => {
    // arrange
    const o = of(1, 2);
    // act
    expect(subscribe(o)).toEqual([1]);
  });

  it('should subscribe to passed in observable and aggregate as many values as requested in the returned array', () => {
    // arrange
    const o = of(1, 2);
    // act
    expect(subscribe(o, 2)).toEqual([1, 2]);
  });

  it('should subscribe to passed in observable and aggregate values until the passed in observable emits a value in the returned array', () => {
    // arrange
    const o = new Subject();
    const until = new Subject<void>();
    // act
    const r = subscribe(o, until);
    o.next(5);
    o.next(4);
    until.next();
    o.next(3); // should not be in the aggregated values
    // assert
    expect(r).toEqual([5, 4]);
  });

  it('should subscribe to passed in observable and aggregate as values and errors in the returned array', () => {
    // arrange
    const o = merge(
      of(1),
      throwError(() => new Error('test'))
    );
    // act
    expect(subscribe(o, 2)).toEqual([1, new Error('test')]);
  });
});
