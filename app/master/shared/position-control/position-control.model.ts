export interface PositionControl {
  id?: any;
  position?: number;
}

export interface PositionControlResponse {
  genericObjects: PositionControl[];
}

export interface ObjectPosition {
  id?: string;
  afterId?: string;
  beforeId?: string;
}
