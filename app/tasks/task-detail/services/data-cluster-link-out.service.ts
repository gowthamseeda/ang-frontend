import { Injectable } from '@angular/core';

import { DataCluster, Task } from '../../task.model';
import {
  GENERAL_COMMUNICATION_AGGREGATES,
  LEGAL_INFO_AGGREGATES,
  OUTLET_AGGREGATES
} from '../../../shared/model/constants';

@Injectable({
  providedIn: 'root'
})
export class DataClusterLinkOutService {
  constructor() {}

  getRouterLink(task: Task): string {
    let routerLink = '';
    switch (task.dataCluster) {
      case DataCluster.BASE_DATA_ADDRESS:
      case DataCluster.BASE_DATA_ADDITIONAL_ADDRESS:
      case DataCluster.BASE_DATA_PO_BOX:
      case DataCluster.BASE_DATA_GPS:
      case DataCluster.BASE_DATA_NAME_ADDITION:
      case DataCluster.BASE_DATA_STATE_AND_PROVINCE:
      case DataCluster.BASE_DATA_ADDRESS_STREET:
      case DataCluster.BASE_DATA_ADDRESS_NUMBER:
      case DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION:
      case DataCluster.BASE_DATA_ADDRESS_ZIP_CODE:
      case DataCluster.BASE_DATA_ADDRESS_CITY:
      case DataCluster.BASE_DATA_ADDRESS_DISTRICT:
      case DataCluster.BASE_DATA_ADDRESS_STATE:
      case DataCluster.BASE_DATA_ADDRESS_PROVINCE:
      case DataCluster.BUSINESS_NAME: {
        routerLink = `../outlet/${task.businessSiteId}/edit`;
        break;
      }
      case DataCluster.LEGAL_VAT_NO:
      case DataCluster.LEGAL_TAX_NO:
      case DataCluster.LEGAL_LEGAL_FOOTER: {
        routerLink = `../outlet/${task.businessSiteId}/legal`;
        break;
      }
      case DataCluster.COMMUNICATION_CHANNELS:
      case DataCluster.OPENING_HOURS: {
        routerLink = `../outlet/${task.businessSiteId}/services`;
        break;
      }
      case DataCluster.GENERAL_COMMUNICATION_CHANNELS: {
        routerLink = `../outlet/${task.businessSiteId}/general-communication`;
        break;
      }
      default: {
        break;
      }
    }

    const aggregateName = task.aggregateName || '';

    switch (true) {
      case LEGAL_INFO_AGGREGATES.includes(aggregateName):
        routerLink = `../outlet/${task.businessSiteId}/legal`;
        break;
      case OUTLET_AGGREGATES.includes(aggregateName):
        routerLink = `../outlet/${task.businessSiteId}/edit`;
        break;
      case GENERAL_COMMUNICATION_AGGREGATES.includes(aggregateName):
        routerLink = `../outlet/${task.businessSiteId}/general-communication`;
    }

    return routerLink;
  }

  getOpeningHours4RRouter(task: Task): string {
    return `../outlet/${task.businessSiteId}/services/opening-hours`;
  }

  getRouterFragment(dataCluster?: DataCluster, aggregateField?: String): string {
    let fragment = '';
    switch (dataCluster) {
      case DataCluster.BASE_DATA_NAME_ADDITION:
      case DataCluster.BASE_DATA_STATE_AND_PROVINCE:
      case DataCluster.BASE_DATA_ADDRESS:
      case DataCluster.BASE_DATA_ADDRESS_STREET:
      case DataCluster.BASE_DATA_ADDRESS_NUMBER:
      case DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION:
      case DataCluster.BASE_DATA_ADDRESS_ZIP_CODE:
      case DataCluster.BASE_DATA_ADDRESS_CITY:
      case DataCluster.BASE_DATA_ADDRESS_DISTRICT:
      case DataCluster.BASE_DATA_ADDRESS_STATE:
      case DataCluster.BASE_DATA_ADDRESS_PROVINCE:
        fragment = 'address';
        break;
      case DataCluster.BASE_DATA_ADDITIONAL_ADDRESS:
        fragment = 'additionalAddress';
        break;
      case DataCluster.BASE_DATA_PO_BOX:
        fragment = 'poBox';
        break;
      case DataCluster.BASE_DATA_GPS:
        fragment = 'gps';
        break;
      case DataCluster.BUSINESS_NAME:
        fragment = 'businessNames';
        break;
      default:
        break;
    }

    if (aggregateField?.includes('additionalAddress')) {
      fragment = 'additionalAddress';
    } else if (aggregateField?.includes('poBox')) {
      fragment = 'poBox';
    } else if (aggregateField?.includes('gps')) {
      fragment = 'gps';
    } else if (aggregateField?.includes('nameAddition')) {
      fragment = 'address';
    }
    return fragment;
  }
}
