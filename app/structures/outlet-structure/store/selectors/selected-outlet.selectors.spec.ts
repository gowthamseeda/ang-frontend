import { selectFirstTwoBrandsOfSelectedOutlet } from './selected-outlet.selectors';

describe('test selectFirstTwoBrandsOfSelectedOutlet', () => {
  const brandIds = ['MB', 'SMT', 'STR', 'FUSO', 'THB', 'BAB', 'FTL', 'WST', 'STG', 'THB', 'MYB'];

  test('outlet without brand-codes', () => {
    const outlet = {
      businessSiteId: 'GS0000001',
      companyId: 'GC0000001',
      legalName: 'Test',
      city: 'Berlin',
      registeredOffice: false,
      mainOutlet: false,
      subOutlet: false,
      brandCodes: []
    };

    const selection = (selectFirstTwoBrandsOfSelectedOutlet.projector as any)(outlet, brandIds);

    expect(selection).toStrictEqual([]);
  });

  test('outlet with one brand-code', () => {
    const outlet = {
      businessSiteId: 'GS0000001',
      companyId: 'GC0000001',
      legalName: 'Test',
      city: 'Berlin',
      registeredOffice: false,
      mainOutlet: false,
      subOutlet: false,
      brandCodes: [
        {
          brandCode: '01948',
          brandId: 'MB'
        }
      ]
    };

    const selection = (selectFirstTwoBrandsOfSelectedOutlet.projector as any)(outlet, brandIds);

    expect(selection).toStrictEqual(['01948']);
  });

  test('outlet with two brand-codes', () => {
    const outlet = {
      businessSiteId: 'GS0000001',
      companyId: 'GC0000001',
      legalName: 'Test',
      city: 'Berlin',
      registeredOffice: false,
      mainOutlet: false,
      subOutlet: false,
      brandCodes: [
        {
          brandCode: '04711',
          brandId: 'SMT'
        },
        {
          brandCode: '01948',
          brandId: 'MB'
        }
      ]
    };

    const selection = (selectFirstTwoBrandsOfSelectedOutlet.projector as any)(outlet, brandIds);

    expect(selection).toStrictEqual(['01948', '04711']);
  });

  test('outlet with more than two brand-codes', () => {
    const outlet = {
      businessSiteId: 'GS0000001',
      companyId: 'GC0000001',
      legalName: 'Test',
      city: 'Berlin',
      registeredOffice: false,
      mainOutlet: false,
      subOutlet: false,
      brandCodes: [
        {
          brandCode: '00815',
          brandId: 'MYB'
        },
        {
          brandCode: '01948',
          brandId: 'MB'
        },
        {
          brandCode: '12345',
          brandId: 'FUSO'
        },
        {
          brandCode: '04711',
          brandId: 'SMT'
        }
      ]
    };

    const selection = (selectFirstTwoBrandsOfSelectedOutlet.projector as any)(outlet, brandIds);

    expect(selection).toStrictEqual(['01948', '04711']);
  });

  test('outlet with brand-codes for same brand-ids', () => {
    const outlet = {
      businessSiteId: 'GS0000001',
      companyId: 'GC0000001',
      legalName: 'Test',
      city: 'Berlin',
      registeredOffice: false,
      mainOutlet: false,
      subOutlet: false,
      brandCodes: [
        {
          brandCode: '01948',
          brandId: 'MYB'
        },
        {
          brandCode: '01948',
          brandId: 'MB'
        },
        {
          brandCode: '04711',
          brandId: 'FUSO'
        },
        {
          brandCode: '01948',
          brandId: 'SMT'
        },
        {
          brandCode: '00815',
          brandId: 'STR'
        }
      ]
    };

    const selection = (selectFirstTwoBrandsOfSelectedOutlet.projector as any)(outlet, brandIds);

    expect(selection).toStrictEqual(['01948', '00815']);
  });
});
