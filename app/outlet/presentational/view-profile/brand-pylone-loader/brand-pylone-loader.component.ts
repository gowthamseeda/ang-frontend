import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-brand-pylone-loader',
  templateUrl: './brand-pylone-loader.component.html',
  styleUrls: ['./brand-pylone-loader.component.scss']
})
export class BrandPyloneLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
