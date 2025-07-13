import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'gp-social-media-icon',
  templateUrl: './social-media-icon.component.html',
  styleUrls: ['./social-media-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialMediaIconComponent {
  @Input() disabled = false;
  @Input()
  set socialMediaChannelId(socialMediaChannelId: string) {
    this.iconName = `social-${socialMediaChannelId.toLowerCase()}`;
  }
  @Input()
  set active(active: boolean) {
    active ? (this.color = 'petrol') : (this.color = 'darkgray');
  }
  @Input()
  tooltip: string;
  @Input()
  tooltipPosition: string;

  iconName: string;
  color: string;
}
