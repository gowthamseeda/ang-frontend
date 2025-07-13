export enum SchedulerType {
  XML = 'xml',
  API = 'api'
}

export enum APISchedulerJobType {
  COMPLETE_OUTLET_FILE = 'COMPLETE_OUTLET_FILE',
  COMPLETE_OUTLET_FILE_BY_COUNTRY = 'COMPLETE_OUTLET_FILE_BY_COUNTRY'
}

export interface SchedulerJob {
  isActive: boolean;
  isRunning?: boolean;
  nextRunDate?: Date;
  lastRunningTime?: Date;
  lastRunningStatus?: string;
  copyFileStorageStatus?: string;
}

export interface XMLSchedulerJob extends SchedulerJob {
  schedulerId: string;
  second: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface APISchedulerJob extends SchedulerJob {
  id: string;
  schedulerJob: APISchedulerJobType;
  cronExpression: string;
  jobParameters?: string;
}

export interface SchedulerTableRow extends SchedulerJob {
  jobId: string;
  jobName?: string;
  jobParameters?: string;
  schedule: string;
  tableType: SchedulerType;
}

export interface AuditLogCleanSchedulerJob {
  id: number;
  name: string;
  currentStatus: string;
  schedule: string;
  lastRunningTime: string;
  lastRunningStatus: string;
  lastDeletedRecords: number;
}

export interface AuditLogCleanSchedulerStatus {
  id: number;
  name: string;
  currentStatus: string;
  lastRunningTime: string;
  lastRunningStatus: string;
  lastDeletedRecords: number;
}
