import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[gpEnableIfMarkedForHighlighting]'
})
export class EnableIfMarkedForHighlightingDirective implements OnInit {
  fieldValue: string | string[];

  constructor(private template: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  ngOnInit(): void {
    if (this.isSearchValueHighlighted()) {
      this.viewContainer.createEmbeddedView(this.template);
    } else {
      this.viewContainer.clear();
    }
  }

  @Input()
  set gpEnableIfMarkedForHighlighting(fieldValue: string | string[]) {
    this.fieldValue = fieldValue;
  }

  private isSearchValueHighlighted(): boolean {
    if (!this.fieldValue) {
      return false;
    }

    const expression = /\*\*\*/g;

    let matches: string[] = [];

    if (this.fieldValue instanceof Array) {
      this.fieldValue.forEach((val: string) => {
        matches.push(...val.split(expression));
      });
    } else {
      matches = this.fieldValue.split(expression);
    }

    return (matches.length || 0) >= 2;
  }
}
