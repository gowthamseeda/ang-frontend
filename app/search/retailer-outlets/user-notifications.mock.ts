export function getUserNotificationsMock(): any {
  return [
    {
      businessSiteId: 'GS00000001',
      notificationTasksState: true,
      notificationType: 'VERIFICATION_TASK'
    },
    {
      businessSiteId: 'GS00000002',
      notificationTasksState: false,
      notificationType: 'VERIFICATION_TASK'
    }
  ];
}
