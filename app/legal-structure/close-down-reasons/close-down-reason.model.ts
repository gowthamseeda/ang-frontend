import { Translatable } from '../../shared/pipes/translate-data/translatable.model';

export class CloseDownReason implements Translatable {
  id: number;
  name: string;
  validity: string[];
  translations: any;
}
