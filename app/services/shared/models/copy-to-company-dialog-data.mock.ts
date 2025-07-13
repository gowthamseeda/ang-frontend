export const queryCompanySisterOutletPayloadMock = {
  companyId: 'GC007',
  serviceIds: [120]
};

export const selectedOutletIdsToCopyMock = {
  selectedOutletIdsToCopy: ['GS01']
};

export const copyToCompanyDialogDataMock = {
  ...queryCompanySisterOutletPayloadMock,
  ...selectedOutletIdsToCopyMock
};
