import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-profile-data',
  templateUrl: './outlet-profile-data.component.html',
  styleUrls: ['./outlet-profile-data.component.scss']
})
export class OutletProfileDataComponent implements OnInit {
  @Input()
  headline: string;
  @Input()
  firstRow: string;
  @Input()
  secondRow: string;
  @Input()
  thirdRow: string;
  @Input()
  fourthRow: string;
  @Input()
  fifthRow: string;

  constructor() {}

  ngOnInit(): void {}
}
