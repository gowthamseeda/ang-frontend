import { Injectable } from '@angular/core';
import { isEmpty } from 'ramda';
import { combineLatest, Observable, Subject } from 'rxjs';
import { UserService } from '../../iam/user/user.service';
import { TaskUpdateResponse } from '../task.model';
import * as StompJs from '@stomp/stompjs';

@Injectable({ providedIn: 'root' })
export class TaskWebSocketService {
  client: StompJs.Client | undefined = undefined;
  private promptRefresh = new Subject<boolean>();
  private liveTask = new Subject<TaskUpdateResponse>();

  constructor(private userService: UserService) {}

  connect(url: string): void {
    if (!this.client) {
      this.client = new StompJs.Client({
        brokerURL: url,
        reconnectDelay: 30000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });

      this.client.onConnect = () => {
        //subscribe to /topic/allTask Channel
        this.client?.subscribe('/topic/allTask', msg => {
          if (msg.body !== 'no task') {
            const data: TaskUpdateResponse = JSON.parse(msg.body);

            this.filterTaskPromptByUserRestrictions(data);
          }
        });
      };

      //activate the connection
      this.client.activate();
    }
  }

  getPromptRefresh(): Observable<boolean> {
    return this.promptRefresh.asObservable();
  }

  getLiveTask(): Observable<TaskUpdateResponse> {
    return this.liveTask.asObservable();
  }

  disconnect(): void {
    if (this.client) {
      //clean up
      this.client.deactivate();
      this.client = undefined;
    }
  }

  filterTaskPromptByUserRestrictions(data: TaskUpdateResponse) {
    const userBusinessRestriction = this.userService.getBusinessSiteRestrictions();
    const userCountryRestriction = this.userService.getCountryRestrictions();
    const productGroupRestriction = this.userService.getProductGroupRestrictions();
    combineLatest([
      userBusinessRestriction,
      userCountryRestriction,
      productGroupRestriction
    ]).subscribe(([businessSiteRestriction, countryRestriction, productGrRestriction]) => {
      // to get final restricted boolean value
      let restrictionFlag: boolean;

      // check user business site data restrictions
      if (isEmpty(businessSiteRestriction)) {
        restrictionFlag = false;
      } else {
        if (businessSiteRestriction.includes(data.businessSiteId)) {
          restrictionFlag = false;
        } else {
          restrictionFlag = true;
        }
      }

      // check user country restrictions
      if (!restrictionFlag) {
        if (isEmpty(countryRestriction)) {
          restrictionFlag = false;
        } else {
          if (countryRestriction.includes(data.countryId)) {
            restrictionFlag = false;
          } else {
            restrictionFlag = true;
          }
        }
      }

      // check user product group restricstions (for services tasks)
      if (!restrictionFlag) {
        if (data.diff) {
          // communication data
          if ('communicationDataDiff' in data.diff) {
            let communicationRestrictionFlag: boolean | null = null;
            for (const communicationDiff of data.diff.communicationDataDiff) {
              if (communicationDiff.productGroupId) {
                if (
                  communicationRestrictionFlag === null ||
                  communicationRestrictionFlag === true // to loop to find the non restricted one
                ) {
                  if (productGrRestriction.includes(communicationDiff.productGroupId)) {
                    communicationRestrictionFlag = false;
                    break;
                  } else {
                    communicationRestrictionFlag = true;
                  }
                }
              }
            }
            if (communicationRestrictionFlag) {
              restrictionFlag = communicationRestrictionFlag;
            }
          } else if ('openingHoursDiff' in data.diff) {
            // opening hour data
            let ohRestrictionFlag: boolean | null = null;
            for (const openingHourDiff of data.diff.openingHoursDiff) {
              if (openingHourDiff.productGroupId) {
                if (ohRestrictionFlag === null || ohRestrictionFlag === true) {
                  if (productGrRestriction.includes(openingHourDiff.productGroupId)) {
                    ohRestrictionFlag = false;
                    break;
                  } else {
                    ohRestrictionFlag = true;
                  }
                }
              }
            }
            if (ohRestrictionFlag) {
              restrictionFlag = ohRestrictionFlag;
            }
          }
        }
      }
      this.promptRefresh.next(!restrictionFlag);
      if(!restrictionFlag) {
        this.liveTask.next(data)
      }
    });
  }
}
