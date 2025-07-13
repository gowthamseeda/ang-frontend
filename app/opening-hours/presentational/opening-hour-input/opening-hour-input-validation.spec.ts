import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {
  validateBeginIsBeforeEnd,
  validateCrossingTimeRange,
  validateValueRange
} from './opening-hour-input-validation';

describe('Opening-Hour-Form-Validation', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    formBuilder = new FormBuilder();
  });

  describe('a single time value in 12 a clock format', () => {
    it('is valid with correct format an value range', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('00:00 AM', [validateValueRange]),
        zeroTimeShort: new FormControl('0:00 AM', [validateValueRange]),
        normalTime: new FormControl('09:05 AM', [validateValueRange]),
        normalTimeShort: new FormControl('9:05 AM', [validateValueRange]),
        finalTime: new FormControl('11:59 PM', [validateValueRange])
      });
      expect(group.valid).toBe(true);
    });

    it('is valid with single digit hour and AM', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('1:23 AM', [validateValueRange])
      });
      expect(group.valid).toBe(true);
    });

    it('is valid with single digit hour and PM', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('1:23 PM', [validateValueRange])
      });
      expect(group.valid).toBe(true);
    });

    it('is invalid with wrong format separator', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('00-00 AM', [validateValueRange])
      });
      expect(group.valid).toBe(false);
    });

    it('is invalid with wrong format containing letters', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('0a:0z PM', [validateValueRange])
      });
      expect(group.valid).toBe(false);
    });

    it('is invalid with to large hours value', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('13:00 AM', [validateValueRange])
      });
      expect(group.valid).toBe(false);
    });

    it('is invalid with to large minutes value', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('11:60 AM', [validateValueRange])
      });
      expect(group.valid).toBe(false);
    });
  });

  describe('a single time value in 24 a clock format', () => {
    it('is valid with correct format an value range', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('00:00', [validateValueRange]),
        zeroTimeShort: new FormControl('0:00', [validateValueRange]),
        normalTime: new FormControl('09:05', [validateValueRange]),
        normalTimeShort: new FormControl('9:05', [validateValueRange]),
        finalTime: new FormControl('23:59', [validateValueRange])
      });
      expect(group.valid).toBe(true);
    });

    it('is valid with double digit hour and AM', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('12:00 AM', [validateValueRange])
      });
      expect(group.valid).toBe(true);
    });

    it('is valid with double digit hour and PM', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('12:00 PM', [validateValueRange])
      });
      expect(group.valid).toBe(true);
    });

    it('is invalid with wrong format separator', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('00-00', [validateValueRange])
      });
      expect(group.valid).toBe(false);
    });

    it('is invalid with wrong format containing letters', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('0a:0z', [validateValueRange])
      });
      expect(group.valid).toBe(false);
    });

    it('is invalid with to large hours value', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('24:00', [validateValueRange])
      });
      expect(group.valid).toBe(false);
    });

    it('is invalid with to large minutes value', () => {
      const group: FormGroup = formBuilder.group({
        zeroTime: new FormControl('11:60', [validateValueRange])
      });
      expect(group.valid).toBe(false);
    });
  });

  describe('two time values in 12 hour clock format', () => {
    it('are valid if end is after begin', () => {
      const group: FormGroup = formBuilder.group(
        {
          begin: new FormControl('10:15 AM'),
          end: new FormControl('6:45 PM'),
          enabled: new FormControl(true)
        },
        { validators: validateBeginIsBeforeEnd }
      );
      expect(group.valid).toBe(true);
    });

    it('are invalid if end is equal to begin', () => {
      const group: FormGroup = formBuilder.group(
        {
          begin: new FormControl('10:00 AM'),
          end: new FormControl('10:00 AM'),
          enabled: new FormControl(true)
        },
        { validators: validateBeginIsBeforeEnd }
      );
      expect(group.valid).toBe(false);
    });

    it('are invalid if end is before begin', () => {
      const group: FormGroup = formBuilder.group(
        {
          begin: new FormControl('9:00 PM'),
          end: new FormControl('5:00 PM'),
          enabled: new FormControl(true)
        },
        { validators: validateBeginIsBeforeEnd }
      );
      expect(group.valid).toBe(false);
    });
  });

  describe('two time values in 24 hour clock format', () => {
    it('are valid if end is after begin', () => {
      const group: FormGroup = formBuilder.group(
        {
          begin: new FormControl('10:15'),
          end: new FormControl('18:45'),
          enabled: new FormControl(true)
        },
        { validators: validateBeginIsBeforeEnd }
      );
      expect(group.valid).toBe(true);
    });

    it('are invalid if end is equal to begin', () => {
      const group: FormGroup = formBuilder.group(
        {
          begin: new FormControl('0:00'),
          end: new FormControl('0:00'),
          enabled: new FormControl(true)
        },
        { validators: validateBeginIsBeforeEnd }
      );
      expect(group.valid).toBe(false);
    });

    it('are invalid if end is before begin', () => {
      const group: FormGroup = formBuilder.group(
        {
          begin: new FormControl('09:00'),
          end: new FormControl('05:00'),
          enabled: new FormControl(true)
        },
        { validators: validateBeginIsBeforeEnd }
      );
      expect(group.valid).toBe(false);
    });
  });

  describe('two opening hours in 12 hour clock format', () => {
    let times: FormArray;
    beforeEach(() => {
      times = formBuilder.array([]);
    });

    it('are valid if they do not cross each other', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00 AM'),
          end: new FormControl('11:15 AM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:30 AM'),
          end: new FormControl('6:00 PM'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });

    it('are valid if they end and start at same time', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00 AM'),
          end: new FormControl('11:15 AM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:15 AM'),
          end: new FormControl('6:00 PM'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });

    it('are invalid if they cross each other', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00 AM'),
          end: new FormControl('11:45 AM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:30 AM'),
          end: new FormControl('6:00 PM'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(false);
    });
  });

  describe('two opening hours in 24 hour clock format', () => {
    let times: FormArray;
    beforeEach(() => {
      times = formBuilder.array([]);
    });

    it('are valid if they do not cross each other', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00'),
          end: new FormControl('11:15'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:30'),
          end: new FormControl('18:00'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });

    it('are valid if they end and start at same time', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00'),
          end: new FormControl('11:15'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:15'),
          end: new FormControl('18:00'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });

    it('are invalid if they cross each other', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00'),
          end: new FormControl('11:45'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:30'),
          end: new FormControl('18:00'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(false);
    });

    it('are valid if they are not cross each other and start with 0:00', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('00:00'),
          end: new FormControl('11:45'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:55'),
          end: new FormControl('18:00'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });
  });

  describe('three opening hours in 12 hour clock format', () => {
    let times: FormArray;
    beforeEach(() => {
      times = formBuilder.array([]);
    });

    it('are valid if they do not cross each other', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00 AM'),
          end: new FormControl('11:15 AM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:30 AM'),
          end: new FormControl('6:00 PM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('6:15 PM'),
          end: new FormControl('9:00 PM'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });

    it('are valid if they end and start at same time', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00 AM'),
          end: new FormControl('11:15 AM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:15 AM'),
          end: new FormControl('6:00 PM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('6:00 PM'),
          end: new FormControl('9:00 PM'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });

    it('are invalid if they cross each other', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00 AM'),
          end: new FormControl('11:45 AM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('12:00 PM'),
          end: new FormControl('6:00 PM'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('3:00 PM'),
          end: new FormControl('9:00 PM'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(false);
    });
  });

  describe('three opening hours in 24 hour clock format', () => {
    let times: FormArray;
    beforeEach(() => {
      times = formBuilder.array([]);
    });

    it('are valid if they do not cross each other', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00'),
          end: new FormControl('11:15'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:30'),
          end: new FormControl('18:00'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('18:15'),
          end: new FormControl('21:00'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });

    it('are valid if they end and start at same time', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00'),
          end: new FormControl('11:15'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('11:15'),
          end: new FormControl('18:00'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('18:00'),
          end: new FormControl('21:00'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(true);
    });

    it('are invalid if they cross each other', () => {
      times.push(
        formBuilder.group({
          begin: new FormControl('9:00'),
          end: new FormControl('11:45'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('12:00'),
          end: new FormControl('18:00'),
          enabled: new FormControl(true)
        })
      );
      times.push(
        formBuilder.group({
          begin: new FormControl('15:00'),
          end: new FormControl('21:00'),
          enabled: new FormControl(true)
        })
      );
      const group: FormGroup = formBuilder.group(
        {
          groupId: 'anyId',
          closed: true,
          times: times
        },
        { validators: validateCrossingTimeRange }
      );
      expect(group.valid).toBe(false);
    });
  });
});
