import { FormControl } from '@angular/forms';
import { BusinessSiteIds, BusinessSiteSelectValidator } from './business-site-select-validator';

describe('BusinessSiteSelectValidator', () => {
  describe('validateBusinessSiteId()', () => {
    it('should give no error if selected businessSite exists', () => {
      const formControl = new FormControl('GS00000001');
      const businessSiteId: BusinessSiteIds = {
        ids: ['GS00000001', 'GS00000002']
      };
      expect(
        BusinessSiteSelectValidator.validateBusinessSiteId(businessSiteId)(formControl)
      ).toBeNull();
    });

    it('should give not error if selected businessSite is empty', () => {
      const formControl = new FormControl('');
      const businessSiteId: BusinessSiteIds = {
        ids: ['GS00000001', 'GS00000002']
      };
      expect(
        BusinessSiteSelectValidator.validateBusinessSiteId(businessSiteId)(formControl)
      ).toBeUndefined();
    });

    it('should give error if selected businessSite not exists', () => {
      const formControl = new FormControl('GS');
      const businessSiteId: BusinessSiteIds = {
        ids: ['GS00000001', 'GS00000002']
      };
      expect(
        BusinessSiteSelectValidator.validateBusinessSiteId(businessSiteId)(formControl)
      ).toEqual({
        validateBusinessSiteId: {
          valid: false
        }
      });
    });
  });
});
