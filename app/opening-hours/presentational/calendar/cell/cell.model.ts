export enum Type {
  Date = 0,
  WeekNumber = 1,
  WeekDay = 2
}

export enum HighLiteType {
  None = 0,
  CurrentDay = 1,
  EventDay = 2,
  Selected = 3,
  Start = 4,
  End = 5
}

export interface Cell {
  id: string;
  label: string; // 5, 23, MON
  type: Type; // decides about text styling
  highLiteTypes: HighLiteType[]; // decides about cell styling
  active: boolean;
}

export interface DayCell extends Cell {
  timeStamp: number;
}
