import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';

import { MasterProductGroup } from '../../../../../product-group/master-product-group/master-product-group.model';
import { MasterProductGroupService } from '../../../../../product-group/master-product-group/master-product-group.service';

@Component({
  selector: 'gp-product-group-selector',
  templateUrl: './product-group-selector.component.html',
  styleUrls: ['./product-group-selector.component.scss']
})
export class ProductGroupSelectorComponent implements OnInit, OnDestroy {
  @Input()
  control: UntypedFormControl;
  @Output()
  selectionChange = new EventEmitter<string>();

  productGroups: MasterProductGroup[] = [];

  private unsubscribe = new Subject<void>();

  constructor(private productGroupService: MasterProductGroupService) {}

  ngOnInit(): void {
    this.productGroupService.getAll().subscribe(productGroups => {
      this.productGroups = productGroups;
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
