import { Component, Input, OnInit } from '@angular/core';

import { BreadcrumbItem } from '../../models/header.model';

@Component({
  selector: 'gp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor() {}

  ngOnInit(): void {}
}
