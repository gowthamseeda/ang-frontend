import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';

import { OutletTranslationPoBoxComponent } from './outlet-translation-po-box.component';

function getFormMock() {
  return new UntypedFormBuilder().group({});
}

describe('OutletTranslationPoBoxComponent', () => {
  let component: OutletTranslationPoBoxComponent;
  let fixture: ComponentFixture<OutletTranslationPoBoxComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletTranslationPoBoxComponent, TranslatePipeMock],
        providers: [UntypedFormBuilder],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletTranslationPoBoxComponent);
    component = fixture.componentInstance;
    component.parentForm = getFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
