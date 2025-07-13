import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InactiveChipDirective } from './inactive-chip.directive';

@Component({
  template: `
    <mat-basic-chip gpInactiveChip>
      Inactive Chip
    </mat-basic-chip>
  `
})
class TestContentContainerComponent {}

describe('InactiveChipDirective', () => {
  let component: TestContentContainerComponent;
  let fixture: ComponentFixture<TestContentContainerComponent>;
  let chip: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InactiveChipDirective, TestContentContainerComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContentContainerComponent);
    component = fixture.componentInstance;
    chip = fixture.debugElement.query(By.css('mat-basic-chip'));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new InactiveChipDirective(chip);
    expect(directive).toBeTruthy();

    expect(component).toBeTruthy();
  });

  it('should apply style', () => {
    expect(chip.nativeElement.style.borderColor).toEqual('#9e9e9e');
    expect(chip.nativeElement.style.color).toEqual('rgb(158, 158, 158)');
  });
});
