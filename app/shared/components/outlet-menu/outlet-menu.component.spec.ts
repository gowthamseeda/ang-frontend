import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../testing/testing.module';
import { OutletMenuComponent, MenuItem } from './outlet-menu.component';

@Component({
  template: '<gp-outlet-menu [items]="menuItems"></gp-outlet-menu>'
})
class OutletMenuTestComponent {
  @ViewChild(OutletMenuComponent, { static: false })
  public menuComponent: OutletMenuComponent;
  menuItems: MenuItem[] = [{ label: 'label', action: 'action' }];
}

describe('OutletMenuComponent', () => {
  let component: OutletMenuTestComponent;
  let fixture: ComponentFixture<OutletMenuTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletMenuTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletMenuTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get menu-item from parent', () => {
    expect(component.menuItems[0].label).toBe('label');
    expect(component.menuItems[0].action).toBe('action');
  });
});
