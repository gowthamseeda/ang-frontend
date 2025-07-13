import { Component } from '@angular/core';

import { LEARNING_CENTER_LINK } from '../../help.constants';

@Component({
  selector: 'gp-help-training-support',
  templateUrl: './help-training-support.component.html',
  styleUrls: ['./help-training-support.component.scss']
})
export class HelpTrainingSupportComponent {
  link = LEARNING_CENTER_LINK;

  constructor() {}

  linkOut(): void {
    window.open(this.link, '_blank');
  }
}
