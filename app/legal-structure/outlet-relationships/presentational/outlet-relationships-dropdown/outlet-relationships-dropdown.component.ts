import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import {
  MasterOutletRelationshipService
} from '../../../../master/services/master-outlet-relationship/master-outlet-relationship.service';
import {
  MasterOutletRelationship
} from '../../../../master/services/master-outlet-relationship/master-outlet-relationship.model';

@Component({
  selector: 'gp-outlet-relationships-dropdown',
  templateUrl: './outlet-relationships-dropdown.component.html',
  styleUrls: ['./outlet-relationships-dropdown.component.scss']
})
export class OutletRelationshipsDropdownComponent implements OnInit {
  @Input()
  control: UntypedFormControl;
  @Input()
  placeholder = 'CHOOSE_RELATIONSHIP_DEF_CODE';

  outletRelationships: MasterOutletRelationship[] = [];

  constructor(
    private outletRelationshipService: MasterOutletRelationshipService,
  ) {}

  ngOnInit(): void {
    this.initOutletRelationship();
  }

  initOutletRelationship(): void {
    this.outletRelationshipService.getAll().subscribe(outletRelationship => {
      this.outletRelationships = outletRelationship;
    });
  }

  relationshipDefCodes(): string[] {
    return this.outletRelationships.map((outletRelationship) => outletRelationship.id);
  }

  relationshipDefCodeValue(value: string): string {
     const masterOutletRelationship = this.outletRelationships.find((outletRelationship) => outletRelationship.id === value);
     return masterOutletRelationship ? masterOutletRelationship.name : '';
  }
}
