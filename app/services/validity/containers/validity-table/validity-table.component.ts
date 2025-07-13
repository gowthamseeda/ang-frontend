import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import moment from 'moment';
import { uniq } from 'ramda';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { UserService } from '../../../../iam/user/user.service';
import { simpleCompare } from '../../../../shared/util/simple-compare';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { ValidityTableStatusService } from '../../services/validity-table-status.service';
import { ValidityTableService } from '../../services/validity-table.service';
import { Validity, ValidityChange, ValidityTableRow } from '../../validity.model';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import {
  BrandProductGroupsGroupedByBrandId,
  brandProductGroupUtils
} from '../../../brand-product-group/brand-product-group.model';

@Component({
  selector: 'gp-validity-table',
  templateUrl: './validity-table.component.html',
  styleUrls: ['./validity-table.component.scss']
})
export class ValidityTableComponent implements OnInit, OnChanges {
  @Input() set serviceId(value: number) {
    this._serviceId = value;
    this.initialize();
  }

  get serviceId(): number {
    return this._serviceId;
  }

  @Input() outletId: string;
  @Input() countryId: string;
  @Input() pristine: boolean;
  @Input() valid: boolean;
  @Input() userHasPermissions: Observable<boolean>;

  offeredServices: Observable<OfferedService[]>;
  brandProductGroups: Observable<BrandProductGroupsGroupedByBrandId>;
  validityTableRows: Observable<ValidityTableRow[]> =
    this.validityTableService.getValidityTableRows();
  brandRestrictions: Observable<string[]> = this.userService.getBrandRestrictions();
  productGroupRestrictions: Observable<string[]> = this.userService.getProductGroupRestrictions();

  private _serviceId: number;

  constructor(
    private offeredServiceService: OfferedServiceService,
    private validityTableService: ValidityTableService,
    private validityTableStatusService: ValidityTableStatusService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.outletId && !changes.outletId.firstChange) {
      this.initialize();
    }
  }

  initialize(): void {
    this.offeredServiceService.fetchAllForOutlet(this.outletId);
    this.offeredServices = this.offeredServiceService.getAllForServiceWith(this.serviceId);
    this.initBrandProductGroups(this.offeredServices);
    this.validityTableService.initValidityTableRows(this.serviceId);
    this.pristineChange(true);
    this.validChange(true);
  }

  pristineChange(pristine: boolean): void {
    if (this.pristine !== pristine) {
      this.validityTableStatusService.changePristineTo(pristine);
    }
  }

  validChange(valid: boolean): void {
    if (this.valid !== valid) {
      this.validityTableStatusService.changeValidTo(valid);
    }
  }

  applicationChange({
    rowIndex,
    ids,
    validity: { application } = { application: false }
  }: ValidityChange): void {
    this.offeredServiceService.updateApplicationFor(ids, application);
    if (rowIndex !== undefined) {
      this.validityTableService.changeApplication(rowIndex, application);
    }
  }

  applicationUntilChange({
    ids,
    validity: { applicationValidUntil } = { applicationValidUntil: undefined }
  }: ValidityChange): void {
    this.offeredServiceService.updateApplicationUntilFor(ids, applicationValidUntil);
  }

  validFromChange({
    rowIndex,
    ids,
    validity: { validFrom } = { validFrom: undefined }
  }: ValidityChange): void {
    this.offeredServiceService.updateValidFromFor(ids, validFrom);
    if (rowIndex !== undefined) {
      this.validityTableService.changeValidFrom(rowIndex, validFrom);
      const isValid = validFrom ? moment().isSameOrAfter(validFrom) : false;
      this.validityTableService.changeValid(rowIndex, isValid);
    }
  }

  validUntilChange({
    ids,
    validity: { validUntil } = { validUntil: undefined }
  }: ValidityChange): void {
    this.offeredServiceService.updateValidUntilFor(ids, validUntil);
  }

  validityChange(validity: ValidityChange): void {
    this.offeredServiceService.updateValidity(validity);
  }

  moveValidityUp({
    rowIndex,
    offeredService,
    currentValidity,
    newValidity
  }: {
    rowIndex: number;
    offeredService: OfferedService;
    currentValidity: Validity;
    newValidity: Validity;
  }): void {
    this.validityTableService.moveValidityUp(
      rowIndex,
      offeredService,
      currentValidity,
      newValidity
    );
  }

  moveValidityDown({
    rowIndex,
    offeredService,
    currentValidity,
    newValidity
  }: {
    rowIndex: number;
    offeredService: OfferedService;
    currentValidity: Validity;
    newValidity: Validity;
  }): void {
    this.validityTableService.moveValidityDown(
      rowIndex,
      offeredService,
      currentValidity,
      newValidity
    );
  }

  private initBrandProductGroups(offeredServices: Observable<OfferedService[]>): void {
    this.brandProductGroups = offeredServices.pipe(
      OfferedService.mapToProductGroups(),
      distinctUntilChanged(simpleCompare),
      map(uniq),
      map(brandProductGroupUtils.groupByBrandId)
    );
  }
}
