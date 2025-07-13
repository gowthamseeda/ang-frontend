import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, Subject } from 'rxjs';
import { FileUploadStatusService } from '../file-upload-status.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import {
  FileUploadStatusDetails,
  FileUploadStatusDetail
} from '../model/file-upload-status.model';

@Component({
  selector: 'gp-file-upload-status',
  templateUrl: './file-upload-status.component.html',
  styleUrls: ['./file-upload-status.component.scss']
})
export class FileUploadStatusComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = [
    //'id',
    'name',
    'status',
    'fileName',
    'errorMsg',
    'createTimestamp',
    'updateTimestamp'
  ];
  dataSource = new MatTableDataSource();
  isLoading: boolean;
  isAuthorized: Observable<boolean>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private unsubscribe = new Subject<void>();

  constructor(
    private fileUploadStatusService: FileUploadStatusService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.dataSource.sort = this.sort;
    this.getFileUploadStatus();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  filterTable(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getFileUploadStatus(): void {
    this.fileUploadStatusService
      .getAll()
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.snackBarService.showError(error);
          return of({} as FileUploadStatusDetail);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((fileUploadStatusDetails: FileUploadStatusDetails) => {
        this.dataSource.data = this.transformToMatDataSource(fileUploadStatusDetails.fileUploadStatusDetails);
        this.isLoading = false;
      }
      );
  }

  private transformToMatDataSource(fileUploadStatusDetails: FileUploadStatusDetail[]): any {
    return fileUploadStatusDetails.map(fileUploadStatusDetail => {
      const dataSource = {
        //id: fileUploadStatusDetail.id,
        name: fileUploadStatusDetail.name,
        status: fileUploadStatusDetail.status,
        fileName: fileUploadStatusDetail.fileName,
        errorMsg: fileUploadStatusDetail.errorMsg,
        createTimestamp: fileUploadStatusDetail.createTimestamp,
        updateTimestamp: fileUploadStatusDetail.updateTimestamp
      };

      return dataSource;
    });
  }
}