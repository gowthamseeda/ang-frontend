/*
This CustomEncoder overrides the encoder used in HttpClient from angular/commons/http and
solves following issue https://shared-jira.mercedes-benz.polygran.de/browse/GSSNPLUS-2967.

Bug is already reported to gitHub, but currently not merged.
Follow https://github.com/angular/angular/issues/18261.
 */
import { HttpParameterCodec } from '@angular/common/http';

export class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
