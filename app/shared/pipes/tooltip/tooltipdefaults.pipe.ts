import { Pipe, PipeTransform } from '@angular/core';

import { tooltipdefaults } from './tooltipdefaults';

@Pipe({
  name: 'tooltipDefault'
})
export class TooltipDefaultPipe implements PipeTransform {
  transform(value: string): any {
    switch (value) {
      case 'position':
        return tooltipdefaults.position;
      case 'showDelay':
        return tooltipdefaults.showdelay;
      case 'hideDelay':
        return tooltipdefaults.hidedelay;
      default:
        throw new Error('Unexpected parameter ' + value);
    }
  }
}
