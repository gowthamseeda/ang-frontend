import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BreadcrumbItem } from '../../models/header.model';

@Component({
  selector: 'gp-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges {
  @Input()
  breadcrumbItems: BreadcrumbItem[] = [];

  hasNavigableParentBreadcrumb: boolean;

  private parentBreadcrumbItems: BreadcrumbItem[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.parentBreadcrumbItems = this.breadcrumbItems
      .slice(0, this.breadcrumbItems.length - 1)
      .reverse();
    this.hasNavigableParentBreadcrumb = !!this.parentBreadcrumbItems.find(
      breadcrumbItem => breadcrumbItem.path !== undefined
    );
  }

  navigateUpBreadcrumb(): void {
    const path =
      this.parentBreadcrumbItems.find(breadcrumbItem => breadcrumbItem.path !== undefined)?.path ||
      '';
    this.router.navigate([path], { relativeTo: path.startsWith('.') ? this.activatedRoute : null });
  }
}
