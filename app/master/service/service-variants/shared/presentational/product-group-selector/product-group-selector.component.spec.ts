import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TestingModule } from '../../../../../../testing/testing.module';
import { MasterProductGroupMock } from '../../../../../product-group/master-product-group/master-product-group.mock';
import { MasterProductGroupService } from '../../../../../product-group/master-product-group/master-product-group.service';

import { ProductGroupSelectorComponent } from './product-group-selector.component';

@Component({
  template: '<gp-product-group-selector [control]="control">' + '</gp-product-group-selector>'
})
class TestComponent {
  @ViewChild(ProductGroupSelectorComponent)
  public productGroupSelector: ProductGroupSelectorComponent;
  control = new FormControl([]);
}

describe('ProductGroupSelectorComponent', () => {
  const masterProductGroupMock = MasterProductGroupMock.asList();

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let productGroupServiceSpy: Spy<MasterProductGroupService>;

  beforeEach(
    waitForAsync(() => {
      productGroupServiceSpy = createSpyFromClass(MasterProductGroupService);
      productGroupServiceSpy.getAll.nextWith(masterProductGroupMock);

      TestBed.configureTestingModule({
        declarations: [ProductGroupSelectorComponent, TestComponent],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [{ provide: MasterProductGroupService, useValue: productGroupServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
