import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[gpContent]'
})
export class ContentDirective {
  constructor(private elementRef: ElementRef) {
    this.applyStyle();
  }
  private applyStyle(): void {
    this.elementRef.nativeElement.style.backgroundColor = 'white';
    this.elementRef.nativeElement.style.padding = '30px 30px 50px';
    this.elementRef.nativeElement.style.marginTop = '40px';
  }
}
