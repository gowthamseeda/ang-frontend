import { Injectable } from '@angular/core';
import { UserIdleService } from "angular-user-idle";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { TimeoutConfirmationComponent } from "../timeout-confirmation/timeout-confirmation.component";

@Injectable({
  providedIn: 'root'
})
export class SessionInvalidatorService {

  constructor(
    private userIdle: UserIdleService,
    private matDialog: MatDialog
  ) {
  }

  subscription: Subscription;

  initTimer () {
    console.debug("start watching user idle")
    this.userIdle.startWatching();
    this.subscription = this.subscribeTimer();
  }

  removeTimer() {
    this.userIdle.stopTimer();
    this.userIdle.stopWatching();
    if(this.subscription)
      this.subscription.unsubscribe()
  }

  subscribeTimer(): Subscription {
    return this.userIdle.onTimerStart().subscribe(() => {
      console.debug("open timeout confirmation dialog")
      this.subscription.unsubscribe()
      this.matDialog.open(
        TimeoutConfirmationComponent,
        {height: '20rem', width: '35rem'}
      ).afterClosed().subscribe(() => {
        this.userIdle.resetTimer()
        this.subscription = this.subscribeTimer()
      })
    })
  }

}
