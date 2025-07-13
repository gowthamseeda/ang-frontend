import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { Brand } from '../../../../services/brand/brand.model';
import { BrandService } from '../../../../services/brand/brand.service';
import { ProductGroup } from '../../../../services/product-group/product-group.model';
import { ProductGroupService } from '../../../../services/product-group/product-group.service';
import { BusinessSiteStoreService } from '../../../businessSite/services/business-site-store.service';
import { CompanyRelation, companyRelationMap } from '../../../shared/models/company-relation.model';
import { Outlet } from '../../../shared/models/outlet.model';
import { State } from '../../../store';
import {
  LegalContract,
  LegalInformation,
  LegalInformationPermissions
} from '../../model/legal-information.model';
import { selectLegalInformation } from '../../store/selectors';
import { ContractState, LegalContractStatus, LegalInformationState } from '../../store/state.model';

@Injectable()
export class EditLegalComponentService {
  readonly changeLegalInfoPermissions = ['legalstructure.legalinfo.update'];
  readonly changeContractStatusPermissions = ['traits.contractstatus.update'];
  readonly changeTestLegalInfoPermissions = ['legalstructure.testoutlet.update'];
  readonly changeTestContractStatusPermissions = ['traits.testoutlet.update'];
  readonly requiredDistributionLevel = ['RETAILER', 'APPLICANT'];

  constructor(
    private store: Store<State>,
    private outletStoreService: BusinessSiteStoreService,
    private brandService: BrandService,
    private productGroupService: ProductGroupService,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  getPermissions(
    outlet: Outlet,
    distributionLevels: string[],
    isFocusEnabled: boolean
  ): Observable<LegalInformationPermissions> {
    return combineLatest([
      this.brandService.getAllForUserDataRestrictions(),
      this.productGroupService.getAllForUserDataRestrictions(isFocusEnabled),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(
          distributionLevels.includes('TEST_OUTLET')
            ? this.changeTestLegalInfoPermissions
            : this.changeLegalInfoPermissions
        )
        .verify(),
      this.userAuthorizationService.isAuthorizedFor.businessSite(outlet.id).verify(),
      this.userAuthorizationService.isAuthorizedFor.country(outlet.countryId).verify(),
      this.userAuthorizationService.isAuthorizedFor.distributionLevels(distributionLevels).verify(),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(
          distributionLevels.includes('TEST_OUTLET')
            ? this.changeTestContractStatusPermissions
            : this.changeContractStatusPermissions
        )
        .verify(),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(['app.retail.show'])
        .verify(),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(['tasks.task.data.verification.create'])
        .verify(),
    ]).pipe(
      map((data: [Brand[], ProductGroup[], boolean, boolean, boolean, boolean, boolean, boolean, boolean]) => {
        const [
          brandsPermissions,
          productGroupPermissions,
          isUserAuthorizedToEditLegalInfo,
          isUserAuthorizedForBusinessSite,
          isUserAuthorizedForCountry,
          isUserAuthorizedForDistributionLevel,
          isUserAuthorizedToEditContractStatus,
          retailVerifyData,
          isUserAuthorizedToCreateVerificationTask
        ] = data;

        return {
          restrictedToBrands: brandsPermissions.map(brand => {
            return { text: brand.name, value: brand.id };
          }),
          restrictedToCompanyRelation: this.getCompanyRelations(productGroupPermissions).map(
            companyRelation => {
              return { text: companyRelation, value: companyRelation };
            }
          ),
          restrictedToBusinessSite: isUserAuthorizedForBusinessSite,
          restrictedToCountry: isUserAuthorizedForCountry,
          restrictedToDistributionLevel: isUserAuthorizedForDistributionLevel,
          editLegalInfoIsAllowed: isUserAuthorizedToEditLegalInfo,
          editContractStatusIsAllowed: isUserAuthorizedToEditContractStatus,
          retailVerifyData: retailVerifyData,
          isUserAuthorizedToCreateVerificationTask: isUserAuthorizedToCreateVerificationTask
        };
      })
    );
  }

  getCompanyRelations(productGroups: ProductGroup[]): string[] {
    const companyRelation: string[] = [];
    for (const relation in CompanyRelation) {
      if (
        companyRelationMap[relation].some((pg1: string) =>
          productGroups.map(pg2 => pg2.id).includes(pg1)
        )
      ) {
        companyRelation.push(relation);
      }
    }
    return companyRelation;
  }

  getLegalInformation(): Observable<LegalInformation> {
    return combineLatest([
      this.store.pipe(select(selectLegalInformation)),
      this.outletStoreService.getOutlet(),
      this.outletStoreService.getDistributionLevels()
    ]).pipe(
      map((data: [LegalInformationState, Outlet, string[]]) => {
        const [legalInfo, outlet, distributionLevels] = data;

        const legalContracts: LegalContract[] = (legalInfo.contracts ?? [])
          .filter((contract: ContractState) => contract.status !== LegalContractStatus.REMOVED)
          .map((contract: ContractState) => ({
            id: contract.id,
            brandId: contract.brandId,
            companyRelationId: contract.companyRelationId,
            required: contract.required,
            languageId: contract.languageId,
            contractState: contract.contractState ?? '',
            corporateDisclosure: contract.corporateDisclosure ?? '',
            status: contract.status ?? LegalContractStatus.DEFAULT
          }));

        const legalFooterAdditionalTranslations = legalInfo.companyLegalInfo
          ?.legalFooterAdditionalTranslations
          ? new Map(Object.entries(legalInfo.companyLegalInfo.legalFooterAdditionalTranslations))
          : new Map();
        return {
          company: {
            id: outlet.companyId,
            vatNumber: legalInfo.companyLegalInfo?.companyVatNumber ?? '',
            legalFooter: {
              text: legalInfo.companyLegalInfo?.legalFooter ?? '',
              additionalTranslations: legalFooterAdditionalTranslations
            }
          },
          businessSite: {
            id: outlet.id,
            nationalTaxNumber: legalInfo.businessSiteLegalInfo?.nationalTaxNumber ?? '',
            registeredOffice: outlet.registeredOffice ?? false,
            hasRequiredDistributionLevel: (distributionLevels ?? []).some(level =>
              this.requiredDistributionLevel.includes(level)
            ),
            defaultLanguageId: outlet.defaultLanguageId,
            countryId: outlet.countryId
          },
          legalContracts: legalContracts,
          viewStatus: legalInfo.savingStatus.contentStatus
        };
      })
    );
  }
}
