import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  defaultGroupedNodesMock,
  newSelectedGroupedNodesMock,
  snapshotEntriesMock
} from '../../models/historization-timeline.mock';

import { HistorizationTimelineComponent } from './historization-timeline.component';

describe('HistorizationTimelineComponent', () => {
  let component: HistorizationTimelineComponent;
  let fixture: ComponentFixture<HistorizationTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorizationTimelineComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorizationTimelineComponent);
    component = fixture.componentInstance;
    component.snapshotEntries = snapshotEntriesMock;
    component.ngOnChanges({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should group nodes', () => {
    expect(component.dataSource.data).toEqual(defaultGroupedNodesMock);
  });

  it('should handle on node click', function () {
    component.onNodeClick(snapshotEntriesMock[snapshotEntriesMock.length - 1].group);
    expect(component.dataSource.data).toEqual(newSelectedGroupedNodesMock);
  });
});
