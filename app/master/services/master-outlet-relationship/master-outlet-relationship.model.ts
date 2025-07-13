import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';

export class MasterOutletRelationship implements Translatable {
  id: string;
  name: string;
  description?: string;
}
