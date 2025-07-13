import { TestBed } from '@angular/core/testing';
import { FormBuilder, ValidatorFn } from '@angular/forms';
import { CommunicationChannel } from '../../../app/communication/model/communication-channel.model';

import { CommunicationFieldFormat } from '../../communication/model/communication-field-format';

import { CommunicationChannelsValidators } from './communication-channels-validators';

class CommunicationChannelsValidatorMock {
  validator: ValidatorFn | ValidatorFn[] | null;

  setValidator(validatorFn: ValidatorFn | ValidatorFn[] | null) {
    this.validator = validatorFn;
  }

  validate(name: string, channel: CommunicationChannel): boolean {
    const communicationChannelsFromGroup = new FormBuilder().group({
      name: channel.id,
      value: channel.value,
      format: channel.format
    });

    communicationChannelsFromGroup.controls[name].setValidators(this.validator);
    communicationChannelsFromGroup.controls[name].updateValueAndValidity();
    return communicationChannelsFromGroup.controls[name].valid;
  }
}

describe('CommunicationChannelsValidators', () => {
  let validatorMock: CommunicationChannelsValidatorMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder]
    });

    validatorMock = new CommunicationChannelsValidatorMock();
  });

  it('should create an instance', () => {
    expect(new CommunicationChannelsValidators()).toBeTruthy();
  });

  it('should validate the URL with http', () => {
    const validator = CommunicationChannelsValidators.urlValidator();
    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'http://www.daimler.com/gssnplus/is/cool',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should validate the URL with www', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'www.daimler.com',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept URLs with upper-cased letters', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'Http://Daimler.CoM',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept URLs with hypens', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'Http://hello-world.com',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept URLs with subdomains', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'gssnplus.i.daimler.com',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept URLs with path', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'daimler.com/gssnplus/outlet/GS0016853',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept URLs with trailing slash', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'daimler.com/',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept URLs with request parameters', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'daimler.com/gssnplus/index.html?outlet=GS0016853&service=7',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept URLs with anchor', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'daimler.com/gssnplus/index.html#BaseData',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept complex URL example from GSSN+', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value:
        'https://gssnplus-int.e.corpintra.net/dev/app/outlet/GS0015616/services/opening-hours?productCategoryId=1&serviceId=7#SpecialOpeningHours',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept complex URL example from Google', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value:
        'https://www.google.com/search?ei=0pS_X6vBA4iOlwSYraf4Aw&q=hello%20world&oq=hello+world&gs_lcp=CgZwc3ktYWIQAzICCAAyBQguELEDMgIIADICCAAyAggAMgIIADICCAAyAggAMgIIADICCAA6EQgAELADEIoDELcDEOUCEIsDOggIABCxAxCDAToFCAAQsQM6CAguELEDEIMBOgIILjoECAAQQzoHCC4QsQMQQzoHCAAQsQMQQzoHCC4QQxCTAjoECC4QQzoKCC4QsQMQQxCTAjoFCC4QkwI6BwgAELEDEAo6BAgAEApQyCNY1jVg3jZoBHAAeACAAcQBiAGQCZIBAzguNJgBAKABAaoBB2d3cy13aXrIAQq4AQLAAQE&sclient=psy-ab&ved=0ahUKEwir8sjkkKDtAhUIx4UKHZjWCT8Q4dUDCA0&uact=5',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should accept some special URLs from GSSN classic', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const URLs = [
      'http://swanhilltruckservice.websyte.com.au/site.cfm?/swanhilltruckservice/1/',
      'http://www.thetruckshop.net/portland/?portland',
      'https://www.facebook.com/1477997149080650/photos/a.1496408407239524/2197084713838553/?type=3&theater',
      'https://www.youtube.com/channel/UCxGCxMo0QcMNRMWLm9yL8Vg'
    ];

    URLs.forEach((url: string) => {
      const channel: CommunicationChannel = {
        id: 'INTERNET_ADDRESS',
        value: url,
        format: CommunicationFieldFormat.URL
      };

      validatorMock.setValidator(validator);
      const isValid = validatorMock.validate('value', channel);

      if (!isValid) {
        console.log(url);
      }

      expect(isValid).toBeTruthy();
    });
  });

  it('should reject some special URLs from GSSN classic', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const URLs = [
      'http://www.selectrucks.com.ar/#', // Hash at end
      'http://www.facebook.com//ZimbrickEuropean', // Double Slash
      'https://www.facebook.com/Motor-Car-Prešov-spol-s-ro-145883592149876/', // Character with diacrytics
      'https://www.facebook.com/pages/Mercedes-Benz-Niederlassung-Düsseldorf/169899279697983' // German umlaut
    ];

    URLs.forEach((url: string) => {
      const channel: CommunicationChannel = {
        id: 'INTERNET_ADDRESS',
        value: url,
        format: CommunicationFieldFormat.URL
      };

      validatorMock.setValidator(validator);
      const isValid = validatorMock.validate('value', channel);

      if (isValid) {
        console.log(url);
      }

      expect(isValid).toBeFalsy();
    });
  });

  it('should check invalid URL', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'justAnInvalidUrl',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeFalsy();
  });

  it('should check invalid URL with htp', () => {
    const validator = CommunicationChannelsValidators.urlValidator();

    const channel: CommunicationChannel = {
      id: 'INTERNET_ADDRESS',
      value: 'htp://www.daimler.com',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeFalsy();
  });

  it('should validate a telephone number', () => {
    const validator = CommunicationChannelsValidators.telephoneNumberValidator();
    const channel: CommunicationChannel = {
      id: 'TELEPHONE',
      value: '017384939020',
      format: CommunicationFieldFormat.TEL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should validate a telephone number with country code', () => {
    const validator = CommunicationChannelsValidators.telephoneNumberValidator();
    const channel: CommunicationChannel = {
      id: 'TELEPHONE',
      value: '+49-17384939020',
      format: CommunicationFieldFormat.TEL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should validate a telephone number with country code in parenthesis', () => {
    const validator = CommunicationChannelsValidators.telephoneNumberValidator();
    const channel: CommunicationChannel = {
      id: 'TELEPHONE',
      value: '(+49)-17384939020',
      format: CommunicationFieldFormat.TEL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should validate a telephone number with various separators', () => {
    const validator = CommunicationChannelsValidators.telephoneNumberValidator();
    const channel: CommunicationChannel = {
      id: 'TELEPHONE',
      value: '+49-17\\38/49.39 02-0',
      format: CommunicationFieldFormat.TEL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should validate a local telephone number', () => {
    const validator = CommunicationChannelsValidators.telephoneNumberValidator();
    const channel: CommunicationChannel = {
      id: 'TELEPHONE',
      value: '0731-9390-20',
      format: CommunicationFieldFormat.TEL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });

  it('should check an invalid telephone number', () => {
    const validator = CommunicationChannelsValidators.telephoneNumberValidator();
    const channel: CommunicationChannel = {
      id: 'TELEPHONE',
      value: '3490-not-a-number',
      format: CommunicationFieldFormat.TEL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeFalsy();
  });

  it('should check an invalid social media URL which contains only of the template', () => {
    const validator = CommunicationChannelsValidators.socialMediaChannelTemplateValidator('https://facebook.com');
    const channel: CommunicationChannel = {
      id: 'FACEBOOK',
      value: 'https://facebook.com',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeFalsy();
  });

  it('should check a valid social media URL with account ID', () => {
    const validator = CommunicationChannelsValidators.socialMediaChannelTemplateValidator('https://facebook.com');
    const channel: CommunicationChannel = {
      id: 'FACEBOOK',
      value: 'https://facebook.com/hello',
      format: CommunicationFieldFormat.URL
    };

    validatorMock.setValidator(validator);
    const isValid = validatorMock.validate('value', channel);
    expect(isValid).toBeTruthy();
  });
});
