import { Pipe, PipeTransform } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, take, tap } from 'rxjs/operators';

import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { CommunicationService } from '../../communication.service';
import { CommunicationChannel } from '../../model/communication-channel.model';
import { CommunicationData } from '../../model/communication-data.model';
import { CommunicationFieldType } from '../../model/communication-field-type';
import { CommunicationField } from '../../model/communication-field.model';
import compareByCommunicationFieldPosition = CommunicationChannel.compareByCommunicationFieldPosition;

@Pipe({
  name: 'standardCommunicationChannels'
})
export class StandardCommunicationChannelsPipe implements PipeTransform {
  private allCommunicationFields: CommunicationField[] = [];
  private languageId: string;

  constructor(
    private communicationService: CommunicationService,
    private userSettingsService: UserSettingsService
  ) {}

  transform(communicationData: CommunicationData[]): Observable<CommunicationChannel[]> {
    return combineLatest([
      this.communicationService.getCommunicationFields().pipe(take(1)),
      this.userSettingsService.getLanguageId().pipe(startWith('en'))
    ]).pipe(
      tap(([communicationFields, languageId]) => {
        this.languageId = languageId ? languageId : '';
        this.allCommunicationFields = communicationFields;
      }),
      map(() => {
        const standardCommunicationFields = this.allCommunicationFields.filter(
          communicationField => communicationField.type === CommunicationFieldType.STANDARD
        );
        const standardCommunicationData = communicationData?.filter(communicationDataItem =>
          standardCommunicationFields.some(
            standardCommunicationField =>
              standardCommunicationField.id === communicationDataItem.communicationFieldId
          )
        );

        if (!standardCommunicationData || standardCommunicationData.length === 0) {
          return standardCommunicationFields.map(this.toEmptyCommunicationChannel());
        }

        const communicationChannels = standardCommunicationData.map(this.toCommunicationChannel());
        const standardCommunicationFieldsWithoutData = standardCommunicationFields.filter(
          communicationField =>
            !standardCommunicationData.some(
              communicationItem => communicationItem.communicationFieldId === communicationField.id
            )
        );
        const emptyCommunicationChannels = standardCommunicationFieldsWithoutData.map(
          this.toEmptyCommunicationChannel()
        );

        return communicationChannels
          .concat(emptyCommunicationChannels)
          .sort(compareByCommunicationFieldPosition(this.allCommunicationFields));
      })
    );
  }

  private toEmptyCommunicationChannel(): (
    communicationField: CommunicationField
  ) => CommunicationChannel {
    return (communicationField: CommunicationField) => ({
      id: communicationField.id,
      format: communicationField.format,
      value: '',
      name: this.getNameTranslation(communicationField),
      uiFieldSize: communicationField.uiFieldSize,
      newValue: ''
    });
  }

  private toCommunicationChannel(): (communicationData: CommunicationData) => CommunicationChannel {
    return (communicationData: CommunicationData) => {
      const communicationField = this.allCommunicationFields.find(
        field => field.id === communicationData.communicationFieldId
      );

      const name = communicationField ? this.getNameTranslation(communicationField) : '';

      return {
        id: communicationData.communicationFieldId,
        format: communicationField?.format,
        uiFieldSize: communicationField?.uiFieldSize,
        value: communicationData.value,
        name: name,
        notification: communicationData.dataNotification,
        taskId: communicationData.taskId,
        newValue: (communicationData as any).newvalue
      };
    };
  }

  private getNameTranslation(communicationField: CommunicationField): string {
    if (!communicationField.translations || !this.languageId) {
      return communicationField.name;
    }

    const key = Object.keys(communicationField.translations).find(item => item === this.languageId);
    return key ? communicationField.translations[key] : communicationField.name;
  }
}
