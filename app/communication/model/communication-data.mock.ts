import { GeneralCommunicationData, ServiceCommunicationData } from './communication-data.model';

export const serviceCommunicationDataMock: ServiceCommunicationData[] = [
  {
    offeredServiceId: 'GS00000001-1',
    communicationFieldId: 'URL',
    value: 'http://foo.bar',
    oldvalue: 'http://foo.bar',
    newvalue: 'http://foo.bar'
    
  },
  {
    offeredServiceId: 'GS00000001-1',
    communicationFieldId: 'TEL',
    value: '004912345',
    oldvalue: '004912345',
    newvalue: '004912345'
  },
  {
    offeredServiceId: 'GS20000001-10',
    communicationFieldId: 'TEL',
    value: '004912345',
    oldvalue: '004912345',
    newvalue: '004912345'
  },
  {
    offeredServiceId: 'GS20000001-1',
    communicationFieldId: 'INSTAGRAM',
    value: 'http://instagram.com/GS20000001-1',
    oldvalue: 'http://instagram.com/GS20000001-1',
    newvalue: 'http://instagram.com/GS20000001-1'
  }
];

export const generalCommunicationDataMock: GeneralCommunicationData[] = [
  {
    communicationFieldId: 'URL',
    value: 'http://foo.bar',
    brandId: 'MB'
  },
  {
    communicationFieldId: 'TEL',
    value: '004912345',
    brandId: 'MB'
  },
  {
    communicationFieldId: 'TEL',
    value: '004912345'
  },
  {
    communicationFieldId: 'INSTAGRAM',
    value: 'http://instagram.com/GS20000001-1',
    brandId: 'SMT'
  }
];

export const putMultiCommunicationDataMock: ServiceCommunicationData[] = [
  {
    offeredServiceId: 'GS00000001-1',
    communicationFieldId: 'URL',
    value: 'http://foo.bar_changed'
  },
  {
    offeredServiceId: 'GS00000001-2',
    communicationFieldId: 'TEL',
    value: '0815'
  }
];
