import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateOutputType } from '../../../shared/pipes/translate-data/translate-output-type.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { MasterKeyType } from '../../services/master-key/master-key.model';
import { MasterKeyService } from '../../services/master-key/master-key.service';

@Component({
  selector: 'gp-key-tile',
  templateUrl: './key-tile.component.html',
  styleUrls: ['./key-tile.component.scss']
})
export class KeyTileComponent implements OnInit {
  keyTypes: MasterKeyType[];
  searchText: string;
  currentSelectedLanguage?: string;
  translateOutputType = TranslateOutputType;

  constructor(
    private keyService: MasterKeyService,
    private sortingService: SortingService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.initKeyTypes();

    this.userSettingsService
      .getLanguageId()
      .subscribe(languageId => (this.currentSelectedLanguage = languageId));
  }

  searchKeyTypeName(searchText: string): void {
    this.searchText = searchText;
  }

  deleteKeyType(keyTypeId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '650px',
      data: {
        title: 'DELETE_ENTRY',
        content: 'DELETE_ENTRY_QUESTION',
        confirmButton: 'YES'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.keyService.delete(keyTypeId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_KEY_TYPE_SUCCESS');
            this.initKeyTypes();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  private initKeyTypes(): void {
    this.keyService
      .getAll()
      .pipe(map((keyTypes: MasterKeyType[]) => keyTypes.sort(this.sortingService.sortByName)))
      .subscribe((keyTypes: MasterKeyType[]) => {
        this.keyTypes = keyTypes;
      });
  }
}
