import { Announcement, AnnouncementType } from './announcement.model';

export const announcementMock: Announcement = {
  type: AnnouncementType.DASHBOARD,
  languageId: 'en',
  content: '{"ops":[{"insert":"test\\n"}]}'
};
