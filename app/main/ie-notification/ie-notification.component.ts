import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-ie-notification',
  templateUrl: './ie-notification.component.html',
  styleUrls: ['./ie-notification.component.scss']
})
export class IeNotificationComponent implements OnInit {
  constructor(
    private deviceService: DeviceDetectorService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    if (this.deviceService.getDeviceInfo().browser === 'IE') {
      this.snackBarService.showInfoPermanent('NOT_OPTIMIZED_FOR_IE');
    }
  }
}
