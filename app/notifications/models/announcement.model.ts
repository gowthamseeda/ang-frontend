export enum AnnouncementType {
  DASHBOARD = 'DASHBOARD'
}

export class Announcement {
  type: AnnouncementType;
  languageId: string;
  content: string;
}
