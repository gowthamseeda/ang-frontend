import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';

import { ObjectPosition, PositionControl } from './position-control.model';

@Component({
  selector: 'gp-position-control',
  templateUrl: './position-control.component.html',
  styleUrls: ['./position-control.component.scss']
})
export class PositionControlComponent<T extends PositionControl> implements OnInit {
  @ViewChild('table') table: MatTable<T>;

  @Input()
  imageFolder?: string;

  @Input()
  service: any;

  @Input()
  updateSuccessTranslation: string;

  @Input()
  logoTranslation?: string;

  @Input()
  nameTranslation: string;

  @Input()
  positionTranslation: string;

  displayedColumns: string[] = ['objectName', 'objectPosition'];
  dataSource = new MatTableDataSource<T>();
  isSaving: boolean;
  genericObject: T;

  constructor(private snackBarService: SnackBarService) {}

  ngOnInit(): void {
    if (this.imageFolder) {
      this.displayedColumns.unshift('objectLogo');
    }
    this.initTable();
  }

  dropObjectRow(event: CdkDragDrop<T[]>): void {
    if (this.dataSource.data[event.currentIndex].id === event.item.data.id) {
      return;
    }

    this.isSaving = true;

    const object = event.item.data;
    const previousIndex: number = this.getPreviousIndex(object);

    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);

    const afterId = this.afterBrandId(event.currentIndex);
    const beforeId = this.beforeBrandId(event.currentIndex);
    let objectPosition: ObjectPosition;

    if (afterId) {
      objectPosition = {
        id: object.id,
        afterId: afterId
      };
    } else {
      objectPosition = {
        id: object.id,
        beforeId: beforeId
      };
    }

    this.service.updatePosition(objectPosition).subscribe(
      () => {
        this.service.clearCacheAndFetchAll();
        this.initTable();
        this.snackBarService.showInfo(this.updateSuccessTranslation);
      },
      (error: Error) => {
        this.initTable();
        this.snackBarService.showError(error);
      }
    );
    this.table.renderRows();
  }

  beforeBrandId(currentIndex: number): string {
    if (currentIndex === 0) {
      return this.dataSource.data[currentIndex + 1].id;
    }
    return '';
  }

  afterBrandId(currentIndex: number): string {
    if (currentIndex > 0) {
      return this.dataSource.data[currentIndex - 1].id;
    }
    return '';
  }

  getObjectImageUrl(objectId: any): string {
    if (typeof objectId === 'string') {
      objectId = objectId.toLowerCase();
    }
    return `assets/${this.imageFolder}/${objectId}.svg`;
  }

  private getPreviousIndex(object: T): number {
    return this.dataSource.data.indexOf(object);
  }

  private initTable(): void {
    this.service.getAll().subscribe((objects: T[]) => {
      this.dataSource.data = objects;
      this.isSaving = false;
    });
  }
}
