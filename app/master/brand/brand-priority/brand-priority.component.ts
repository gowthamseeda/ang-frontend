import { Component, OnInit, ViewChild } from '@angular/core';

import { PositionControlComponent } from '../../shared/position-control/position-control.component';
import { MasterBrand } from '../master-brand/master-brand.model';
import { MasterBrandService } from '../master-brand/master-brand.service';

@Component({
  selector: 'gp-brand-priority',
  templateUrl: './brand-priority.component.html',
  styleUrls: ['./brand-priority.component.scss']
})
export class BrandPriorityComponent implements OnInit {
  @ViewChild('position-control') positionControl: PositionControlComponent<MasterBrand>;
  service: MasterBrandService;

  constructor(private brandService: MasterBrandService) {}

  ngOnInit(): void {
    this.service = this.brandService;
  }
}
