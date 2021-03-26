import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { Movie, MovieDto } from 'src/app/movie';

import { movies } from '../_db';

interface MockApiResponse {
  statusCode: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly _movieState = new BehaviorSubject<Movie[]>([]);

  /**
   * current movieId
   */
  private _currentId: number = 5;

  /**
   * movies selector
   */
  get movies$() {
    return this._movieState.asObservable();
  }

  constructor() { }

  /**
   * Mock to get watch list from api
   */
  public getWatchList(): Observable<Movie[]> {
    return of(movies).pipe(
      delay(500),
      tap((movies) => this._movieState.next(movies)),
      catchError((error) => of(error))
    );
  }

  /**
   * Mock to add new movie to the watch list
   */
  public addMovie(dto: MovieDto): Observable<any> {
    return of('ok').pipe(
      tap(() => {
        const newMovie = { ...dto, id: this._generateId() };
        this._movieState.next([...this._movieState.value, newMovie]);
      }),
      catchError((error) => of(error))
    );
  }

  /**
   * Mock to edit movie
   */
  public editMovie(movieId: string, dto: MovieDto): Observable<any> {
    return of('ok').pipe(
      tap(() => {
        this._movieState.next([
          ...this._movieState.value.map(mv => {
            if (mv.id === movieId) {
              mv = { ...mv, ...dto }
            }
            return mv;
          })
        ]);
      }),
      catchError((error) => of(error))
    );
  }

  /**
   * Mock delete request
   */
  public deleteMovie(movieId: string): Observable<MockApiResponse> {
    return of({
      statusCode: 200,
      message: 'Deleted successfully'
    })
      .pipe(
        delay(500),
        tap(() => {
          this._movieState
            .next([
              ...this._movieState.value.filter(mv => mv.id !== movieId),
            ]);
          console.log(this._movieState.value)
        }),
        catchError(err => of(err))
      )
  }

  /**
   * generate autoincrement id
   */
  private _generateId(): string {
    return (++this._currentId).toString();
  }
}
