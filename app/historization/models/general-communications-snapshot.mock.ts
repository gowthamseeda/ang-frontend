import { GeneralCommunicationData } from './outlet-history-snapshot.model';

export const currentGeneralCommunicationsSnapshotEntriesMock: GeneralCommunicationData = {
  communicationData: [
    {
      communicationFieldId: 'PHONE',
      brandId: 'MB',
      value: '0123-45678'
    },
    {
      communicationFieldId: 'PHONE',
      value: '000-0000000'
    },
    {
      communicationFieldId: 'EMAIL',
      brandId: 'MB',
      value: 'test@gmail.com'
    }
  ]
};

export const comparingGeneralCommunicationsSnapshotEntriesMock: GeneralCommunicationData = {
  communicationData: [
    {
      communicationFieldId: 'PHONE',
      brandId: 'MB',
      value: '0123-45678'
    },
    {
      communicationFieldId: 'PHONE',
      value: '0123-45678'
    }
  ]
};
