import { BookComponent } from './book.component';
import { of, Subject } from 'rxjs';
import { subscribe } from './subscribe';

describe('Book component', () => {
  it('should map book response to book view model', () => {
    // arrange
    const bookServiceMock = {
      queryBooks: () =>
        of({ total: 1, results: [{ title: 'my book', authors: ['just me'] }] }),
    };
    const c = new BookComponent(bookServiceMock);
    // act
    const [books] = subscribe(c.books$);
    // assert
    expect(books).toEqual([{ title: 'my book', author: 'just me' }]);
  });

  it('should get a second response when filter triggered', () => {
    let i = 1;
    // arrange
    const bookServiceMock = {
      queryBooks: () =>
        of({
          total: 1,
          results: [{ title: 'my book' + i++, authors: ['just me'] }],
        }),
    };
    const c = new BookComponent(bookServiceMock);
    // act
    const books = subscribe(c.books$, 2);
    expect(books.length).toBe(1);
    c.filter$.next({ type: 'nonfiction' });
    // assert
    expect(books.length).toBe(2);
    expect(books).toEqual([
      [{ title: 'my book1', author: 'just me' }],
      [{ title: 'my book2', author: 'just me' }],
    ]);
  });

  it('should get a second response when filter triggered', () => {
    let stop$ = new Subject<void>();
    let i = 1;
    // arrange
    const bookServiceMock = {
      queryBooks: () =>
        of({
          total: 1,
          results: [{ title: 'my book' + i++, authors: ['just me'] }],
        }),
    };
    const c = new BookComponent(bookServiceMock);
    // act
    const books = subscribe(c.books$, stop$);
    expect(books.length).toBe(1);
    c.filter$.next({ type: 'nonfiction' });
    c.filter$.next({ type: 'fiction' });

    stop$.next();

    c.filter$.next({});
    c.filter$.next({ type: 'nonfiction' });
    c.filter$.next({ type: 'fiction' });

    // assert
    expect(books.length).toBe(3);
    expect(books).toEqual([
      [{ title: 'my book1', author: 'just me' }],
      [{ title: 'my book2', author: 'just me' }],
      [{ title: 'my book3', author: 'just me' }],
    ]);
  });
});
