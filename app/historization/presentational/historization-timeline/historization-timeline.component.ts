import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import _ from 'lodash';
import moment from 'moment';
import { SnapshotEntry } from '../../models/outlet-history-snapshot.model';

interface Node {
  id: string;
  label: string;
  children?: Node[];
  selected?: boolean;
}

interface FlatNode {
  id: string;
  label: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'gp-historization-timeline',
  templateUrl: './historization-timeline.component.html',
  styleUrls: ['./historization-timeline.component.scss']
})
export class HistorizationTimelineComponent implements OnInit, OnChanges {
  @Input()
  snapshotEntries: SnapshotEntry[];
  @Output()
  selectedDate: EventEmitter<string> = new EventEmitter<string>();

  private transformer = (node: Node, level: number) => {
    return {
      id: node.id,
      label: node.label,
      selected: node.selected,
      level,
      expandable: !!node.children && node.children.length > 0
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private nodes: SnapshotEntry[];
  private groupedNodes: Node[];
  private currentSelectedDate: string;
  private expandedNodes: FlatNode[];

  hasChild = (_: number, node: FlatNode) => node.expandable;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.nodes = this.snapshotEntries;
    if (this.nodes && this.nodes.length !== 0) {
      this.groupedNodes = this.groupNodes(this.nodes);
      this.dataSource.data = this.groupedNodes;
      this.selectExpandFirstNode();
    }
  }

  onNodeClick(newSelectedDate: string): void {
    if (this.currentSelectedDate === newSelectedDate) {
      return;
    }

    this.saveExpandedNodes();
    this.groupedNodes = this.groupNodes(this.nodes, newSelectedDate);
    this.dataSource.data = this.groupedNodes;
    this.restoreExpandedNodes();

    this.currentSelectedDate = newSelectedDate;
    this.selectedDate.emit(this.currentSelectedDate);
  }

  private selectExpandFirstNode(): void {
    const firstNodeDate = this.nodes[0].group;
    this.onNodeClick(firstNodeDate);
    [
      moment(firstNodeDate).format('YYYY'),
      moment(firstNodeDate).format('YYYY-MM'),
      firstNodeDate
    ].map(id => {
      this.treeControl.expand(<FlatNode>this.treeControl.dataNodes.find(node => node.id === id));
    });
  }

  private groupNodes(nodes: SnapshotEntry[], newSelectedDate?: string): Node[] {
    let groupedNodes: any = _.groupBy(nodes, node => {
      return moment(node.group).format('YYYY');
    });

    Object.keys(groupedNodes).map((key: string) => {
      groupedNodes[key] = _.groupBy(groupedNodes[key], node => {
        return moment(node.group).format('MM');
      });
    });

    return this.orderByYear(groupedNodes, newSelectedDate);
  }

  private orderByYear(groupedNodes: any, newSelectedDate?: string): Node[] {
    let nodes = Object.keys(groupedNodes).map(year => {
      return {
        id: year,
        label: year,
        selected: newSelectedDate?.includes(year),
        children: this.orderByMonth(groupedNodes[year], year, newSelectedDate)
      };
    });

    return _.orderBy(nodes, node => node.id, 'desc');
  }

  private orderByMonth(groupedNodes: any, year: string, newSelectedDate?: string): Node[] {
    let nodes = Object.keys(groupedNodes).map(month => {
      return {
        id: `${year}-${month}`,
        label: moment.months(+month - 1),
        selected: newSelectedDate?.includes(`${year}-${month}`),
        children: this.orderByDay(groupedNodes[month], newSelectedDate)
      };
    });

    return _.orderBy(nodes, node => node.id, 'desc');
  }

  private orderByDay(groupedNodes: SnapshotEntry[], newSelectedDate?: string): Node[] {
    let nodes = groupedNodes.map(({ group }: SnapshotEntry) => {
      return {
        id: group,
        label: moment(group).format('Do, dddd'),
        selected: group === newSelectedDate
      };
    });

    return _.orderBy(nodes, node => node.id, 'desc');
  }

  private saveExpandedNodes(): void {
    this.expandedNodes = this.treeControl.dataNodes.filter(
      node => node.expandable && this.treeControl.isExpanded(node)
    );
  }

  private restoreExpandedNodes(): void {
    this.expandedNodes.forEach(node => {
      this.treeControl.expand(<FlatNode>this.treeControl.dataNodes.find(n => n.id === node.id));
    });
  }
}
