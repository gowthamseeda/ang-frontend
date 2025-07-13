import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

import { KeyType, keyTypeFilter } from '../key-type.model';
import { KeysService } from '../keys.service';
import {MasterKeyService} from "../../../master/services/master-key/master-key.service";
import {MasterKeyType} from "../../../master/services/master-key/master-key.model";
import {SortingService} from "../../../shared/services/sorting/sorting.service";

@Component({
  selector: 'gp-key-type-selection',
  templateUrl: './key-type-selection.component.html',
  styleUrls: ['./key-type-selection.component.scss']
})
export class KeyTypeSelectionComponent implements OnInit, OnDestroy {
  @Input()
  readonly = false;
  required = true;
  @Input()
  placeholder: string;
  @Input()
  control: UntypedFormControl;
  @Input()
  countryId: string | null;
  @Input()
  selectedKeyTypes: KeyType[] = [];
  @Input()
  excludedKeyTypes: KeyType[] = [];

  keyTypes: KeyType[] = [];
  masterKeyTypes: MasterKeyType[] = [];

  private unsubscribe = new Subject<void>();

  constructor(
    private keysService: KeysService,
    private masterKeyService: MasterKeyService,
    private sortingService: SortingService
  ) {}

  ngOnInit(): void {
    if(this.countryId) {
      this.keysService
        .getUpdatableKeyTypesBy(this.countryId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((keyTypes: KeyType[]) => (this.keyTypes = keyTypes));
    } else {
      this.masterKeyService
        .getAll()
        .pipe(map((keyTypes: MasterKeyType[]) => keyTypes.sort(this.sortingService.sortByName)))
        .subscribe((keyTypes: MasterKeyType[]) => {
          this.masterKeyTypes = keyTypes;
        });
      ;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get filteredKeyTypes(): KeyType[] {
    return keyTypeFilter(this.keyTypes, this.selectedKeyTypes, this.excludedKeyTypes);
  }
}
