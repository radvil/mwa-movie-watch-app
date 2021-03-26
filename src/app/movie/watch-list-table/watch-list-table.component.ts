import { EventEmitter } from '@angular/core';
import { Component, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { Movie } from '../movie.interface';

@Component({
  selector: 'app-watch-list-table',
  templateUrl: './watch-list-table.component.html',
  styleUrls: ['./watch-list-table.component.scss']
})
export class WatchListTableComponent {
  @Input('dataSource') dataSource!: MatTableDataSource<Movie>;
  @Input('columns') displayedColumns!: string[];
  @Output('deleteMovie') delete = new EventEmitter();
  @Output('dialogOnAdd') clickAddMovie = new EventEmitter();
  @Output('dialogOnEdit') clickEditMovie = new EventEmitter();
  @ViewChild(MatMenuTrigger, { static: true }) contextMenu!: MatMenuTrigger;
  public contextMenuPosition = { x: '0px', y: '0px' };

  constructor() { }

  onContextMenu(event: MouseEvent, movie: Movie) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: movie };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

}
