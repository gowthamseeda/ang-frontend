import { Component, OnDestroy } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';

@Component({
  selector: 'gp-timeout-confirmation',
  templateUrl: './timeout-confirmation.component.html',
  styleUrls: ['./timeout-confirmation.component.scss']
})
export class TimeoutConfirmationComponent implements OnDestroy {

  intervalId : any;
  timeoutTime : number  = 300;
  logoutTime : any;

  ngOnDestroy() {
    clearInterval(this.intervalId)
  }

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<TimeoutConfirmationComponent>,
    private router: Router
  ) {
    this.logoutTime = Date.now() + this.timeoutTime * 1000;
    this.intervalId = setInterval(() => {
      this.timeoutTime = Math.round((this.logoutTime - Date.now()) / 1000);
      if(this.timeoutTime == 0 || Date.now() > this.logoutTime){
        this.timeoutTime = 0;
        clearInterval(this.logoutTime);
        clearInterval(this.intervalId);
        this.logout();
      }
    },1000)
  }
  close() {
    this.dialogRef.close()
  }

  logout(): void {
    console.debug("logging user out.")
    this.apiService.get('/user_logged_out').subscribe()
    this.router.navigate(['/logout'])
    this.close()
  }

}
