import { OutletLeadingCodesPipe } from './outlet-leading-codes.pipe';

const brandCodesMock = [
  {
    brandCode: '10000001',
    brandId: 'MB'
  },
  {
    brandCode: '10000002',
    brandId: 'SMT'
  }
];

const businessNamesMock = [
  {
    businessName: 'Test',
    brandId: 'MB'
  },
  {
    businessName: 'Test2',
    brandId: 'SMT'
  }
];

const brandsMock = [
  {
    id: 'MB',
    name: 'Mercedes Benz'
  },
  {
    id: 'SMT',
    name: 'Smart'
  }
];

describe('OutletLeadingCodesPipe', () => {
  const pipe = new OutletLeadingCodesPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform brand codes', () => {
    const actual = pipe.transform(brandCodesMock, 'brandCode', brandsMock);

    expect(actual).toEqual('•   10000001 (Mercedes Benz)\n•   10000002 (Smart)\n');
  });

  it('should transform business names', () => {
    const actual = pipe.transform(businessNamesMock, 'businessName', brandsMock);

    expect(actual).toEqual('•   Test (Mercedes Benz)\n•   Test2 (Smart)\n');
  });

  it('should handle missing brands', () => {
    const actual = pipe.transform(brandCodesMock, 'brandCode');

    expect(actual).toEqual('•   10000001 (MB)\n•   10000002 (SMT)\n');
  });
});
