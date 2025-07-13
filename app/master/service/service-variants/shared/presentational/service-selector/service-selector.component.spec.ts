import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TestingModule } from '../../../../../../testing/testing.module';
import { MasterServiceMock } from '../../../../master-service/master-service.mock';
import { MasterServiceService } from '../../../../master-service/master-service.service';

import { ServiceSelectorComponent } from './service-selector.component';

@Component({
  template: '<gp-service-selector [control]="control">' + '</gp-service-selector>'
})
class TestComponent {
  @ViewChild(ServiceSelectorComponent)
  public serviceSelector: ServiceSelectorComponent;
  control = new FormControl([]);
}

describe('ServiceSelectorComponent', () => {
  const masterServiceMock = MasterServiceMock.asList();

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let serviceServiceSpy: Spy<MasterServiceService>;

  beforeEach(
    waitForAsync(() => {
      serviceServiceSpy = createSpyFromClass(MasterServiceService);
      serviceServiceSpy.getAll.nextWith(masterServiceMock);

      TestBed.configureTestingModule({
        declarations: [ServiceSelectorComponent, TestComponent],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [{ provide: MasterServiceService, useValue: serviceServiceSpy }],
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
