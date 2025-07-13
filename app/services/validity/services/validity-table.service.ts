import { Injectable } from '@angular/core';
import moment from 'moment';
import { assoc, groupBy, isEmpty, reduce } from 'ramda';
import { BehaviorSubject, Observable, OperatorFunction } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { BrandProductGroup } from '../../brand-product-group/brand-product-group.model';
import { OfferedService } from '../../offered-service/offered-service.model';
import { OfferedServiceService } from '../../offered-service/offered-service.service';
import { OfferedServiceValidity, Validity, ValidityTableRow } from '../validity.model';

@Injectable()
export class ValidityTableService {
  private validityTableRows = new BehaviorSubject<ValidityTableRow[]>([]);
  private validityTableRowsCopy: ValidityTableRow[];

  constructor(private offeredServiceService: OfferedServiceService) {}

  initValidityTableRows(serviceId: number): void {
    const offeredServices = this.offeredServiceService.getAllForServiceWith(serviceId);

    offeredServices
      .pipe(
        OfferedService.mapToValiditiesWithBrandProductGroup(),
        map(groupBy(this.groupBy)),
        map(this.toValidityTableRows),
        map(this.sortByValidFrom),
        take(2),
        tap(validityTableRows => (this.validityTableRowsCopy = validityTableRows))
      )
      .subscribe(validityTableRows => {
        this.validityTableRows.next(validityTableRows);
      });
  }

  initValidityMultiEditTableRows(offeredServices: Observable<OfferedService[]>): void {
    offeredServices
      .pipe(
        OfferedService.mapToValiditiesWithBrandProductGroup(),
        this.mapToMultiEditNewValidityRows(),
        take(1),
        tap(validityTableRows => (this.validityTableRowsCopy = validityTableRows))
      )
      .subscribe(validityTableRows => {
        this.validityTableRows.next(validityTableRows);
      });
  }

  getValidityTableRows(): Observable<ValidityTableRow[]> {
    return this.validityTableRows.asObservable();
  }

  moveValidityDown(
    indexRow: number,
    offeredService: OfferedService,
    currentValidity: Validity,
    newValidity: Validity
  ): void {
    const currentValidityTableRow: ValidityTableRow = Object.assign(
      {},
      this.validityTableRowsCopy[indexRow]
    );
    delete currentValidityTableRow.offeredServicesMap[`${offeredService.id}`];
    this.validityTableRowsCopy[indexRow] = {
      ...currentValidityTableRow,
      ...currentValidity
    };
    if (isEmpty(newValidity) && !this.validityTableRowsCopy[indexRow + 1]) {
      this.validityTableRowsCopy = [
        ...this.validityTableRowsCopy,
        {
          ...newValidity,
          offeredServicesMap: {
            [`${offeredService.id}`]: { ...offeredService, validity: { ...newValidity } }
          }
        }
      ];
    } else {
      this.validityTableRowsCopy[indexRow + 1] = {
        ...newValidity,
        offeredServicesMap: {
          ...this.validityTableRowsCopy[indexRow + 1].offeredServicesMap,
          [`${offeredService.id}`]: { ...offeredService, validity: { ...newValidity } }
        }
      };
    }
    this.updateValidityTableRows(indexRow);
  }

  moveValidityUp(
    indexRow: number,
    offeredService: OfferedService,
    currentValidity: Validity,
    newValidity: Validity
  ): void {
    const currentValidityTableRow: ValidityTableRow = Object.assign(
      {},
      this.validityTableRowsCopy[indexRow]
    );
    delete currentValidityTableRow.offeredServicesMap[`${offeredService.id}`];
    this.validityTableRowsCopy[indexRow] = {
      ...currentValidityTableRow,
      ...currentValidity
    };
    this.validityTableRowsCopy[indexRow - 1] = {
      ...newValidity,
      offeredServicesMap: {
        ...this.validityTableRowsCopy[indexRow - 1].offeredServicesMap,
        [`${offeredService.id}`]: { ...offeredService, validity: { ...newValidity } }
      }
    };
    this.updateValidityTableRows(indexRow);
  }

