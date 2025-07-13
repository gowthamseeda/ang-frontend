import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MasterComponent } from './master.component';
import { TestingModule } from '../testing/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MasterComponent', () => {
  let component: MasterComponent;
  let fixture: ComponentFixture<MasterComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MasterComponent],
        imports: [TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
