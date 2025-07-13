import { HistorizationHideEditorToggleComponent } from './historization-hide-editor-toggle.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestingModule } from '../../../testing/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HistorizationHideEditorToggleComponent', () => {
  let component: HistorizationHideEditorToggleComponent;
  let fixture: ComponentFixture<HistorizationHideEditorToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistorizationHideEditorToggleComponent],
      imports: [TestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorizationHideEditorToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateHideEditorsToggle and emit event on slide toggle change', () => {
    const slider = fixture.debugElement.queryAll(By.css('mat-slide-toggle'))[0];
    const spy = spyOn(component, 'updateHideEditorsToggle');
    spyOn(component.hideEditorsToggle, 'emit');
    slider.triggerEventHandler('change', null);
    expect(component.updateHideEditorsToggle).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
