import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gp-plus-minus',
  templateUrl: './plus-minus.component.html',
  styleUrls: ['./plus-minus.component.scss']
})
export class PlusMinusComponent {
  @Input()
  isPlus = true;
  @Output()
  plusIconClickedEvent = new EventEmitter<any>();
  @Output()
  minusIconClickedEvent = new EventEmitter<any>();

  constructor() {}

  emitPlusIconClick(): void {
    this.plusIconClickedEvent.emit();
  }

  emitMinusIconClick(): void {
    this.minusIconClickedEvent.emit();
  }
}
