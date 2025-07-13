import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';
import { TestingModule } from '../../../testing/testing.module';
import {SingleBrandSelectionComponent} from "./single-brand-selection.component";
import {BrandService} from "../../../services/brand/brand.service";

function getFormGroup(): FormGroup {
  return new FormBuilder().group({});
}

@Component({
  template: '<gp-single-brand-selection [parentForm]="parentForm"></gp-single-brand-selection>'
})
class TestComponent {
  @ViewChild(SingleBrandSelectionComponent)
  public singleBrandSelectionComponent: SingleBrandSelectionComponent;
  formControl = new FormControl('');
  parentForm = getFormGroup();
}

describe('SingleBrandSelectionComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let brandServiceSpy: Spy<BrandService>;

  beforeEach(
    waitForAsync(() => {
      brandServiceSpy = createSpyFromClass(BrandService);

      const translateServiceMock = {
        onLangChange: of('de-DE')
      };

      TestBed.configureTestingModule({
        declarations: [SingleBrandSelectionComponent, TestComponent, TranslateDataPipe],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [
          { provide: BrandService, useValue: brandServiceSpy },
          { provide: TranslateService, useValue: translateServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load all brands', done => {
      const brandsMock = [
        { id: '1', name: 'Brand 1' },
        { id: '2', name: 'Brand 2' }
      ];
      brandServiceSpy.getAll.nextWith(brandsMock);
      fixture.detectChanges();

      component.singleBrandSelectionComponent.allBrands.subscribe(brands => {
        expect(brands).toEqual(brandsMock);
        done();
      });
    });
  });
});
