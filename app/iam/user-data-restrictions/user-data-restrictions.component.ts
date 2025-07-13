import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { FeatureToggleService } from '../../shared/directives/feature-toggle/feature-toggle.service';

import { HistoryComponent } from './history/history.component';
import { SettingComponent } from './setting/setting.component';

@Component({
  selector: 'gp-user-data-restrictions',
  templateUrl: './user-data-restrictions.component.html',
  styleUrls: ['./user-data-restrictions.component.scss']
})
export class UserDataRestrictionsComponent implements OnInit, OnDestroy {
  userId: string;
  isError = false;
  focusFeatureToggleFlag: Observable<boolean>;

  @ViewChild(HistoryComponent) private historyComponent: HistoryComponent;
  @ViewChild(SettingComponent) private settingComponent: SettingComponent;

  private unsubscribe = new Subject<void>();

  constructor(private route: ActivatedRoute, private featureToggleService: FeatureToggleService) {}

  ngOnInit(): void {
    this.getFocusFeatureToggle();
    this.getUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getFocusFeatureToggle(): void {
    this.focusFeatureToggleFlag = this.featureToggleService.isFeatureEnabled('FOCUS');
  }

  getUser(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') || '';
    });
  }

  onTabChanged(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.settingComponent.initData();
        break;
      case 1:
        this.historyComponent.initLog();
        break;
    }
  }
}
