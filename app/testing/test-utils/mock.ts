import { clone } from 'ramda';

export abstract class Mock {
  static mock: { [id: string]: any };

  static asList(): any[] {
    return clone(Object.keys(this.mock).map(key => this.mock[key]));
  }

  static asMap(): { [id: string]: any } {
    return clone(this.mock);
  }
}
