import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestingModule } from '../../../testing/testing.module';
import { outletSnapshotEntriesMock } from '../../models/outlet-history-snapshot.mock';
import {
  OutletHistoryDataCluster,
  OutletHistoryNode
} from '../../models/outlet-history-tree.model';
import { ToggleService } from '../../service/toggle.service';

import { HistorySnapshotComponent } from './history-snapshot.component';
import { outletHistoryNodes } from '../../models/outlet-history-tree.constants';

describe('HistorySnapshotComponent', () => {
  let component: HistorySnapshotComponent;
  let fixture: ComponentFixture<HistorySnapshotComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HistorySnapshotComponent],
        imports: [TestingModule],
        providers: [ToggleService],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorySnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.currentSnapshot = outletSnapshotEntriesMock[0];
    component.comparingSnapshot = outletSnapshotEntriesMock[1];

    component.ngOnChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set datasource data based on outletHistoryNodes', () => {
      const expectData = [
        {
          dataCluster: OutletHistoryDataCluster.BASE_DATA,
          children: [
            {
              dataCluster: OutletHistoryDataCluster.BASE_DATA,
              currentSnapshot: outletSnapshotEntriesMock[0].snapshot,
              comparingSnapshot: outletSnapshotEntriesMock[1].snapshot
            }
          ]
        },
        {
          dataCluster: OutletHistoryDataCluster.LEGAL_INFO,
          children: [
            {
              dataCluster: OutletHistoryDataCluster.LEGAL_INFO,
              currentSnapshot: outletSnapshotEntriesMock[0].snapshot,
              comparingSnapshot: outletSnapshotEntriesMock[1].snapshot
            }
          ]
        },
        {
          dataCluster: OutletHistoryDataCluster.OFFERED_SERVICES,
          children: [
            {
              dataCluster: OutletHistoryDataCluster.OFFERED_SERVICES,
              currentSnapshot: outletSnapshotEntriesMock[0].snapshot,
              comparingSnapshot: outletSnapshotEntriesMock[1].snapshot
            }
          ]
        },
        {
          dataCluster: OutletHistoryDataCluster.ASSIGNED_KEYS,
          children: [
            {
              dataCluster: OutletHistoryDataCluster.ASSIGNED_KEYS,
              currentSnapshot: outletSnapshotEntriesMock[0].snapshot,
              comparingSnapshot: outletSnapshotEntriesMock[1].snapshot
            }
          ]
        },
        {
          dataCluster: OutletHistoryDataCluster.ASSIGNED_LABELS,
          children: [
            {
              dataCluster: OutletHistoryDataCluster.ASSIGNED_LABELS,
              currentSnapshot: outletSnapshotEntriesMock[0].snapshot,
              comparingSnapshot: outletSnapshotEntriesMock[1].snapshot
            }
          ]
        },
        {
          dataCluster: OutletHistoryDataCluster.GENERAL_COMMUNICATIONS,
          children: [
            {
              dataCluster: OutletHistoryDataCluster.GENERAL_COMMUNICATIONS,
              currentSnapshot: outletSnapshotEntriesMock[0].snapshot,
              comparingSnapshot: outletSnapshotEntriesMock[1].snapshot
            }
          ]
        },
        {
          dataCluster: OutletHistoryDataCluster.OUTLET_RELATIONSHIP,
          children: [
            {
              dataCluster: OutletHistoryDataCluster.OUTLET_RELATIONSHIP,
              currentSnapshot: outletSnapshotEntriesMock[0].snapshot,
              comparingSnapshot: outletSnapshotEntriesMock[1].snapshot
            }
          ]
        }
      ] as OutletHistoryNode[];

      expect(component.dataSource.data).toEqual(expectData);
    });
  });

  describe('expand or collapse', () => {
    it('should expand all nodes when _expandAll is true', () => {
      jest.spyOn(component.treeControl, 'expandAll');
      jest.spyOn(component.treeControl, 'collapseAll');
      component['toggleService'].setExpandAll(true);
      component.ngOnInit();
      expect(component.treeControl.expandAll).toHaveBeenCalled();
      expect(component.treeControl.collapseAll).not.toHaveBeenCalled();
    });

    it('should collapse all nodes when _expandAll is false', () => {
      jest.spyOn(component.treeControl, 'expandAll');
      jest.spyOn(component.treeControl, 'collapseAll');
      component['toggleService'].setExpandAll(false);
      component.ngOnInit();
      expect(component.treeControl.collapseAll).toHaveBeenCalled();
      expect(component.treeControl.expandAll).not.toHaveBeenCalled();
    });
  });

  describe('Filter unchanged node', () => {
    it('should only store the BASE_DATA when only BASE_DATA legalName is changed', () => {
      const expectData = new Set<OutletHistoryDataCluster>();
      expectData.add(OutletHistoryDataCluster.BASE_DATA);
      for (let outletHistoryDataClusterKey in OutletHistoryDataCluster) {
        component.detectNodeChange(OutletHistoryDataCluster[outletHistoryDataClusterKey]);
      }
      expect(component.changedNode).toEqual(expectData);
    });

    it('should filter all node except BASE_DATA when only BASE_DATA is changed and showChangeOnlyToggleInput is true', () => {
      const expectData = [
        {
          dataCluster: OutletHistoryDataCluster.BASE_DATA
        }
      ] as OutletHistoryNode[];
      const changedNodes = new Set<OutletHistoryDataCluster>();
      changedNodes.add(OutletHistoryDataCluster.BASE_DATA);
      component.showChangeOnlyToggleInput = true;
      component.treeReconstruct();
      expect(outletHistoryNodes).toEqual(expectData);
    });

    it('should restore all node when showChangeOnlyToggleInput is false', () => {
      const expectData = [
        {
          dataCluster: OutletHistoryDataCluster.BASE_DATA
        },
        {
          dataCluster: OutletHistoryDataCluster.LEGAL_INFO
        },
        {
          dataCluster: OutletHistoryDataCluster.OFFERED_SERVICES
        },
        {
          dataCluster: OutletHistoryDataCluster.ASSIGNED_KEYS
        },
        {
          dataCluster: OutletHistoryDataCluster.ASSIGNED_LABELS
        },
        {
          dataCluster: OutletHistoryDataCluster.GENERAL_COMMUNICATIONS
        },
{
          dataCluster: OutletHistoryDataCluster.OUTLET_RELATIONSHIP
        }
      ] as OutletHistoryNode[];
      const changedNodes = new Set<OutletHistoryDataCluster>();
      changedNodes.add(OutletHistoryDataCluster.BASE_DATA);
      component.showChangeOnlyToggleInput = false;
      component.treeReconstruct();
      expect(outletHistoryNodes).toEqual(expectData);
    });
  });
});
