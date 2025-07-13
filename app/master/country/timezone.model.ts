export class Timezone {
  utcOffset: string;
  names: string[];

  constructor(utcOffset: string, names: string[]) {
    this.utcOffset = utcOffset;
    this.names = names;
  }
}
