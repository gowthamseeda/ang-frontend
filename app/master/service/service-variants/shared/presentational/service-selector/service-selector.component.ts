import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';

import { MasterService } from '../../../../master-service/master-service.model';
import { MasterServiceService } from '../../../../master-service/master-service.service';

@Component({
  selector: 'gp-service-selector',
  templateUrl: './service-selector.component.html',
  styleUrls: ['./service-selector.component.scss']
})
export class ServiceSelectorComponent implements OnInit, OnDestroy {
  @Input()
  control: UntypedFormControl;
  @Output()
  selectionChange = new EventEmitter<string>();

  services: MasterService[] = [];

  private unsubscribe = new Subject<void>();

  constructor(private serviceService: MasterServiceService) {}

  ngOnInit(): void {
    this.serviceService.getAll().subscribe(services => {
      this.services = services;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onChange(changeEvent: MatSelectChange): void {
    this.selectionChange.emit(changeEvent.value);
  }

  getControlValue(): string {
    return this.control.value;
  }
}
