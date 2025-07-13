import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[gpIconButtonWithText]'
})
export class IconButtonWithTextDirective {
  constructor(element: ElementRef) {
    element.nativeElement.style.marginLeft = '5px';
  }
}
