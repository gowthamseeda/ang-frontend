import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';

import { TestingModule } from '../../../testing/testing.module';

import { CreationMenuComponent } from './creation-menu.component';

describe('MenuComponent', () => {
  let component: CreationMenuComponent;
  let fixture: ComponentFixture<CreationMenuComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestingModule],
        declarations: [CreationMenuComponent, NgxPermissionsAllowStubDirective],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
