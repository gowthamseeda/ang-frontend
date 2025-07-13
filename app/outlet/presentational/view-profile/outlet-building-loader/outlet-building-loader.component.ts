import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-building-loader',
  templateUrl: './outlet-building-loader.component.html',
  styleUrls: ['./outlet-building-loader.component.scss']
})
export class OutletBuildingLoaderComponent implements OnInit {
  @Input()
  isLoading = true;

  constructor() {}

  ngOnInit(): void {}
}
