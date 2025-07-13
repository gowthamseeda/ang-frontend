import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren
} from '@angular/core';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'gp-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnChanges {
  @Input()
  inputVal: string;
  @Input()
  listItems: string[];
  @Input()
  isHidden: boolean;
  @Input()
  keyupArrowdownEvent: KeyboardEvent;
  @Output()
  itemSelect = new EventEmitter();

  @ViewChildren(MatOption)
  list: QueryList<MatOption>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.keyupArrowdownEvent && changes.keyupArrowdownEvent.currentValue) {
      this.selectMatOptionByKeyboard(this.keyupArrowdownEvent);
    }
  }

  selectMatOptionByKeyboard(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') {
      return;
    }
    const listItems = this.list.toArray();
    for (let index = 0; index < listItems.length; index++) {
      if (listItems[index].selected) {
        switch (event.key) {
          case 'Enter': {
            this.itemSelect.emit(listItems[index].viewValue);
            break;
          }
          case 'ArrowDown': {
            if (index + 1 < listItems.length) {
              this.focusListItem(listItems, index, 'next');
            }
            break;
          }
          case 'ArrowUp': {
            if (index > 0) {
              this.focusListItem(listItems, index, 'prev');
            }
            break;
          }
        }
        break;
      } else if (listItems.length === index + 1) {
        this.focusListItem();
      }
    }
  }

  selectMatOptionByMousemove(matOptionIndex: number): void {
    this.list.forEach((listItem, index) => {
      listItem.deselect();
      if (index === matOptionIndex) {
        listItem.select();
        listItem.focus();
      }
    });
  }

  deselectMatOptions(): void {
    this.list.forEach(listItem => {
      listItem.deselect();
    });
  }

  emitValue(value: string): void {
    if (value.trim().length >= 3) {
      this.itemSelect.emit(value);
    }
  }

  private focusListItem(listItems?: any, index?: any, direction?: any): void {
    if (direction === 'next') {
      listItems[index].deselect();
      listItems[index + 1].select();
      listItems[index + 1].focus();
    } else if (direction === 'prev') {
      listItems[index].deselect();
      listItems[index - 1].select();
      listItems[index - 1].focus();
    } else {
      this.list.first.select();
      this.list.first.focus();
    }
  }
}
