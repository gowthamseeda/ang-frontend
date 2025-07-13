import { TaskData } from 'app/tasks/task.model';
import { groupBy } from 'ramda';

import { CommunicationsQueryParams } from '../container/service-communication/service-communication.component';

import { CommunicationFieldType } from './communication-field-type';
import { CommunicationField } from './communication-field.model';
import { OfferedService } from './offered-service.model';

export interface NoChangeCommunicationData {
  offeredServiceId: string;
  taskData?: TaskData;
}

export interface CommunicationData {
  communicationFieldId: string;
  value: string;
  taskData?: TaskData;
  dataNotification?: string;
  taskId?: number;
  oldvalue?: string; 
  newvalue?: string;
}

export interface ServiceCommunicationData extends CommunicationData {
  offeredServiceId: string;
}

export interface GeneralCommunicationData extends CommunicationData {
  brandId?: string;
}

export interface CommunicationDataGroupedByOfferedServiceId {
  [id: string]: ServiceCommunicationData[];
}

export namespace CommunicationData {
  export const groupByOfferedServiceId = (
    communicationData: ServiceCommunicationData[]
  ): { [id: string]: ServiceCommunicationData[] } =>
    groupBy(communicationDataItem => communicationDataItem.offeredServiceId, communicationData);

  export function hasEqualFieldsAndValues(
    data1?: CommunicationData[],
    data2?: CommunicationData[]
  ): boolean {
    if (!data1 || !data2) {
      return false;
    }

    return data1.every(dataItem1 =>
      data2.some(
        dataItem2 =>
          dataItem2.communicationFieldId === dataItem1.communicationFieldId &&
          dataItem2.value === dataItem1.value
      )
    );
  }

  export function filterByQueryParams({
    productCategoryId,
    serviceId,
    serviceCharacteristicId
  }: CommunicationsQueryParams): ([communicationData, offeredServices]: [
    ServiceCommunicationData[],
    OfferedService[]
  ]) => ServiceCommunicationData[] {
    return ([communicationData, offeredServices]: [ServiceCommunicationData[], OfferedService[]]) =>
      communicationData.filter(communicationDataItem => {
        const offeredServiceOfCommunicationData = offeredServices.find(
          offeredService => offeredService.id === communicationDataItem.offeredServiceId
        );
        return (
          offeredServiceOfCommunicationData?.serviceId === serviceId &&
          offeredServiceOfCommunicationData?.serviceCharacteristicId === serviceCharacteristicId &&
          offeredServiceOfCommunicationData?.productCategoryId === productCategoryId
        );
      });
  }

  export function filterByCommunicationFieldType(
    communicationFieldType: CommunicationFieldType
  ): ([communicationData, communicationFields]: [
    ServiceCommunicationData[],
    CommunicationField[]
  ]) => ServiceCommunicationData[] {
    return ([communicationData, communicationFields]: [
      ServiceCommunicationData[],
      CommunicationField[]
    ]) =>
      communicationData.filter(
        communicationDataItem =>
          communicationFields.find(
            communicationField =>
              communicationField.id === communicationDataItem.communicationFieldId
          )?.type === communicationFieldType
      );
  }
}
