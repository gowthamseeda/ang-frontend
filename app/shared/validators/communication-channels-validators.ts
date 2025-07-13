import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class CommunicationChannelsValidators {
  static urlValidator(): ValidatorFn {
    const OR = '|';
    const OPTIONAL = '?';
    const AT_LEAST_ONE = '+';
    const ANY_TIMES = '*';

    const PROTOCOL = '([hH][tT][tT][pP][sS]?://)';

    const DOMAIN_NAME_VALID_CHAR = '[a-zA-Z0-9]';
    const DOMAIN_LENGTH_LIMIT = '{0,63}';
    const HYPHEN = '-';
    const DOT = '\\.';
    const DOMAIN =
      '(' +
      DOMAIN_NAME_VALID_CHAR +
      '(' + HYPHEN + DOMAIN_NAME_VALID_CHAR + OR + DOMAIN_NAME_VALID_CHAR + ')' + DOMAIN_LENGTH_LIMIT + DOT +
      ')' +
      AT_LEAST_ONE;

    const TLD_LENGTH_LIMIT = '{2,10}';
    const TOP_LEVEL_DOMAIN = DOMAIN_NAME_VALID_CHAR + TLD_LENGTH_LIMIT;

    const PATH_ELEMENT_VALID_CHAR = '[a-zA-Z0-9._~!$&\'()*+,;=:@%-]';
    const SLASH = '/';
    const PATH_ELEMENT = '(' + SLASH + PATH_ELEMENT_VALID_CHAR + AT_LEAST_ONE + ')';
    const PATH = '(' + PATH_ELEMENT + ANY_TIMES + SLASH + OPTIONAL + ')';

    const QUESTION_MARK = '\\?';
    const ANY_CHAR = '.';
    // Query parameters are often in the format key=value but don't need to be ...
    const QUERY_PARAMETERS = '(' + QUESTION_MARK + ANY_CHAR + AT_LEAST_ONE + ')';

    const HASH = '#';
    const ANCHOR_NAME = '[a-zA-Z0-9]' + AT_LEAST_ONE;
    const ANCHOR = '(' + HASH + ANCHOR_NAME + ')';

    const URL_REGEXP =
      PROTOCOL +
      OPTIONAL +
      DOMAIN +
      TOP_LEVEL_DOMAIN +
      PATH +
      OPTIONAL +
      QUERY_PARAMETERS +
      OPTIONAL +
      ANCHOR +
      OPTIONAL;
    return Validators.pattern(URL_REGEXP);
  }

  static telephoneNumberValidator(): ValidatorFn {
    const OR = '|';
    const ZERO = '0';
    const NUMBER = '[0-9]';
    const SEPARATOR = '[-. /\\\\]';

    const COUNTRY_CODE = '\\+[0-9]+'; // +49
    const COUNTRY_CODE_IN_PARENTHESIS = '\\(' + COUNTRY_CODE + '\\)'; // (+49)
    const PHONE_NUMBER_PREFIX =
      '(' + COUNTRY_CODE + OR + COUNTRY_CODE_IN_PARENTHESIS + OR + ZERO + ')'; // +49 or (+49) or 0

    const SEPARATOR_AFTER_PREFIX = '(' + SEPARATOR + NUMBER + ')?'; // allows a separator directly after country code prefix, e.g. +49-123456

    const PHONE_NUMBER_WITH_SEPRATORS = '(' + NUMBER + OR + SEPARATOR + NUMBER + ')*'; // allows separators in phone number but prevents a separator at end/beginning

    const PHONE_NUMBER_REGEXP =
      PHONE_NUMBER_PREFIX + SEPARATOR_AFTER_PREFIX + PHONE_NUMBER_WITH_SEPRATORS;

    return Validators.pattern(PHONE_NUMBER_REGEXP);
  }

  static socialMediaChannelTemplateValidator(urlTemplate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.toString();

      if (value === urlTemplate) {
        return {
          validSocialMediaUrl: true
        };
      }

      return null;
    };
  }
}
