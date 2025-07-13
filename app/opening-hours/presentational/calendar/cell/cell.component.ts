import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Cell, HighLiteType, Type } from './cell.model';

@Component({
  selector: 'gp-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input()
  data: Cell;
  @Output()
  dayCellClicked = new EventEmitter<Cell>();
  @Output()
  dayCellFocused = new EventEmitter<Cell>();

  constructor() {}

  onMouseClick(): void {
    if (this.data.type === Type.Date) {
      this.dayCellClicked.emit(this.data);
    }
  }

  onMouseEnter(): void {
    if (this.data.type === Type.Date) {
      this.dayCellFocused.emit(this.data);
    }
  }

  isActive(): boolean {
    return this.data && this.data.active;
  }

  isLabelTypeDate(): boolean {
    return this.data && this.data.type === Type.Date;
  }

  isLabelTypeWeekNumber(): boolean {
    return this.data && this.data.type === Type.WeekNumber;
  }

  isLabelTypeWeekDay(): boolean {
    return this.data && this.data.type === Type.WeekDay;
  }

  isHighLiteTypeCurrentDay(): HighLiteType | undefined {
    return this.data && this.data.highLiteTypes.find(type => type === HighLiteType.CurrentDay);
  }

  isHighLiteTypeEventDay(): HighLiteType | undefined {
    return this.data && this.data.highLiteTypes.find(type => type === HighLiteType.EventDay);
  }

  isHighLiteTypeSelected(): HighLiteType | undefined {
    return this.data && this.data.highLiteTypes.find(type => type === HighLiteType.Selected);
  }

  isHighLiteTypeEventStart(): HighLiteType | undefined {
    return this.data && this.data.highLiteTypes.find(type => type === HighLiteType.Start);
  }

  isHighLiteTypeEventEnd(): HighLiteType | undefined {
    return this.data && this.data.highLiteTypes.find(type => type === HighLiteType.End);
  }
}
