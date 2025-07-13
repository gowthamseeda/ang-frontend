import { Component, OnInit } from '@angular/core';
import { SessionInvalidatorService } from '../session-manager/session-invalidator/session-invalidator.service';

@Component({
  selector: 'gp-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(
    private sessionInvalidator: SessionInvalidatorService
  ) {
  }

  ngOnInit(): void {
    this.sessionInvalidator.removeTimer();
  }
}
