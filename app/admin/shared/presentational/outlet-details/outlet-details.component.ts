import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { OutletStatus } from '../../models/outlet.model';

export class OutletDetailsDescription {
  previousHeader: string;
  previousAddIconTooltip: string;
  previousRemoveIconTooltip: string;
  currentHeader: string;
  currentAddIconTooltip: string;
  currentRemoveIconTooltip: string;
}

@Component({
  selector: 'gp-outlet-details',
  templateUrl: './outlet-details.component.html',
  styleUrls: ['./outlet-details.component.scss']
})
export class OutletDetailsComponent implements OnInit {
  @Input()
  description: OutletDetailsDescription;

  @Input()
  selectedOutlet: OutletStatus;

  @Input()
  disabledAllButton: boolean;

  @Output()
  outletDetailsChanged: EventEmitter<OutletStatus> = new EventEmitter<OutletStatus>();

  constructor() {}

  ngOnInit(): void {}

  plusPreviousOutlet(): void {
    this.selectedOutlet.isAddPreviousSelected = true;
    this.selectedOutlet.isAddCurrentSelected = false;
    this.outletDetailsChanged.emit(this.selectedOutlet);
  }

  minusPreviousOutlet(): void {
    this.setAllToFalse();
    this.selectedOutlet.previous = null;
    this.outletDetailsChanged.emit(this.selectedOutlet);
  }

  plusCurrentOutlet(): void {
    this.selectedOutlet.isAddPreviousSelected = false;
    this.selectedOutlet.isAddCurrentSelected = true;
    this.outletDetailsChanged.emit(this.selectedOutlet);
  }

  minusCurrentOutlet(): void {
    this.setAllToFalse();
    this.selectedOutlet.current = null;
    this.outletDetailsChanged.emit(this.selectedOutlet);
  }

  private setAllToFalse(): void {
    this.selectedOutlet.isAddPreviousSelected = false;
    this.selectedOutlet.isAddCurrentSelected = false;
  }
}
