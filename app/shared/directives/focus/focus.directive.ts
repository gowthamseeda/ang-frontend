import { AfterViewInit, Directive, ElementRef } from '@angular/core';

/**
 * HTML5 autofocus directive will only be interpreted once on page load.
 * This directive however, sets an focus on the element on every view init.
 */
@Directive({
  selector: '[gpFocus]'
})
export class FocusDirective implements AfterViewInit {
  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
    // workaround since input element does not seem to be ready for a focus
    setTimeout(() => {
      this.element.nativeElement.focus();
    }, 100);
  }
}
