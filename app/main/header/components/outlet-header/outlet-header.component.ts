import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BreadcrumbItem } from '../../models/header.model';
import { OutletBreadcrumbService } from '../../services/outlet-breadcrumb/outlet-breadcrumb.service';

@Component({
  selector: 'gp-outlet-header',
  templateUrl: './outlet-header.component.html',
  styleUrls: ['./outlet-header.component.scss']
})
export class OutletHeaderComponent implements OnInit {
  ofBreadcrumbItems: Observable<BreadcrumbItem[]> = of([]);

  constructor(private outletBreadcrumbService: OutletBreadcrumbService) {}

  ngOnInit(): void {
    this.ofBreadcrumbItems = this.outletBreadcrumbService.breadcrumbItems.asObservable();
  }
}
