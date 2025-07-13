import { Component, Input } from '@angular/core';

@Component({
  selector: 'gp-services-chip',
  templateUrl: './services-chip.component.html',
  styleUrls: ['./services-chip.component.scss']
})
export class ServicesChipComponent {
  @Input()
  name: string;

  constructor() {}
}
