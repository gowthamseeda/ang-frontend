export const sisterOutletMock = {
  sisterOutlets: [
    {
      id: 'GS01',
      companyId: 'GC01',
      legalName: 'ABC Sdn Bhd',
      address: {
        street: 'Jalan abc',
        streetNumber: '12A',
        zipCode: '12340',
        addressAddition: 'asdasd',
        city: "Johor Bahru, Johor Darul Ta'zim",
        district: 'Selangorrrrrr',
        countryId: 'MY'
      },
      // registeredOffice: false,
      // mainOutlet: false,
      // subOutlet: false,
      active: true,
      distributionLevels: ['RETAILER']
    }
  ],
};
export const offeredServicesMock = [
  {
    id: 'OS2',
    brandId: 'MB',
    productCategoryId: 1,
    productGroupId: 'PC',
    serviceId: 120,
    businessSite: { id: 'GS02' }
  }
];
