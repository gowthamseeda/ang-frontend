import { CommunicationFieldFormat } from './communication-field-format';
import { CommunicationField } from './communication-field.model';

export interface CommunicationChannel {
  id: string;
  value: string;
  name?: string;
  format?: CommunicationFieldFormat;
  uiFieldSize?: number;
  notification?: string;
  taskId?: number;
  newValue?: string;
}

export interface CommunicationChannelsChange {
  value: CommunicationChannel[];
  invalid?: boolean;
}

export namespace CommunicationChannel {
  export function compareByCommunicationFieldPosition(
    givenCommunicationFields?: CommunicationField[]
  ): (a: CommunicationChannel, b: CommunicationChannel) => number {
    return (a: CommunicationChannel, b: CommunicationChannel) => {
      const fieldA = givenCommunicationFields?.find(field => field.id === a.id)?.position;
      const fieldB = givenCommunicationFields?.find(field => field.id === b.id)?.position;

      if (fieldA === undefined && fieldB === undefined) {
        return 0;
      }
      if (fieldA === undefined) {
        return 1;
      }
      if (fieldB === undefined) {
        return -1;
      }

      return fieldA - fieldB;
    };
  }
}
