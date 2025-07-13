import { Component, OnInit, ViewChild } from '@angular/core';

import { PositionControlComponent } from '../../shared/position-control/position-control.component';
import { MasterService } from '../master-service/master-service.model';
import { MasterServiceService } from '../master-service/master-service.service';

@Component({
  selector: 'gp-service-priority',
  templateUrl: './service-priority.component.html',
  styleUrls: ['./service-priority.component.scss']
})
export class ServicePriorityComponent implements OnInit {
  @ViewChild('position-control') positionControl: PositionControlComponent<MasterService>;
  service: MasterServiceService;

  constructor(private serviceService: MasterServiceService) {}

  ngOnInit(): void {
    this.service = this.serviceService;
  }
}
