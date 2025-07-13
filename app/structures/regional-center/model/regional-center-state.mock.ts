import { ViewStatus } from './regional-center-state.model';

export function mockViewStatus_Error(): ViewStatus {
  return {
    error: true,
    errorMsg: 'An error occurred!'
  };
}
