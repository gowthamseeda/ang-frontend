import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { UserSettings } from '../../../../user-settings/user-settings/model/user-settings.model';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { CountryStructureDescription } from '../../model/country-structure-description.model';

interface CountryStructureHierarchyLevel extends CountryStructureDescription {
  selectedStructureId: string;
}

export const countryStructureFormAttributeName = 'countryStructureId';

@Component({
  selector: 'gp-country-structure',
  templateUrl: './country-structure.component.html',
  styleUrls: ['./country-structure.component.scss']
})
export class CountryStructureComponent implements OnInit {
  @Input()
  parentForm: UntypedFormGroup;

  countryStructureFormControl = new UntypedFormControl();
  userSettings: Observable<UserSettings>;
  userHasUpdatePermission: Observable<boolean>;
  countryStructureHierarchyFilteredByLeaf: CountryStructureHierarchyLevel[];

  private countryStructureHierarchy: CountryStructureDescription[] = [];
  private selectedCountryStructureLeafId: string;

  constructor(
    private userSettingsService: UserSettingsService,
    private userAuthorizationService: UserAuthorizationService
  ) {
    this.userSettings = this.userSettingsService.get();
    this.userHasUpdatePermission = this.userAuthorizationService.isAuthorizedFor
      .permissions([
        'structures.countrystructure.update',
        'structures.countrystructuredescription.update'
      ])
      .verify();
  }

  ngOnInit(): void {
    this.parentForm.addControl(countryStructureFormAttributeName, this.countryStructureFormControl);
  }

  @Input()
  set countryStructureDescriptions(countryStructureDescriptions: CountryStructureDescription[]) {
    this.countryStructureHierarchy = countryStructureDescriptions;
    this.updateCountryStructureHierarchyWithSelectedLeaf();
  }

  @Input()
  set selectedCountryStructureId(selectedCountryStructureId: string) {
    this.selectedCountryStructureLeafId = selectedCountryStructureId;
    this.updateCountryStructureHierarchyWithSelectedLeaf();
  }

  onSelectionChanged(descriptionIndex: number, selectedStructureId: string): void {
    const newSelectedCountryStructureId =
      selectedStructureId === '' && descriptionIndex > 0
        ? this.countryStructureHierarchyFilteredByLeaf[descriptionIndex - 1].selectedStructureId
        : selectedStructureId;

    const newControlValue =
      newSelectedCountryStructureId === '' ? null : newSelectedCountryStructureId;
    this.countryStructureHierarchyFilteredByLeaf =
      this.filterHierarchyAndMarkSelectedForEachHierarchyLevel(
        this.countryStructureHierarchy,
        newSelectedCountryStructureId
      );
    this.countryStructureFormControl.patchValue(newControlValue);
    this.countryStructureFormControl.markAsDirty();
  }

  private updateCountryStructureHierarchyWithSelectedLeaf(): void {
    this.countryStructureHierarchyFilteredByLeaf =
      this.filterHierarchyAndMarkSelectedForEachHierarchyLevel(
        this.countryStructureHierarchy,
        this.selectedCountryStructureLeafId
      );
  }

  private filterHierarchyAndMarkSelectedForEachHierarchyLevel(
    countryStructureDescriptions: CountryStructureDescription[],
    countryStructureId: string | undefined
  ): CountryStructureHierarchyLevel[] {
    let selectedStructureId: string | undefined = countryStructureId;

    return countryStructureDescriptions.reduceRight(
      (filtered: CountryStructureHierarchyLevel[], currentDescription, index) => {
        const foundStructure = currentDescription.structures.find(
          structure => selectedStructureId === structure.id
        );

        if (foundStructure) {
          selectedStructureId = foundStructure.parentId;
          filtered.unshift({
            ...currentDescription,
            structures: currentDescription.structures.filter(
              structure => structure.parentId === foundStructure.parentId
            ),
            selectedStructureId: foundStructure.id
          });
        } else {
          filtered.unshift({
            ...currentDescription,
            structures: currentDescription.structures.filter(
              structure => index === 0 || structure.parentId === selectedStructureId
            ),
            selectedStructureId: ''
          });
        }
        return filtered;
      },
      []
    );
  }
}
