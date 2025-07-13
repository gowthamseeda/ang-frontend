import { TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { CommunicationService } from '../../communication.service';
import { generalCommunicationDataMock } from '../../model/communication-data.mock';
import { communicationFieldMock } from '../../model/communication-field.mock';
import { SocialMediaChannel } from '../../model/social-media-channel.model';

import { SocialMediaChannelsPipe } from './social-media-channels.pipe';

class CommunicationServiceStub {
  getCommunicationFields = () => of(communicationFieldMock);
}

describe('SocialMediaChannelsPipe', () => {
  let pipe: SocialMediaChannelsPipe;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  const communicationServiceStub = new CommunicationServiceStub();

  const communicationData = [
    generalCommunicationDataMock[0],
    generalCommunicationDataMock[1],
    generalCommunicationDataMock[3]
  ];
  userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
  userSettingsServiceSpy.getLanguageId.nextWith('en');

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: CommunicationService, useValue: communicationServiceStub },
          { provide: UserSettingsService, useValue: userSettingsServiceSpy }
        ]
      });

      pipe = new SocialMediaChannelsPipe(
        TestBed.inject(CommunicationService),
        TestBed.inject(UserSettingsService)
      );
    })
  );

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter out 1 of 3 communication data of type SOCIAL_MEDIA', done => {
    pipe.transform(communicationData).subscribe(socialMediaChannel => {
      expect(socialMediaChannel).toHaveLength(1);
      done();
    });
  });

  it('should transform communication data into social media channel', done => {
    pipe.transform(communicationData).subscribe(socialMediaChannels => {
      const expectedSocialMediaChannels = [
        {
          id: generalCommunicationDataMock[3].communicationFieldId,
          value: generalCommunicationDataMock[3].value,
          selected: true,
          name: communicationFieldMock[3].name,
          format: communicationFieldMock[3].format,
          template: communicationFieldMock[3].template
        } as SocialMediaChannel
      ];

      expect(socialMediaChannels).toEqual(expectedSocialMediaChannels);
      done();
    });
  });

  it('should transform communication data into social media channel with translation', done => {
    const language = 'de-CH';
    userSettingsServiceSpy.getLanguageId.nextWith(language);

    pipe.transform(communicationData).subscribe(socialMediaChannels => {
      const expectedSocialMediaChannels = [
        {
          id: generalCommunicationDataMock[3].communicationFieldId,
          value: generalCommunicationDataMock[3].value,
          selected: true,
          name: communicationFieldMock[3].translations
            ? communicationFieldMock[3].translations[language]
            : undefined,
          format: communicationFieldMock[3].format,
          template: communicationFieldMock[3].template
        } as SocialMediaChannel
      ];

      expect(socialMediaChannels).toEqual(expectedSocialMediaChannels);
      done();
    });
  });
});
