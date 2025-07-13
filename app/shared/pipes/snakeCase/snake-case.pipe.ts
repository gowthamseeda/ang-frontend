import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'snakeCase',
  pure: false
})
export class SnakeCasePipe implements PipeTransform {

  transform(value: any, toUpper: boolean = true): string {
    return toUpper ? _.snakeCase(value).toUpperCase() : _.snakeCase(value);
  }
}