  changeApplication(indexRow: number, application: boolean | undefined): void {
    this.changeValidityProp(indexRow, 'application', application);
  }

  changeApplicationValidUntil(
    indexRow: number,
    applicationValidUntil: string | undefined | null
  ): void {
    this.changeValidityProp(indexRow, 'applicationValidUntil', applicationValidUntil);
  }

  changeValidFrom(indexRow: number, validFrom: string | undefined | null): void {
    this.changeValidityProp(indexRow, 'validFrom', validFrom);
  }

  changeValid(indexRow: number, valid: boolean): void {
    this.changeValidityProp(indexRow, 'valid', valid);
  }

  changeValidUntil(indexRow: number, validUntil: string | undefined | null): void {
    this.changeValidityProp(indexRow, 'validUntil', validUntil);
  }

  private changeValidityProp(indexRow: number, prop: string, value: any): void {
    const currentValidityTableRow: ValidityTableRow = Object.assign(
      {},
      this.validityTableRowsCopy[indexRow]
    );
    currentValidityTableRow[prop] = value;
    this.validityTableRowsCopy[indexRow] = {
      ...currentValidityTableRow,
      [prop]: value,
      offeredServicesMap: {
        ...Object.keys(this.validityTableRowsCopy[indexRow].offeredServicesMap).reduce(
          (obj, key) => ({
            ...obj,
            [key]: {
              ...this.validityTableRowsCopy[indexRow].offeredServicesMap[key],
              validity: {
                ...this.validityTableRowsCopy[indexRow].offeredServicesMap[key].validity,
                [prop]: value
              }
            }
          }),
          {}
        )
      }
    };
    this.updateValidityTableRows(indexRow);
  }

  private updateValidityTableRows(indexRow: number): void {
    if (isEmpty(this.validityTableRowsCopy[indexRow].offeredServicesMap)) {
      this.validityTableRowsCopy = this.validityTableRowsCopy.filter(
        (row, index) => index !== indexRow
      );
    }
    this.validityTableRows.next(this.validityTableRowsCopy);
  }

  private groupBy(offeredServiceValidity: OfferedServiceValidity & BrandProductGroup): string {
    const { validity } = offeredServiceValidity;

    return (
      `${validity && validity.application}_` +
      `${validity && validity.applicationValidUntil}_` +
      `${validity && validity.validFrom}_` +
      `${validity && validity.validUntil}`
    );
  }

  private toValidityTableRows(groupedValidities: {
    [index: string]: (OfferedServiceValidity & BrandProductGroup)[];
  }): ValidityTableRow[] {
    return Object.keys(groupedValidities).map(key => {
      return {
        ...groupedValidities[key][0]['validity'],
        offeredServicesMap: reduce(
          (acc, validity: OfferedServiceValidity) => assoc(validity.id, { ...validity }, acc),
          {},
          groupedValidities[key]
        )
      };
    });
  }

  private mapToMultiEditNewValidityRows(): OperatorFunction<OfferedService[], ValidityTableRow[]> {
    return map((offeredServices: OfferedService[]) => {
      return [
        {
          offeredServicesMap: offeredServices.reduce((obj, item) => {
            return {
              ...obj,
              [item.id]: item
            };
          }, {}),
          applicationValidUntil: null,
          validFrom: null,
          validUntil: null,
          valid: false,
          application: false
        } as unknown as ValidityTableRow
      ];
    });
  }

  private sortByValidFrom(validityTableRows: ValidityTableRow[]): ValidityTableRow[] {
    return validityTableRows.sort((a: ValidityTableRow, b: ValidityTableRow) => {
      if (a.validFrom == null && b.validFrom) {
        return 1;
      } else if (a.validFrom && b.validFrom == null) {
        return -1;
      } else if (a.validFrom == null || b.validFrom == null) {
        return 0;
      }
      return moment(a.validFrom).unix() - moment(b.validFrom).unix();
    });
  }
}
