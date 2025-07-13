import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { BrandCodeService } from '../../../../traits/shared/brand-code/brand-code.service';
import { DuplicateKeysMessageComponent } from './duplicate-keys-message.component';
import { KeyTableService } from '../../../../traits/keys/key-table/key-table.service';
import { FederalIdService } from '../../../../traits/keys/federal-id/federal-id.service';

export class TranslateServiceStub {
  public currentLang = 'de-de';
  onLangChange: EventEmitter<any> = new EventEmitter();
  onTranslationChange: EventEmitter<any> = new EventEmitter();
  onDefaultLangChange: EventEmitter<any> = new EventEmitter();
  get() {
    return of({});
  }
  use() {
    return of({});
  }
}

describe('DuplicateKeysMessageComponent', () => {
  let component: DuplicateKeysMessageComponent;
  let fixture: ComponentFixture<DuplicateKeysMessageComponent>;
  let brandCodeServiceSpy: Spy<BrandCodeService>;
  let federalIdServiceSpy: Spy<FederalIdService>;
  let keyTableServiceSpy: Spy<KeyTableService>;

  beforeEach(
    waitForAsync(() => {
      brandCodeServiceSpy = createSpyFromClass(BrandCodeService);
      federalIdServiceSpy = createSpyFromClass(FederalIdService);
      keyTableServiceSpy = createSpyFromClass(KeyTableService);
      brandCodeServiceSpy = createSpyFromClass(BrandCodeService);

      keyTableServiceSpy.saveKeys.nextWith();

      TestBed.configureTestingModule({
        imports: [TranslateModule],
        declarations: [DuplicateKeysMessageComponent],
        providers: [
          {
            provide: BrandCodeService,
            useValue: brandCodeServiceSpy
          },
          {
            provide: FederalIdService,
            useValue: federalIdServiceSpy
          },
          {
            provide: KeyTableService,
            useValue: keyTableServiceSpy
          },
          { provide: TranslateService, useClass: TranslateServiceStub }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateKeysMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
