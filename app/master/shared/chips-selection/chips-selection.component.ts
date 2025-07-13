import { KeyValue } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { SortingService } from '../../../shared/services/sorting/sorting.service';

@Component({
  selector: 'gp-chips-selection',
  templateUrl: './chips-selection.component.html',
  styleUrls: ['./chips-selection.component.scss']
})
export class ChipsSelectionComponent implements OnInit, OnChanges {
  @Input()
  control: UntypedFormControl;
  @Input()
  placeholder: string;
  @Input()
  readonly = false;
  @Input()
  required = false;
  @Input()
  errorStateMatcher: ErrorStateMatcher;
  @Input()
  itemList?: any[];
  @Input()
  itemEnum?: any;
  @Input()
  isLanguage = false;
  @Input()
  showIconInDropdown: boolean;
  @Output()
  changeFunction: EventEmitter<any> = new EventEmitter();
  @Input()
  isBrand = false;
  @Input()
  isProductGroup = false;
  @Input()
  floatLabel: string = "always";

  selectedItems: any[] = [];

  constructor(private sortingService: SortingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isEnum() && changes.itemList.currentValue) {
      if (Array.isArray(this.control.value)) {
        this.selectedItems = this.sortChipsList(this.control.value);
      }
    }
  }

  ngOnInit(): void {
    this.control.valueChanges.subscribe(value => {
      if (Array.isArray(value)) {
        this.selectedItems = this.sortChipsList(value);
      }
    });
  }

  selectionChange(): void {
    this.changeFunction.emit();
  }

  removeItem(itemToRemove: string, clickEvent: Event): void {
    clickEvent.stopPropagation();
    this.control.setValue(this.control.value.filter((item: any) => item !== itemToRemove));
    this.selectionChange();
  }

  getItem(itemId: string): any {
    return this.isEnum() ? this.itemEnum[itemId] : this.findItem(itemId);
  }

  valueOrder(a: KeyValue<string, string>, b: KeyValue<string, string>): number {
    return a.value.localeCompare(b.value);
  }

  private findItem(itemId: string): any {
    if (Array.isArray(this.itemList)) {
      const foundItem = this.itemList.find(item => item.id === itemId);
      return foundItem ? this.selectionLabel(foundItem) : '';
    }
  }

  private isEnum(): boolean {
    return this.itemEnum == null ? false : true;
  }

  private selectionLabel(item: any): any {
    return this.isLanguage ? `${item.name} [${item.id}]` : item.name;
  }

  private sortChipsList(keys: any[]): { id: any; name: any }[] {
    return keys
      .map(key => ({ id: key, name: this.getItem(key) }))
      .sort(this.sortingService.sortByName);
  }
}
