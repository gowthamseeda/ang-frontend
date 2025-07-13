import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { isArray } from 'lodash';
import { clone } from 'ramda';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnapshotEntry } from '../../models/outlet-history-snapshot.model';
import {
  outletHistoryDataClusterFields,
  outletHistoryNodes
} from '../../models/outlet-history-tree.constants';
import {
  OutletHistoryDataCluster,
  OutletHistoryFlatNode,
  OutletHistoryNode
} from '../../models/outlet-history-tree.model';
import { ToggleService } from '../../service/toggle.service';

@Component({
  selector: 'gp-history-snapshot',
  templateUrl: './history-snapshot.component.html',
  styleUrls: ['./history-snapshot.component.scss']
})
export class HistorySnapshotComponent implements OnInit, OnChanges {
  @Input()
  isUserCountryPermitted: boolean;

  @Input()
  selectedDate: string;

  @Input()
  currentSnapshot?: SnapshotEntry;

  @Input()
  comparingSnapshot?: SnapshotEntry;

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  hideEditorsToggleInput: boolean;

  @Input()
  expandAllNodeToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;

  @Input()
  hideAdditionalTranslationsToggleInput: boolean;

  @Input()
  hideExtraInformationToggleInput: boolean

  treeControl: FlatTreeControl<OutletHistoryFlatNode>;
  treeFlattener: MatTreeFlattener<OutletHistoryNode, OutletHistoryFlatNode>;
  dataSource: MatTreeFlatDataSource<OutletHistoryNode, OutletHistoryFlatNode>;
  private expandedNodes: OutletHistoryFlatNode[];
  private unsubscribe = new Subject<void>();
  changedNode = new Set<OutletHistoryDataCluster>();

  hasChild = (_: number, node: OutletHistoryFlatNode) => node.expandable;

  constructor(private toggleService: ToggleService) {
    this.treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );

    this.treeControl = new FlatTreeControl<OutletHistoryFlatNode>(
      node => node.level,
      node => node.expandable
    );

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit(): void {
    this.detectExpandAll();
  }

  ngOnChanges(): void {
    this.filterChangedNodes();
    this.saveExpandedNodes();
    this.dataSource.data = this.setSnapshots(clone(outletHistoryNodes));
    this.detectExpandAll();
    this.restoreExpandedNodes();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private setSnapshots(nodes: OutletHistoryNode[]): OutletHistoryNode[] {
    return nodes.map(node => {
      if (node.children) {
        this.setSnapshots(node.children);
      } else {
        node.children = [
          {
            dataCluster: node.dataCluster,
            currentSnapshot: this.currentSnapshot?.snapshot,
            comparingSnapshot: this.comparingSnapshot?.snapshot,
            changes: this.currentSnapshot?.changes
          }
        ];
      }
      return node;
    });
  }

  private _transformer = (node: OutletHistoryNode, level: number) => {
    return {
      dataCluster: node.dataCluster,
      currentSnapshot: node.currentSnapshot,
      comparingSnapshot: node.comparingSnapshot,
      changes: node.changes,
      level: level,
      expandable: !!node.children && node.children.length > 0
    };
  };

  private saveExpandedNodes(): void {
    this.expandedNodes = this.treeControl.dataNodes?.filter(
      node => node.expandable && this.treeControl.isExpanded(node)
    );
  }

  private restoreExpandedNodes(): void {
    this.expandedNodes?.forEach(node => {
      this.treeControl.expand(
        <OutletHistoryFlatNode>(
          this.treeControl.dataNodes.find(n => n.dataCluster === node.dataCluster)
        )
      );
    });
  }

  private filterChangedNodes() {
    this.changedNode.clear();
    for (let outletHistoryDataClusterKey in OutletHistoryDataCluster) {
      this.detectNodeChange(OutletHistoryDataCluster[outletHistoryDataClusterKey]);
    }
    this.treeReconstruct();
  }

  detectNodeChange(node: OutletHistoryDataCluster) {
    outletHistoryDataClusterFields[node]?.fields.forEach(field => {
      if (this.determineSnapshotChange(field.fieldName)) {
        this.changedNode.add(node);
      }
    });
  }

  determineSnapshotChange(fieldName: string): boolean {
    const currentSnapshotField = this.currentSnapshot?.snapshot[fieldName];
    if (this.comparingSnapshot !== undefined) {
      return (
        JSON.stringify(currentSnapshotField) !=
        JSON.stringify(this.comparingSnapshot?.snapshot[fieldName])
      );
    } else {
      if (isArray(currentSnapshotField)) {
        return !(currentSnapshotField.length === 0);
      }
      return !!currentSnapshotField;
    }
  }

  treeReconstruct(): void {
    while (outletHistoryNodes.length) {
      outletHistoryNodes.pop();
    }
    if (this.showChangeOnlyToggleInput) {
      for (let outletHistoryDataClusterKey in OutletHistoryDataCluster) {
        this.changedNode.forEach(node => {
          if (node == OutletHistoryDataCluster[outletHistoryDataClusterKey]) {
            outletHistoryNodes.push({
              dataCluster: OutletHistoryDataCluster[outletHistoryDataClusterKey]
            });
          }
        });
      }
    } else {
      for (let outletHistoryDataClusterKey in OutletHistoryDataCluster) {
        outletHistoryNodes.push({
          dataCluster: OutletHistoryDataCluster[outletHistoryDataClusterKey]
        });
      }
    }
  }

  private detectExpandAll(): void {
    this.toggleService.expandAll$.pipe(takeUntil(this.unsubscribe)).subscribe(expandAll => {
      if (expandAll) this.treeControl.expandAll();
      else this.treeControl.collapseAll();
    });
  }
}
