import { Component, Input } from '@angular/core';

export enum ButtonVariant {
  STROKED,
  ICON
}

@Component({
  selector: 'gp-link-out-button',
  templateUrl: './link-out-button.component.html'
})
export class LinkOutButtonComponent {
  @Input()
  linkOut: string;
  @Input()
  buttonVariant?: ButtonVariant;

  matButtonVariant = ButtonVariant;

  constructor() {}

  goTo(): void {
    window.open(this.linkOut, '_blank');
  }
}
