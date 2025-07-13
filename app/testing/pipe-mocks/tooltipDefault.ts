import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tooltipDefault'
})
export class TooltipDefaultPipeMock implements PipeTransform {
  transform(value: string): any {
    return value;
  }
}
