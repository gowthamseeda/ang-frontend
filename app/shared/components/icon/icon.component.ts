import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'gp-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input()
  name?: string;
  @Input()
  disabled?: boolean;
  @Input()
  size?: 'tiny' | 'small' | 'medium' | 'large';
  @Input()
  color?: 'darkgray' | 'warn' | 'petrol' | 'white' | 'green' | 'red';
  @Input()
  hover: boolean;
  @Input()
  actionable?: boolean;

  @HostBinding('class.gp-icon')
  gpIcon = true;
}
