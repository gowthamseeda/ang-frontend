import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { TestingModule } from '../../../testing/testing.module';
import { LabelSelectionComponent } from './label-selection.component';
import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';

@Component({
  template: '<gp-label-selection [control]="control"></gp-label-selection>'
})
class TestComponent {
  @ViewChild(LabelSelectionComponent)
  public labelSelection: LabelSelectionComponent;
  control = new FormControl([]);
}

describe('LabelSelectionComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  const translateServiceMock = {
    onLangChange: of('de-DE')
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LabelSelectionComponent, TestComponent, TranslateDataPipe],
        imports: [ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [{ provide: TranslateService, useValue: translateServiceMock }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
