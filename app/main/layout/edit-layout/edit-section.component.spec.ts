import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { TestingModule } from '../../../testing/testing.module';

import { EditLayoutService } from './edit-layout.service';
import { EditSectionComponent } from './edit-section.component';

@Component({
  template:
    '<gp-edit-section><ng-container marginalContent>MARGINAL</ng-container>CONTENT</gp-edit-section>'
})
class TestComponent {
  @ViewChild(EditSectionComponent)
  public editSectionComponent: EditSectionComponent;
}

class EditLayoutServiceStub {
  marginVisible = new Subject<boolean>();
  marginalColumnVisible(): boolean {
    return true;
  }
}

describe('EditSectionComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditSectionComponent, TestComponent],
        imports: [NoopAnimationsModule, TestingModule],
        providers: [{ provide: EditLayoutService, useValue: new EditLayoutServiceStub() }],
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
