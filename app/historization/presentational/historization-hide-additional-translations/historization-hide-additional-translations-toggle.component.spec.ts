import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestingModule } from '../../../testing/testing.module';
import { HistorizationHideAdditionalTranslationsToggleComponent } from './historization-hide-additional-translations-toggle.component';

describe('HistorizationHideAdditionalTranslationsToggleComponent', () => {
  let component: HistorizationHideAdditionalTranslationsToggleComponent;
  let fixture: ComponentFixture<HistorizationHideAdditionalTranslationsToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistorizationHideAdditionalTranslationsToggleComponent],
      imports: [TestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorizationHideAdditionalTranslationsToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateHideAdditionalTranslationsToggle and emit event on slide toggle change', () => {
    const slider = fixture.debugElement.queryAll(By.css('mat-slide-toggle'))[0];
    const spy = spyOn(component, 'updateHideAdditionalTranslationsToggle');
    spyOn(component.hideAdditionalTranslationsToggle, 'emit');
    slider.triggerEventHandler('change', null);
    expect(component.updateHideAdditionalTranslationsToggle).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
