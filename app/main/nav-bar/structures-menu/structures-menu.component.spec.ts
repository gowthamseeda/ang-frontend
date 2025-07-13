import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';

import { TestingModule } from '../../../testing/testing.module';

import { StructuresMenuComponent } from './structures-menu.component';

describe('MarketStructureComponent', () => {
  let component: StructuresMenuComponent;
  let fixture: ComponentFixture<StructuresMenuComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestingModule],
        declarations: [StructuresMenuComponent, NgxPermissionsAllowStubDirective],
        providers: [{ provide: MatDialog, useValue: {} }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuresMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
