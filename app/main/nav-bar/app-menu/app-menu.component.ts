import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AppConfigProvider } from '../../../app-config.service';
import { LegalNoticeComponent } from '../../legal-notice/legal-notice.component';

@Component({
  selector: 'gp-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent {
  constructor(public dialog: MatDialog, public appConfigProvider: AppConfigProvider) {}

  openLegalNoticeDialog(): void {
    this.dialog.open(LegalNoticeComponent, {
      height: '95%'
    });
  }

  logout(): void {
    window.location.href = '../logout';
  }
}
