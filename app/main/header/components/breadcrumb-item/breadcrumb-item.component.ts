import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { BreadcrumbItem } from '../../models/header.model';

@Component({
  selector: 'gp-breadcrumb-item',
  templateUrl: './breadcrumb-item.component.html',
  styleUrls: ['./breadcrumb-item.component.scss']
})
export class BreadcrumbItemComponent implements OnInit {
  @Input() breadcrumbItems: BreadcrumbItem[];
  @ViewChild('childMenu', { static: true }) public childMenu: BreadcrumbItemComponent;

  constructor() {}

  ngOnInit(): void {}
}
