import { CommunicationChannel } from './communication-channel.model';
import { communicationFieldMock } from './communication-field.mock';
import compareByCommunicationFieldPosition = CommunicationChannel.compareByCommunicationFieldPosition;

describe('CommunicationChannel', () => {
  describe('compareByCommunicationFieldPosition', () => {
    it('should sort channels according to positions of given communication fields', () => {
      const communicationFields = [communicationFieldMock[0], communicationFieldMock[1]];
      const a = { id: 'LASTNAME' } as CommunicationChannel;
      const b = { id: 'TEL' } as CommunicationChannel;
      const c = { id: 'FIRSTNAME' } as CommunicationChannel;
      const result = [a, b, c].sort(compareByCommunicationFieldPosition(communicationFields));

      expect(result).toEqual([b, c, a]);
    });
  });
});
