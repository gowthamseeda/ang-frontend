import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NotificationService } from './notification.service';

@Component({
  selector: 'gp-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input()
  id: string;
  @Input()
  translationKey: string;

  message: string;

  private unsubscribe = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.translateMessage();

    this.translateService.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.translateMessage();
    });

    this.translateService.onDefaultLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.translateMessage();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  isNotificationAlreadyRead(): boolean {
    return !this.notificationService.isReadConfirmed(this.id);
  }

  isNotificationTranslated(): boolean {
    return this.message !== this.translationKey;
  }

  closeNotification(): void {
    this.notificationService.confirmRead(this.id);
  }

  private translateMessage(): void {
    this.translateService
      .get(this.translationKey)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((translation: string) => {
        this.message = translation;
      });
  }
}
