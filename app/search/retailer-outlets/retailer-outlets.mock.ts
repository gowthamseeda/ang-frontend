export function getDaimlerTSSRetailerOutletMock(): any {
  return {
    id: 'GS20000016',
    type: 'BusinessSite',
    payload: {
      active: true,
      activeOrInPlanning: true,
      adamIds: [],
      affiliate: false,
      brandCodes: [],
      brands: [],
      businessNames: [],
      city: 'Berlin',
      companyId: 'GC00000016',
      countryId: 'DE',
      countryName: 'Germany',
      id: '***GS20000016***',
      legalName: 'Daimler TSS Berlin',
      mainOutlet: false,
      offeredServices: [],
      registeredOffice: true,
      street: 'Berliner Str.',
      streetNumber: '666',
      subOutlet: false,
      undefined: true,
      zipCode: '10001'
    }
  };
}

export function getAutoLangRetailerOutletMock(): any {
  return {
    id: 'GS20000001',
    type: 'BusinessSite',
    payload: {
      active: true,
      activeOrInPlanning: true,
      adamIds: [],
      affiliate: false,
      brandCodes: [],
      brands: [],
      businessNames: [],
      city: 'Kreuzlingen',
      companyId: 'GC00000001',
      countryId: 'CH',
      countryName: 'Switzerland',
      id: '***GS20000001***',
      legalName: 'Auto Lang AG',
      mainOutlet: false,
      offeredServiceCharacteristics: [],
      offeredServices: [],
      registeredOffice: false,
      subOutlet: false,
      undefined: true
    }
  };
}

export function getAutoLangRetailerOutletWithNotificationMock(): any {
  return {
    id: 'GS20000001',
    type: 'BusinessSite',
    payload: {
      active: true,
      activeOrInPlanning: true,
      adamIds: [],
      affiliate: false,
      brandCodes: [],
      brands: [],
      businessNames: [],
      city: 'Kreuzlingen',
      companyId: 'GC00000001',
      countryId: 'CH',
      countryName: 'Switzerland',
      id: '***GS20000001***',
      legalName: 'Auto Lang AG',
      mainOutlet: false,
      offeredServiceCharacteristics: [],
      offeredServices: [],
      registeredOffice: false,
      subOutlet: false,
      undefined: true,
      notification:true,
      notificationType: 'VERIFICATION_TASK\n'
    }
  };
}
