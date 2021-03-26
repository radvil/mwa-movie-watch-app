import { Component, Inject, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovieDto } from '../movie.interface';

@Component({
	selector: 'app-update-movie-dialog',
	templateUrl: './update-movie-dialog.component.html',
	styleUrls: ['./update-movie-dialog.component.scss'],
})
export class UpdateMovieDialogComponent implements OnInit {
	public movieForm!: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { movie: MovieDto },
		public dialogRef: MatDialogRef<UpdateMovieDialogComponent>,
		private _formBuilder: FormBuilder
	) {}

	private get _dialogMode(): 'ADD' | 'EDIT' {
		return this.data?.movie?.title ? 'EDIT' : 'ADD';
	}

	get dialogTitle(): string {
		return this.data?.movie?.title ? 'Update movie' : 'Add new movie';
	}

	get dialogIconName(): string {
		return this._dialogMode === 'EDIT' ? 'edit' : 'add';
	}

	get title(): AbstractControl {
		return this.movieForm.get('title')!;
	}

	get episodes(): AbstractControl {
		return this.movieForm.get('episodes')!;
	}

	ngOnInit(): void {
		this.movieForm = this._formBuilder.group({
			title: ['', [Validators.required]],
			episodes: [0, Validators.min(0)],
			info_url: [''],
			watch_url: [''],
		});

		if (this._dialogMode === 'EDIT') {
			this._prepareEditMode();
		}
	}

	private _prepareEditMode() {
		this.movieForm.patchValue({ ...this.data.movie });
		this.movieForm.updateValueAndValidity();
	}

	submitForm() {
		if (this.movieForm.valid) {
			this.dialogRef.close({
				mode: this._dialogMode,
				data: this.movieForm.value,
			});
		}
	}
}
