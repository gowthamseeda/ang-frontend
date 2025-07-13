export interface SavingStatus {
  updated: boolean;
  newEventState: EventCreationState;
}

export enum EventCreationState {
  None = 'None',
  FirstDay = 'First day selected',
  SecondDay = 'Second day selected',
  Updated = 'Updated'
}
