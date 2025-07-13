import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';

import { TestingModule } from '../../../testing/testing.module';

import { SnapshotBusinessNamesComponent } from './snapshot-business-names.component';

describe('SnapshotBusinessNamesComponent', () => {
  let component: SnapshotBusinessNamesComponent;
  let fixture: ComponentFixture<SnapshotBusinessNamesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SnapshotBusinessNamesComponent],
        imports: [TestingModule, PipesModule],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotBusinessNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
