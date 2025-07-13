import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[gpLinkButton]'
})
export class LinkButtonDirective implements OnInit {
  button: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.button = this.elementRef.nativeElement;

    this.applyStyle();
  }

  @HostListener('mouseover')
  onMouseOver(): void {
    this.applyMouseoverStyle();
  }

  @HostListener('mouseout')
  onMouseOut(): void {
    this.applyStyle();
  }

  private applyStyle(): void {
    this.button.style.backgroundColor = 'transparent';
    this.button.style.cursor = 'pointer';
    this.button.style.borderWidth = '0';
    this.button.style.color = '#707070';
  }

  private applyMouseoverStyle(): void {
    this.button.style.color = '#00677f';
  }
}
