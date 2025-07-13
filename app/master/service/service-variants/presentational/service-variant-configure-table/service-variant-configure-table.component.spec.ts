import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TestingModule } from '../../../../../testing/testing.module';
import { MasterServiceVariantMock } from '../../master-service-variant/master-service-variant.mock';
import { MasterServiceVariant } from '../../master-service-variant/master-service-variant.model';

import { ServiceVariantConfigureTableComponent } from './service-variant-configure-table.component';
@Component({
  template:
    '<gp-service-variant-configure-table [selectedServiceVariants]="selectedServiceVariant"></gp-service-variant-configure-table>'
})
class TestComponent {
  @ViewChild(ServiceVariantConfigureTableComponent)
  public serviceVariantConfigureTable: ServiceVariantConfigureTableComponent;
  selectedServiceVariant: MasterServiceVariant[] = MasterServiceVariantMock.asList();
}

describe('ServiceVariantConfigureTableComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceVariantConfigureTableComponent, TestComponent],
      imports: [
        NoopAnimationsModule,
        MatSortModule,
        MatSelectModule,
        MatFormFieldModule,
        MatTableModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit service variant', () => {
    jest.spyOn(component.serviceVariantConfigureTable.serviceVariantToUpdate, 'emit');
    component.serviceVariantConfigureTable.emitServiceVariant();

    expect(component.serviceVariantConfigureTable.serviceVariantToUpdate.emit).toHaveBeenCalled();
  });

  describe('addNewServiceVariantRow when triggering addNewServiceVariantRow', () => {
    it('should add empty row', () => {
      let currentRows = component.serviceVariantConfigureTable.serviceVariantsRows.value.length;
      component.serviceVariantConfigureTable.addNewServiceVariantRow();
      expect(component.serviceVariantConfigureTable.serviceVariantsRows.value.length).toEqual(
        currentRows + 1
      );
      const lastExternalKey = component.serviceVariantConfigureTable.serviceVariantsRows.at(
        component.serviceVariantConfigureTable.serviceVariantsRows.length - 1
      );
      expect(lastExternalKey.value.type).toBeUndefined();
    });

    it('should not add multiple empty rows when triggering addNewServiceVariantRow more than once', () => {
      let currentRows = component.serviceVariantConfigureTable.serviceVariantsRows.value.length;
      component.serviceVariantConfigureTable.addNewServiceVariantRow();
      component.serviceVariantConfigureTable.addNewServiceVariantRow();
      expect(component.serviceVariantConfigureTable.serviceVariantsRows.value.length).toEqual(
        currentRows + 1
      );
    });
  });
});
