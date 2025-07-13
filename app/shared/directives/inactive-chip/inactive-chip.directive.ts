import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[gpInactiveChip]'
})
export class InactiveChipDirective implements OnInit {
  matChip: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.matChip = this.elementRef.nativeElement;
    this.applyStyle();
  }

  private applyStyle(): void {
    this.matChip.style.borderColor = '#9e9e9e';
    this.matChip.style.color = '#9e9e9e';
    this.matChip.style.marginLeft = '4px';
  }
}
