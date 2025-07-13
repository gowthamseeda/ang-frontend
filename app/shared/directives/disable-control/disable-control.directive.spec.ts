import { Component, DebugElement } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DisableControlDirective } from './disable-control.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <form [formGroup]="testGroup">
      <input type="text" formControlName="testControl" id="testControl" [gpDisableControl]="mode" />
    </form>
  `
})
class TestDisableControlComponent {
  testGroup = new FormGroup({
    testControl: new FormControl([''])
  });
  mode = true;
}

describe('DisableControlDirective', () => {
  let component: TestDisableControlComponent;
  let fixture: ComponentFixture<TestDisableControlComponent>;
  let controlInput: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [TestDisableControlComponent, DisableControlDirective]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDisableControlComponent);
    component = fixture.componentInstance;
    controlInput = fixture.debugElement.query(By.css('input#testControl'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('input should be disabled', () => {
    expect(controlInput.nativeElement.disabled).toBe(true);
  });
});
