import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';

import { TestingModule } from '../../../testing/testing.module';
import { SnapshotPredecessorsComponent } from './snapshot-predecessors.component';

describe('SnapshotPredecessorsComponent', () => {
  let component: SnapshotPredecessorsComponent;
  let fixture: ComponentFixture<SnapshotPredecessorsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SnapshotPredecessorsComponent],
        imports: [TestingModule, PipesModule],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotPredecessorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
