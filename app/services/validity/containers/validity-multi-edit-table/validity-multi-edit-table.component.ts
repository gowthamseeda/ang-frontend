import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import moment from 'moment';
import { uniq } from 'ramda';
import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { UserService } from '../../../../iam/user/user.service';
import { simpleCompare } from '../../../../shared/util/simple-compare';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { MultiSelectDataService } from '../../../service/services/multi-select-service-data.service';
import { ValidityTableStatusService } from '../../services/validity-table-status.service';
import { ValidityTableService } from '../../services/validity-table.service';
import { ValidityChange, ValidityTableRow } from '../../validity.model';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import {
  BrandProductGroupsGroupedByBrandId,
  brandProductGroupUtils
} from '../../../brand-product-group/brand-product-group.model';

@Component({
  selector: 'gp-validity-multi-edit-table',
  templateUrl: './validity-multi-edit-table.component.html',
  styleUrls: ['./validity-multi-edit-table.component.scss']
})
export class ValidityMultiEditTableComponent implements OnInit, OnChanges {
  @Input() outletId: string;
  @Input() countryId: string;
  @Input() pristine: boolean;
  @Input() valid: boolean;
  @Input() userHasPermissions: Observable<boolean>;

  brandProductGroups: Observable<BrandProductGroupsGroupedByBrandId>;
  validityTableRows: Observable<ValidityTableRow[]> =
    this.validityTableService.getValidityTableRows();
  brandRestrictions: Observable<string[]> = this.userService.getBrandRestrictions();
  productGroupRestrictions: Observable<string[]> = this.userService.getProductGroupRestrictions();

  constructor(
    private offeredServiceService: OfferedServiceService,
    private validityTableService: ValidityTableService,
    private validityTableStatusService: ValidityTableStatusService,
    private userService: UserService,
    private multiSelectDataService: MultiSelectDataService
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
    combineLatest([this.offeredServiceService.getAll(), this.multiSelectDataService.multiSelected])
      .pipe(take(1))
      .subscribe(([offeredServices, { targets }]) => {
        let fetchedOfferedServices = offeredServices.filter(offeredService =>
          targets.some(target => target.id === offeredService.id)
        );

        this.initBrandProductGroups(of(fetchedOfferedServices));
        this.validityTableService.initValidityMultiEditTableRows(of(fetchedOfferedServices));
      });

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
    rowIndex,
    ids,
    validity: { applicationValidUntil } = { applicationValidUntil: undefined }
  }: ValidityChange): void {
    this.offeredServiceService.updateApplicationUntilFor(ids, applicationValidUntil);
    if (rowIndex !== undefined) {
      this.validityTableService.changeApplicationValidUntil(rowIndex, applicationValidUntil);
    }
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
    rowIndex,
    ids,
    validity: { validUntil } = { validUntil: undefined }
  }: ValidityChange): void {
    this.offeredServiceService.updateValidUntilFor(ids, validUntil);
    if (rowIndex !== undefined) {
      this.validityTableService.changeValidUntil(rowIndex, validUntil);
    }
  }

  validityChange(validity: ValidityChange): void {
    this.offeredServiceService.updateValidity(validity);
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
