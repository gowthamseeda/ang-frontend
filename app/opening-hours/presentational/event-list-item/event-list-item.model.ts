export interface EventListItem {
  id?: string;
  start: Date;
  end?: Date;
  deletable: boolean;
  selected: boolean;
}
