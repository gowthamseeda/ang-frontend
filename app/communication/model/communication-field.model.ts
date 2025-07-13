import { Translatable } from '../../shared/pipes/translate-data/translatable.model';

import { CommunicationFieldFormat } from './communication-field-format';
import { CommunicationFieldType } from './communication-field-type';

export interface CommunicationField extends Translatable {
  id: string;
  name: string;
  type: CommunicationFieldType;
  template?: string;
  format?: CommunicationFieldFormat;
  position: number;
  uiFieldSize?: number;
  translations?: any;
}
