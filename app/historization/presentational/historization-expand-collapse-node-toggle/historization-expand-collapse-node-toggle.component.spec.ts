import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestingModule } from '../../../testing/testing.module';
import { ToggleService } from '../../service/toggle.service';

import { HistorizationExpandCollapseNodeToggleComponent } from './historization-expand-collapse-node-toggle.component';

describe('HistorizationExpandCollapseNodeToggleComponent', () => {
  let component: HistorizationExpandCollapseNodeToggleComponent;
  let fixture: ComponentFixture<HistorizationExpandCollapseNodeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorizationExpandCollapseNodeToggleComponent],
      imports: [TestingModule],
      providers: [ToggleService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorizationExpandCollapseNodeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateExpandNodeToggle and emit event on slide toggle change ', () => {
    const slider = fixture.debugElement.queryAll(By.css('mat-slide-toggle'))[0];
    jest.spyOn(component, 'updateExpandCollapseNodeToggle');

    slider.triggerEventHandler('change', true);
    expect(component.updateExpandCollapseNodeToggle).toHaveBeenCalledWith(true);
  });
});
