import { Contact, Pdf, Video } from './help.model';

export const FALLBACK_LANGUAGE = 'en';
export const BASE_VIDEO_EXTENSION = 'mp4';
export const BASE_PDF_EXTENSION = 'pdf';
export const BASE_VIDEO_API_PATH = 'storage/api/v1/help/videos';
export const BASE_DOCUMENT_API_PATH = 'storage/api/v1/help/documents';
export const FILE_NAME_QUERY_PARAM = 'fileName=';
export const FILE_TYPE_QUERY_PARAM = 'fileType=';
export const LANGUAGE_QUERY_PARAM = 'lang=';

export const RETAILER_ROLE = 'GSSNPLUS.BusinessSiteResponsible';
export const MPC_ROLE = 'GSSNPLUS.MarketTaskResponsible';
export const MPC_ROLE_HEADER = 'HELP_CONTACT_2_ROLE';

export const SIZE_UNIT = 'MB';
export const DURATION_UNIT = 'min.';

export const LEARNING_CENTER_LINK = 'https://gssnplus.spark-nga.de';

export const VIDEOS: Video[] = [
  {
    title: 'HELP_VIDEO_1_TITLE',
    name: '1-intro'
  },
  {
    title: 'HELP_VIDEO_2_TITLE',
    name: '2-data'
  },
  {
    title: 'HELP_VIDEO_3_TITLE',
    name: '3-task'
  },
  {
    title: 'HELP_VIDEO_4_TITLE',
    name: '4-openinghours'
  }
];

export const PDFS: Pdf[] = [
  {
    title: 'HELP_PDF_1_TITLE',
    name: 'user-manual'
  }
];

export const CONTACT_HEADQUARTERS: Contact = {
  role: 'HELP_CONTACT_1_ROLE',
  users: [
    {
      givenName: 'HELP_CONTACT_HEADQUARTERS_NAME',
      email: 'HELP_CONTACT_HEADQUARTERS_EMAIL',
      phone: 'HELP_CONTACT_HEADQUARTERS_PHONE'
    }
  ]
};

export const CONTACTS: Contact[] = [CONTACT_HEADQUARTERS];
