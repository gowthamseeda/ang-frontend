import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { BrandService } from '../../../../services/brand/brand.service';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';
import { TestingModule } from '../../../../testing/testing.module';
import { getBrandIds, getBrandLabelAssignments } from '../assigned-brand-labels.mock';
import { AssignedBrandLabelsService } from '../assigned-brand-labels.service';

import { LabelsTileComponent } from './labels-tile.component';

@Component({
  template: '<gp-labels-tile [outletId]="outletId"></gp-labels-tile>'
})
class TestComponent {
  @ViewChild(LabelsTileComponent)
  labelsTileComponent: LabelsTileComponent;
  outletId = 'GS0000001';
}

describe('LabelsTileComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let assignedBrandLabelsServiceSpy: Spy<AssignedBrandLabelsService>;
  let brandServiceSpy: Spy<BrandService>;
  const translateServiceMock = {
    onLangChange: of('de-DE'),
    instant(arg) {
      if (arg === 'TILE_DETAILS_EDIT') {
        return 'EDIT DETAILS';
      }
      return 'SHOW DETAILS';
    }
  };

  beforeEach(
    waitForAsync(() => {
      assignedBrandLabelsServiceSpy = createSpyFromClass(AssignedBrandLabelsService);
      brandServiceSpy = createSpyFromClass(BrandService);

      TestBed.configureTestingModule({
        declarations: [LabelsTileComponent, TestComponent, TranslateDataPipe],
        imports: [TestingModule],
        providers: [
          { provide: AssignedBrandLabelsService, useValue: assignedBrandLabelsServiceSpy },
          { provide: BrandService, useValue: brandServiceSpy },
          { provide: TranslateService, useValue: translateServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    brandServiceSpy.getAllIds.nextWith(getBrandIds());
    assignedBrandLabelsServiceSpy.getBrandLabelAssignments.nextWith([]);

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be empty', () => {
    assignedBrandLabelsServiceSpy.getBrandLabelAssignments.nextWith(getBrandLabelAssignments());
    fixture.detectChanges();

    expect(component.labelsTileComponent.isEmpty()).toBe(false);
  });

  it('should be empty', () => {
    expect(component.labelsTileComponent.isEmpty()).toBe(true);
  });

  it('should get sorted label groups brand ids', () => {
    assignedBrandLabelsServiceSpy.getBrandLabelAssignments.nextWith(getBrandLabelAssignments());
    fixture.detectChanges();
    expect(component.labelsTileComponent.labels[0].brandIds).toEqual(['MB', 'SMT']);
  });
});
