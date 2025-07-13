import {Component, OnInit} from '@angular/core';
import { ApiService } from "../../../../shared/services/api/api.service";
import {HttpParams} from "@angular/common/http";
import {CustomEncoder} from "../../../../shared/services/api/custom-encoder";
import { map, take } from 'rxjs/operators';
import {SnackBarService} from "../../../../shared/services/snack-bar/snack-bar.service";
import { MasterKeyType } from '../../../../master/services/master-key/master-key.model';
import { MasterKeyService } from '../../../../master/services/master-key/master-key.service';
import { SortingService } from '../../../../shared/services/sorting/sorting.service';

@Component({
  selector: 'gp-external-keys-upload',
  templateUrl: './external-keys-upload.component.html',
  styleUrls: ['./external-keys-upload.component.scss']
})
export class ExternalKeysUploadComponent implements OnInit {
  keyTypes: MasterKeyType[];
  displayedColumns: string[] = [
    'keyType',
    'fileInput',
    'sheetName',
    'action'
  ]
  selectedKey: MasterKeyType;
  selectedFile: File | undefined = undefined;
  sheetName: string;
  isUploading: boolean = false;

  constructor(
    private apiService: ApiService,
    private keyService: MasterKeyService,
    private sortingService: SortingService,
    private snackBarService: SnackBarService
  ) {}


  ngOnInit(): void {
    this.initKeyTypes();
  }

  initKeyTypes(): void {
    this.keyService
      .getAll()
      .pipe(map((keyTypes: MasterKeyType[]) => keyTypes.sort(this.sortingService.sortByName)))
      .subscribe((keyTypes: MasterKeyType[]) => {
        this.keyTypes = keyTypes;
      });
  }

  uploadKey() {
    this.isUploading = true;
    if(!this.selectedKey) {
      this.snackBarService.showInfo('OPTION_NOT_AVAILABLE')
      return
    }

    if(this.selectedFile == undefined) {
      this.snackBarService.showInfo('FILE_IS_EMPTY')
      return
    }

    const selectedKeyType = this.keyTypes.find(keyType => keyType.name === this.selectedKey.name);
    if(selectedKeyType) {
      this.uploadExternalKeys(this.sheetName, selectedKeyType.id, this.selectedFile)
        .pipe(take(1))
        .subscribe(response => {
            this.snackBarService.showInfo('FILE_UPLOADED')
            this.isUploading = false;
          },
          error => {
            this.snackBarService.showError(error)
          }
        )
    }
  }

  setSheetName(event: any) {
    this.sheetName = event.target.value
  }

  selectFile(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = undefined
    }
  }

  disabledField(){
    return this.sheetName === undefined ||
      this.sheetName.trim() == '' ||
      this.selectedFile === undefined ||
      this.selectedKey === undefined
  }

  uploadExternalKeys(
    sheetName: string,
    externalKeyId: string,
    excelFile: File
  ) {
    let httpParams = new HttpParams({ encoder: new CustomEncoder() });
    httpParams = httpParams.append('sheetName', sheetName).append('externalKeyId', externalKeyId)

    const formData: FormData = new FormData();
    formData.append('excelFile', excelFile, excelFile.name);

    return this.apiService.postFile<any>(
      '/traits/api/v1/externalkeys/import',
      formData,
      httpParams
    )
  }
}
