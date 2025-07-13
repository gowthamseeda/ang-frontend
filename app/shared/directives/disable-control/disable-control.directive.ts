import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[gpDisableControl]'
})
export class DisableControlDirective implements OnChanges {
  @Input('gpDisableControl') disableControl: boolean;

  constructor(private ngControl: NgControl) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disableControl']) {
      const action = this.disableControl ? 'disable' : 'enable';
      if (this.ngControl.control && this.ngControl.control[action]) {
        this.ngControl.control[action]();
      }
    }
  }
}
