import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { formatTime } from '../../util/opening-hours-formatter';

export const TIME_PATTERN_24 = '[0-9]{1,2}:[0-9]{2}';
export const TIME_PATTERN_12 = '((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))';
export const EMPTY_PATTERN = '^$';

const timeIsLessOrEqualOrZeroByValue = (
  first: string,
  second: string,
  allowEqual: boolean = false
): boolean => {
  const firstNumber = Number(first.replace(':', '.'));
  const secondNumber = Number(second.replace(':', '.'));
  return allowEqual ? firstNumber <= secondNumber : firstNumber < secondNumber;
};

export const validateCrossingTimeRange: ValidatorFn = (
  control: UntypedFormGroup
): ValidationErrors | null => {
  let isValid = true;
  const firstEnabled = control.get(['times', '0', 'enabled']);
  const secondEnabled = control.get(['times', '1', 'enabled']);
  const thirdEnabled = control.get(['times', '2', 'enabled']);
  const firstEnabledValue = firstEnabled && firstEnabled.value === true;
  const secondEnabledValue = secondEnabled && secondEnabled.value === true;
  const thirdEnabledValue = thirdEnabled && thirdEnabled.value === true;

  if (firstEnabledValue && secondEnabledValue) {
    const firstEnd = control.get(['times', '0', 'end']);
    const secondBegin = control.get(['times', '1', 'begin']);

    if (firstEnd?.value && secondBegin?.value) {
      const firstEndTime = formatTime(firstEnd?.value);
      const secondBeginTime = formatTime(secondBegin?.value);
      isValid = isValid && timeIsLessOrEqualOrZeroByValue(firstEndTime, secondBeginTime, true);
    }
  }

  if (thirdEnabledValue) {
    const firstEnd = control.get(['times', '0', 'end']);
    const secondEnd = control.get(['times', '1', 'end']);
    const thirdBegin = control.get(['times', '2', 'begin']);

    if (thirdBegin?.value) {
      const firstEndTime = formatTime(firstEnd?.value);
      const secondEndTime = formatTime(secondEnd?.value);
      const thirdBeginTime = formatTime(thirdBegin?.value);
      isValid =
        isValid &&
        timeIsLessOrEqualOrZeroByValue(firstEndTime, thirdBeginTime, true) &&
        timeIsLessOrEqualOrZeroByValue(secondEndTime, thirdBeginTime, true);
    }
  }

  return isValid ? null : { crossingTimeRange: true };
};

export const validateBeginIsBeforeEnd: ValidatorFn = (
  control: UntypedFormGroup
): ValidationErrors | null => {
  let isValid = true;
  const enabled = control.get('enabled');

  if (enabled && enabled.value === true) {
    const begin = control.get('begin') as UntypedFormControl;
    const end = control.get('end') as UntypedFormControl;
    const beginValue = begin.value;
    const endValue = end.value;

    if (beginValue !== '' || endValue !== '') {
      const beginTime = formatTime(beginValue);
      const endTime = formatTime(endValue);
      isValid = timeIsLessOrEqualOrZeroByValue(beginTime, endTime);
    }
  }
  return isValid ? null : { faultyTimeRange: true };
};

export const validateValueRange: ValidatorFn = (control: UntypedFormGroup): ValidationErrors | null => {
  let isValid = true;
  const timeValue = control.value;

  if (timeValue) {
    if (timeValue.match(TIME_PATTERN_12)) {
      const split = timeValue.split(':');
      const hours = split[0];
      const mins = split[1].split(' ')[0];
      const format = split[1].split(' ')[1];

      const singleDigitHour = parseInt(hours, 10) >= 0 && parseInt(hours, 10) <= 9;
      const doubleDigitHour = parseInt(hours, 10) >= 10 && parseInt(hours, 10) <= 12;
      const validHour = singleDigitHour || doubleDigitHour;
      const validMinutes = parseInt(mins, 10) >= 0 && parseInt(mins, 10) <= 59;
      const validFormat = format === 'AM' || format === 'PM';

      isValid = isValid && split.length === 2;
      isValid = isValid && validHour;
      isValid = isValid && validMinutes;
      isValid = isValid && validFormat;
    } else if (timeValue.match(TIME_PATTERN_24)) {
      const split = timeValue.split(':');
      const hours = split[0];
      const mins = split[1];

      const validHour = parseInt(hours, 10) >= 0 && parseInt(hours, 10) <= 23;
      const validMinutes = parseInt(mins, 10) >= 0 && parseInt(mins, 10) <= 59;

      isValid = isValid && split.length === 2;
      isValid = isValid && validHour;
      isValid = isValid && validMinutes;
    } else if (!timeValue.match(EMPTY_PATTERN)) {
      isValid = false;
    }
  }

  return isValid ? null : { invalidValueRange: true };
};
