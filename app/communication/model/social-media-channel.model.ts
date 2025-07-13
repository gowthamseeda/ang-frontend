import { CommunicationChannel } from './communication-channel.model';

export interface SocialMediaChannel extends CommunicationChannel {
  selected: boolean;
  template?: string;
}
