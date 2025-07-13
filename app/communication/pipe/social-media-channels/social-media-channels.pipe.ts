import { Pipe, PipeTransform } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { CommunicationService } from '../../communication.service';
import { CommunicationData } from '../../model/communication-data.model';
import { CommunicationFieldType } from '../../model/communication-field-type';
import { CommunicationField } from '../../model/communication-field.model';
import { SocialMediaChannel } from '../../model/social-media-channel.model';

@Pipe({
  name: 'socialMediaChannels'
})
export class SocialMediaChannelsPipe implements PipeTransform {
  communicationFields: CommunicationField[];
  languageId = '';

  constructor(
    private communicationService: CommunicationService,
    private userSettingsService: UserSettingsService
  ) {}

  transform(communicationData: CommunicationData[]): Observable<SocialMediaChannel[]> {
    return combineLatest([
      this.communicationService.getCommunicationFields().pipe(take(1)),
      this.userSettingsService.getLanguageId().pipe(take(1))
    ]).pipe(
      tap(([communicationFields, languageId]) => {
        this.communicationFields = communicationFields;
        this.languageId = languageId ? languageId : '';
      }),
      map(() => {
        const socialMediaCommunicationFields = this.communicationFields.filter(
          communicationField => communicationField.type === CommunicationFieldType.SOCIAL_MEDIA
        );
        const socialMediaData = communicationData?.filter(communicationDataItem =>
          socialMediaCommunicationFields.some(
            socialMediaCommunicationField =>
              socialMediaCommunicationField.id === communicationDataItem.communicationFieldId
          )
        );
        const socialMediaChannels = socialMediaCommunicationFields.map(
          this.toUnselectedSocialMediaChannel()
        );

        if (!socialMediaData || socialMediaData.length === 0) {
          return socialMediaChannels;
        }

        this.fillSocialMediaChannelsWithData(socialMediaChannels, socialMediaData);

        return socialMediaChannels;
      })
    );
  }

  private toUnselectedSocialMediaChannel(): (
    communicationField: CommunicationField
  ) => SocialMediaChannel {
    return (communicationField: CommunicationField) => ({
      id: communicationField.id,
      name: this.getNameTranslation(communicationField),
      selected: false,
      format: communicationField.format,
      template: communicationField.template,
      value: ''
    });
  }

  private fillSocialMediaChannelsWithData(
    socialMediaChannels: SocialMediaChannel[],
    socialMediaData: CommunicationData[]
  ): void {
    socialMediaChannels.forEach(socialMediaChannel => {
      const foundSocialMediaData = socialMediaData.find(
        socialMediaDataItem => socialMediaDataItem.communicationFieldId === socialMediaChannel.id
      );

      if (foundSocialMediaData) {
        socialMediaChannel.selected = true;
        socialMediaChannel.value = foundSocialMediaData.value;
      }
    });
  }

  private getNameTranslation(communicationField: CommunicationField): string {
    if (!communicationField.translations || !this.languageId) {
      return communicationField.name;
    }

    const key = Object.keys(communicationField.translations).find(item => item === this.languageId);
    return key ? communicationField.translations[key] : communicationField.name;
  }
}
