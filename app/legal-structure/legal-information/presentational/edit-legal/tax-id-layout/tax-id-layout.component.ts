import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-tax-id-layout',
  templateUrl: './tax-id-layout.component.html',
  styleUrls: ['./tax-id-layout.component.scss']
})
export class TaxIdLayoutComponent implements OnInit {
  @Input()
  title: string;

  constructor() {}

  ngOnInit(): void {}
}
