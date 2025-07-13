import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ascend, sort } from 'ramda';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { TranslateOutputType } from '../../../shared/pipes/translate-data/translate-output-type.model';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { ExternalKeyType } from './external-key-type.model';
import { ExternalKeyTypeService } from './external-key-type.service';

@Component({
  selector: 'gp-external-key-type',
  templateUrl: './external-key-type-selection.component.html',
  styleUrls: ['./external-key-type-selection.component.scss']
})
export class ExternalKeyTypeSelectionComponent implements OnInit, OnDestroy {
  @Input()
  control: UntypedFormControl;
  @Input()
  readonly: Boolean = false;
  @Input()
  placeholder: string;
  @Input()
  required: boolean;
  availableExternalKeys: ExternalKeyType[];
  @Output()
  selectionChange = new EventEmitter<string>();
  @Input()
  outletId: string;

  currentSelectedLanguage?: string;
  selectedKeyType?: ExternalKeyType;
  translateOutputType = TranslateOutputType;

  private unsubscribe = new Subject<void>();

  constructor(
    private externalKeyTypeService: ExternalKeyTypeService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.externalKeyTypeService
      .getAll(this.outletId)
      .pipe(
        map((externalKeyTypes: ExternalKeyType[]) =>
          sort(
            ascend(externalKeyType => externalKeyType.name),
            externalKeyTypes
          )
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe((externalKeyTypes: ExternalKeyType[]) => {
        this.availableExternalKeys = externalKeyTypes;

        // External callers may give an ExternalKeyType with only an id. So replace the control value with the complete object
        const initialExternalKeyType = this.control.value as ExternalKeyType;
        this.selectedKeyType = this.availableExternalKeys.find(
          externalKeyType => initialExternalKeyType.id === externalKeyType.id
        );

        if (this.selectedKeyType) {
          this.control.setValue(this.selectedKeyType);
        }

        this.selectionChange.emit();
      });

    this.userSettingsService
      .getLanguageId()
      .subscribe(languageId => (this.currentSelectedLanguage = languageId));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onChange(changeEvent: MatSelectChange): void {
    this.selectionChange.emit(changeEvent.value);
    this.selectedKeyType = changeEvent.value;
    // console.log('value =>' + JSON.stringify(changeEvent.value));
  }
}
