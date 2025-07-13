import { formatMeridiem } from './dates';

describe('Dates', () => {
  describe('formatMeridiem', () => {
    it('should format date string to Meridiem format.', () => {
      const dateStr = '2019-04-11 14:24:57.189';
      const formattedStr = formatMeridiem(dateStr);

      expect(formattedStr).toEqual('Thu Apr 11 2019 2:24:57.189 PM');
    });
  });
});
