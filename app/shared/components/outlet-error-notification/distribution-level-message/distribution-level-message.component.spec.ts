import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { DistributionLevelMessageComponent } from './distribution-level-message.component';

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

describe('DistributionLevelMessageComponent', () => {
  let component: DistributionLevelMessageComponent;
  let fixture: ComponentFixture<DistributionLevelMessageComponent>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let outletServiceSpy: Spy<OutletService>;

  beforeEach(
    waitForAsync(() => {
      distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
      outletServiceSpy = createSpyFromClass(OutletService);

      outletServiceSpy.outletChanges.nextWith();

      TestBed.configureTestingModule({
        imports: [TranslateModule],
        declarations: [DistributionLevelMessageComponent],
        providers: [
          { provide: TranslateService, useClass: TranslateServiceStub },
          { provide: OutletService, useValue: outletServiceSpy },
          { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionLevelMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
