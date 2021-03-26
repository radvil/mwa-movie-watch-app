import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Movie, UpdateMovieDialogComponent } from './movie';
import { MovieService } from './_mocks/_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appTitle = 'MWA | Movie Watch App';
  private _destroy$ = new Subject();
  public moviesDataSource!: MatTableDataSource<Movie>;
  public displayedColumns: string[] = [
    'title',
    'episodes',
    'info_url',
    'watch_url',
    'action',
  ];

  constructor(
    private _movieService: MovieService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._movieService
      .getWatchList()
      .pipe(
        switchMap(() =>
          this._movieService.movies$.pipe(
            tap((movies) => {
              this.moviesDataSource = new MatTableDataSource(
                movies
              );
            })
          )
        ),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  deleteMovie(movieId: string) {
    this._movieService
      .deleteMovie(movieId)
      .pipe(
        tap((res) => {
          if (res.statusCode === 200) {
            this._snackBar.open(res.message, 'ok', {
              duration: 3000,
            });
          }
        })
      )
      .subscribe();
  }

  openMovieDialog(movie?: Movie) {
    const dialog = this._dialog
      .open(UpdateMovieDialogComponent, {
        data: { movie },
        width: '500px',
        panelClass: 'mwa-dialog-panel',
      })
      .beforeClosed()
      .pipe(
        switchMap(dialogRes => {
          if (movie && dialogRes?.mode === 'EDIT') {
            return this._movieService.editMovie(movie.id, dialogRes.data)
          } else {
            return this._movieService.addMovie(dialogRes.data);
          }
        })
      );

    dialog.subscribe();
  }
}
