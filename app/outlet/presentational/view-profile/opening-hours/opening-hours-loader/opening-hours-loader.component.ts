import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-opening-hours-loader',
  templateUrl: './opening-hours-loader.component.html',
  styleUrls: ['./opening-hours-loader.component.scss']
})
export class OpeningHoursLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
