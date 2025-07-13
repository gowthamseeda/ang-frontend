import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterLanguage } from '../../language/master-language/master-language.model';
import { MasterLanguageService } from '../../language/master-language/master-language.service';

@Component({
  selector: 'gp-language-tile',
  templateUrl: './language-tile.component.html',
  styleUrls: ['./language-tile.component.scss']
})
export class LanguageTileComponent implements OnInit {
  languages: MasterLanguage[];
  searchText: string;

  constructor(
    private languageService: MasterLanguageService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initLanguages();
  }

  searchLanguageName(searchText: string): void {
    this.searchText = searchText;
  }

  deleteLanguage(languageId: string): void {
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
        this.languageService.delete(languageId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_LANGUAGE_SUCCESS');
            this.initLanguages();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  private initLanguages(): void {
    this.languageService.getAll().subscribe((languages: MasterLanguage[]) => {
      this.languages = languages;
    });
  }
}
