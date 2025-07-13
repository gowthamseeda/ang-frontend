import { Contract } from './contract.model';
import { offeredServiceMock } from './offered-service.mock';

export const contractMock: Contract[] = [
  {
    contractor: {
      id: 'GS20000001',
      legalName: 'Auto Lang',
      companyId: 'GC00000001'
    },
    contractee: {
      id: 'GS30000001',
      legalName: 'Daimler',
      street: 'Mercedesstraße',
      streetNumber: '120',
      zipCode: '70372',
      city: 'Stuttgart',
      country: 'Germany'
    },
    offeredService: offeredServiceMock[0]
  },
  {
    contractor: {
      id: 'GS20000001',
      legalName: 'Auto Lang',
      companyId: 'GC00000001'
    },
    contractee: {
      id: 'GS30000001',
      legalName: 'Daimler',
      street: 'Mercedesstraße',
      streetNumber: '120',
      zipCode: '70372',
      city: 'Stuttgart',
      country: 'Germany'
    },
    offeredService: offeredServiceMock[2]
  }
];
