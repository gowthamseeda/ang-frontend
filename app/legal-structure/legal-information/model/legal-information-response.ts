import { TaskData } from 'app/tasks/task.model';

export interface LegalInformationResponse {
  businessSiteId: string;
  companyId: string;
  legalFooter?: string;
  legalFooterTranslations?: { [key: string]: string };
  taxNo?: string;
  vatNo?: string;
}

export interface LegalInformationPutResource {
  legalFooter: string;
  legalFooterTranslations: { [key: string]: string };
  taxNo: string;
  vatNo: string;
  taskData?: TaskData;
}
