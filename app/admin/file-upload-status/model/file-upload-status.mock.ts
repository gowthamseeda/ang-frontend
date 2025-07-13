import { FileUploadStatusDetails } from './file-upload-status.model';

export const fileUploadStatusDetailsMock: FileUploadStatusDetails = 
  {
    fileUploadStatusDetails: [
      {
        name: 'Offered-Services Mass Upload',
        status: 'COMPLETED',
        fileName: "test.xlsx",
        errorMsg: null,
        createTimestamp: new Date('2024-01-01T20:04:04.000Z'),
        updateTimestamp: new Date('2024-01-01T21:05:50.000Z')
      },
      {
        name: 'createTimestampOffered-Services Mass Upload',
        status: 'PROCESSING',
        fileName: "test.xlsx",
        errorMsg: null,
        createTimestamp: new Date('2024-01-02T20:04:04.000Z'),
        updateTimestamp: new Date('2024-01-02T21:05:50.000Z')
      },
      {
        name: 'Offered-Services Mass Upload',
        status: 'PROCESSING',
        fileName: "test.xlsx",
        errorMsg: null,
        createTimestamp: new Date('2024-01-03T20:04:04.000Z'),
        updateTimestamp: new Date('2024-01-03T21:05:50.000Z')
      },
      {
        name: 'Offered-Services Mass Upload',
        status: 'COMPLETED',
        fileName: "test.xlsx",
        errorMsg: null,
        createTimestamp: new Date('2024-01-04T20:04:04.000Z'),
        updateTimestamp: new Date('2024-01-04T21:05:50.000Z')
      }
    ]
  };

export const fileUploadStatusDetailMock = {
      id: 'OFFSERV_20240201_230101',
      name: 'Offered-Services Mass Upload',
      status: 'C',
      createTimestamp: new Date('2024-01-01T20:04:04.000Z'),
      updateTimestamp: new Date('2024-01-01T21:05:50.000Z')
};

