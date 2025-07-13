import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestingModule } from '../../../testing/testing.module';
import { HistorizationHideExtraInformationToggleComponent } from './historization-hide-extra-information-toggle.component';

describe('HistorizationHideExtraInformationToggleComponent', () => {
  let component: HistorizationHideExtraInformationToggleComponent;
  let fixture: ComponentFixture<HistorizationHideExtraInformationToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistorizationHideExtraInformationToggleComponent],
      imports: [TestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorizationHideExtraInformationToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateHideExtraInformationToggle and emit event on slide toggle change', () => {
    const slider = fixture.debugElement.queryAll(By.css('mat-slide-toggle'))[0];
    const spy = spyOn(component, 'updateHideExtraInformationToggle');
    spyOn(component.hideExtraInformationToggle, 'emit');
    slider.triggerEventHandler('change', null);
    expect(component.updateHideExtraInformationToggle).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
