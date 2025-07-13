import { TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';
import { skip } from 'rxjs/operators';

import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { CommunicationService } from '../../communication.service';
import { generalCommunicationDataMock } from '../../model/communication-data.mock';
import { CommunicationFieldFormat } from '../../model/communication-field-format';
import { communicationFieldMock } from '../../model/communication-field.mock';
import { CommunicationField } from '../../model/communication-field.model';

import { StandardCommunicationChannelsPipe } from './standard-communication-channels.pipe';

class CommunicationServiceStub {
  getCommunicationFields = () => of(communicationFieldMock);
}

describe('StandardCommunicationChannelsPipe', () => {
  let pipe: StandardCommunicationChannelsPipe;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  const communicationServiceStub = new CommunicationServiceStub();
  const standardCommunicationData = [
    generalCommunicationDataMock[0],
    generalCommunicationDataMock[1]
  ];
  const mixedCommunicationData = [
    generalCommunicationDataMock[0],
    generalCommunicationDataMock[1],
    generalCommunicationDataMock[3]
  ];

  beforeEach(
    waitForAsync(() => {
      userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
      userSettingsServiceSpy.getLanguageId.nextWith('en');

      TestBed.configureTestingModule({
        providers: [
          { provide: CommunicationService, useValue: communicationServiceStub },
          { provide: UserSettingsService, useValue: userSettingsServiceSpy }
        ]
      });

      pipe = new StandardCommunicationChannelsPipe(
        TestBed.inject(CommunicationService),
        TestBed.inject(UserSettingsService)
      );
    })
  );

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should add an empty communication channel', done => {
    pipe.transform(standardCommunicationData).subscribe(communicationChannels => {
      expect(communicationChannels).toHaveLength(3);
      done();
    });
  });

  it('should transform communication data into sorted communication channel', done => {
    const expectedCommunicationChannels = [
      {
        id: mixedCommunicationData[1].communicationFieldId,
        name: communicationFieldMock[0].name,
        value: mixedCommunicationData[1].value,
        format: CommunicationFieldFormat.TEL,
        newValue: mixedCommunicationData[1].newvalue, 
        oldValue: mixedCommunicationData[1].oldvalue, 
        notification: undefined,
        taskId: undefined,
        uiFieldSize: undefined
      },
      {
        id: communicationFieldMock[1].id,
        name: communicationFieldMock[1].name,
        value: '',
         format: undefined,
        newValue: '', 
        oldValue: undefined,
        notification: undefined,
        taskId: undefined,
        uiFieldSize: undefined
      },
      {
        id: mixedCommunicationData[0].communicationFieldId,
        value: mixedCommunicationData[0].value,
        name: communicationFieldMock[2].name,
        uiFieldSize: communicationFieldMock[2].uiFieldSize,
         format: undefined,
        newValue: mixedCommunicationData[0].newvalue,
        oldValue: mixedCommunicationData[0].oldvalue,
        notification: undefined,
        taskId: undefined
      }
    ];

    pipe.transform(mixedCommunicationData).subscribe(standardCommunicationChannels => {
      expect(standardCommunicationChannels).toEqual(expectedCommunicationChannels);
      done();
    });
  });

  it('should transform communication data with translations', done => {
    const languageId = 'de-CH';
    const expectedCommunicationChannels = [
      {
        id: mixedCommunicationData[1].communicationFieldId,
        name: getTranslation(communicationFieldMock[0], languageId),
        value: mixedCommunicationData[1].value,
        format: CommunicationFieldFormat.TEL,
        newValue: mixedCommunicationData[1].newvalue, 
        oldValue: mixedCommunicationData[1].oldvalue, 
        notification: undefined,
        taskId: undefined,
        uiFieldSize: undefined
      },
      {
        id: communicationFieldMock[1].id,
        name: getTranslation(communicationFieldMock[1], languageId),
        value: '',
        format: undefined,
         newValue: '', 
        oldValue: undefined,
        notification: undefined,
        taskId: undefined,
        uiFieldSize: undefined 
      },
      {
        id: mixedCommunicationData[0].communicationFieldId,
        value: mixedCommunicationData[0].value,
        name: getTranslation(communicationFieldMock[2], languageId),
        format: undefined,
        uiFieldSize: communicationFieldMock[2].uiFieldSize,
        newValue: mixedCommunicationData[0].newvalue,
        oldValue: mixedCommunicationData[0].oldvalue,
        notification: undefined,
        taskId: undefined
      }
    ];
    userSettingsServiceSpy.getLanguageId.nextWith(languageId);

    pipe
      .transform(mixedCommunicationData)
      .pipe(skip(1))
      .subscribe(standardCommunicationChannels => {
        expect(standardCommunicationChannels).toEqual(expectedCommunicationChannels);
        done();
      });
  });
});

function getTranslation(
  communicationField: CommunicationField,
  languageId: string
): string | undefined {
  return communicationField.translations ? communicationField.translations[languageId] : undefined;
}
