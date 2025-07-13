import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[gpScrollToView]'
})
export class ScrollToViewDirective implements AfterViewInit {
  @Input('gpScrollToView') classSelector: string;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const element: Element = this.elementRef.nativeElement;
    if (element.classList.contains(this.classSelector)) {
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }
}
