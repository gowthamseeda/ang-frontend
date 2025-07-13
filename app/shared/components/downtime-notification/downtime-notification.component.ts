import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gp-downtime-notification',
  templateUrl: './downtime-notification.component.html',
  styleUrls: ['./downtime-notification.component.scss']
})
export class DowntimeNotificationComponent implements OnInit {
  isVisible = true;

  constructor() {}

  ngOnInit(): void {}
}
