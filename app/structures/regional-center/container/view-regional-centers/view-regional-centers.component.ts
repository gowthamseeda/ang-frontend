import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserSettings } from '../../../../user-settings/user-settings/model/user-settings.model';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';

import { RegionalCenterViewState } from './view-regional-centers.component.state';
import { ViewRegionalCentersComponentService } from './view-regional-centers.service';

@Component({
  selector: 'gp-view-regional-centers',
  templateUrl: './view-regional-centers.component.html',
  styleUrls: ['./view-regional-centers.component.scss']
})
export class ViewRegionalCentersComponent implements OnInit, OnDestroy {
  regionalCenters: RegionalCenterViewState[] = [];
  userSettings: Observable<UserSettings> = this.userSettingsService.get();
  private unsubscribe = new Subject<void>();

  constructor(
    private componentService: ViewRegionalCentersComponentService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.componentService
      .getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(regionalCenters => {
        this.regionalCenters = regionalCenters;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
