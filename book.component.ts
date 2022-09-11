import { BehaviorSubject, Observable, of, switchMap, map } from 'rxjs';

export class BookComponent {
  books$: Observable<BookVM[]>;
  filter$: BehaviorSubject<BookFilter> = new BehaviorSubject({});

  constructor(bookService: BooksService) {
    this.books$ = this.filter$.pipe(
      switchMap((f) => bookService.queryBooks(f)),
      map((r) => {
        if (Array.isArray(r?.results)) {
          return r.results.map(({ title, authors }) => ({
            title,
            author:
              Array.isArray(authors) && authors.length > 0
                ? authors[0]
                : 'unknown author',
          }));
        }
        return [];
      })
    );
  }
}

interface BooksResponse {
  total: number;
  results: {
    title: string;
    subtitle?: string;
    authors: string[];
    soldCopies?: number;
  }[];
}

interface BookVM {
  title: string;
  author: string;
}

interface BookFilter {
  type?: 'fiction' | 'nonfiction';
}

class BooksService {
  public queryBooks(filter: BookFilter): Observable<BooksResponse> {
    return of(); // noop as we'll be mocking this anyway
  }
}
