import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { UserSettingsService } from "../../user-settings/user-settings/services/user-settings.service";
import { take, takeUntil } from "rxjs/operators";
import { UserAgreement } from "../../user-settings/user-settings/model/user-agreement.model";
import { UserService } from "../../iam/user/user.service";
import { Subject } from "rxjs";

@Component({
  selector: 'gp-security-pop-up',
  templateUrl: './security-pop-up.component.html',
  styleUrls: ['./security-pop-up.component.scss']
})
export class SecurityPopUpComponent implements OnInit, OnDestroy {

  currentUserId: string;
  languageId: string;
  private unsubscribe = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<SecurityPopUpComponent>,
    private userService: UserService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.userService
      .getCurrent()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.currentUserId = user.userId;
      });

    this.userSettingsService
      .getLanguageId()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(languageId => {
        this.languageId = languageId ?? "en";
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  close(): void {
    this.userSettingsService
      .updateSecurityAgreement(
        new UserAgreement({
          userId: this.currentUserId,
          languageId: this.languageId,
          messageKeyId: "SECURITY_POP_UP_MESSAGE",
          userAgreeMessageTime: this.localeDateTimeInString()
        })
      ).pipe(take(1))
      .subscribe()
    this.dialogRef.close()
  }

  decline(): void {
    sessionStorage.setItem("SeenSecurityPopUp", "FALSE")
    window.location.href = '../logout'
    this.dialogRef.close()
  }

  localeDateTimeInString(): string {
    const now = new Date();
    const userLocale = navigator.language;

    const formattedDate = now.toLocaleDateString(userLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const formattedTime = now.toLocaleTimeString(userLocale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return formattedDate + " " + formattedTime;
  }
}
