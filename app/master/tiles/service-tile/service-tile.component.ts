import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'app/master/service/master-service/master-service.model';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateOutputType } from '../../../shared/pipes/translate-data/translate-output-type.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { MasterServiceService } from '../../service/master-service/master-service.service';
import { DetailsLinks } from '../../shared/master-tile/master-tile.component';

@Component({
  selector: 'gp-service-tile',
  templateUrl: './service-tile.component.html',
  styleUrls: ['./service-tile.component.scss']
})
export class ServiceTileComponent implements OnInit {
  services: MasterService[];
  searchText: string;
  menuItems: DetailsLinks[];
  currentSelectedLanguage?: string;
  translateType = TranslateOutputType;

  constructor(
    private masterServiceService: MasterServiceService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.initMenuItems();
    this.initServices();
    this.userSettingsService
      .getLanguageId()
      .subscribe(languageId => (this.currentSelectedLanguage = languageId));
  }

  searchServiceName(searchText: string): void {
    this.searchText = searchText;
  }

  deleteService(serviceId: number): void {
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
        this.masterServiceService.delete(serviceId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_SERVICE_SUCCESS');
            this.initServices();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  isServiceDescriptionExist(service?: MasterService): boolean {
    return service && (service?.description || (service?.translations && this.currentSelectedLanguage && service?.translations[this.currentSelectedLanguage]))
  }

  initMenuItems(): void {
    this.menuItems = [
      {
        link: '/master/service/priority',
        text: 'EDIT_SERVICE_PRIORITY'
      },
      {
        link: '/master/service/service-variant',
        text: 'MASTER_DATA_SERVICE_VARIANT'
      }
    ];
  }

  private initServices(): void {
    this.masterServiceService.getAll().subscribe(services => {
      this.services = services;
    });
  }
}
