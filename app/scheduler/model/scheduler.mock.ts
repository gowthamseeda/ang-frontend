import { APISchedulerJob, AuditLogCleanSchedulerJob, XMLSchedulerJob } from './scheduler.model';
import { APISchedulerJobType } from './scheduler.model';

export function getXMLSchedulerJobs(): XMLSchedulerJob[] {
  return [
    {
      schedulerId: 'country',
      second: '*',
      minute: '*',
      hour: '11',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*',
      isActive: true,
      lastRunningTime: new Date(),
      lastRunningStatus: 'SUCCESS',
      isRunning: false,
      nextRunDate: new Date()
    }
  ];
}

export function getAPISchedulerJobs(): APISchedulerJob[] {
  return [
    {
      id: '1',
      schedulerJob: APISchedulerJobType.COMPLETE_OUTLET_FILE,
      cronExpression: '* * * * * *',
      isActive: true,
      lastRunningTime: new Date(),
      lastRunningStatus: 'SUCCESS',
      isRunning: false,
      nextRunDate: new Date()
    },
    {
      id: '2',
      schedulerJob: APISchedulerJobType.COMPLETE_OUTLET_FILE_BY_COUNTRY,
      cronExpression: '* * * * * *',
      isActive: true,
      lastRunningTime: new Date(),
      lastRunningStatus: 'SUCCESS',
      isRunning: false,
      nextRunDate: new Date(),
      jobParameters: '["MY", "DE"]'
    }
  ];
}

export function getAuditLogCleanSchedulerJobs(): AuditLogCleanSchedulerJob[] {
  return [
    {
      id: 1,
      name: 'Housekeeping scheduler job',
      currentStatus: 'RUNNING',
      schedule: '',
      lastRunningTime: '2024-09-05T01:48:44.271',
      lastRunningStatus: 'SUCCESS',
      lastDeletedRecords: 0
    }
  ];
}
