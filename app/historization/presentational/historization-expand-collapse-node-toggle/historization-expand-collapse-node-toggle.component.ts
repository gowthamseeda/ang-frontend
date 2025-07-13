import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToggleService } from '../../service/toggle.service';

@Component({
  selector: 'gp-historization-expand-collapse-node-toggle',
  templateUrl: './historization-expand-collapse-node-toggle.component.html',
  styleUrls: ['./historization-expand-collapse-node-toggle.component.scss']
})
export class HistorizationExpandCollapseNodeToggleComponent implements OnInit {
  constructor(private toggleService: ToggleService) {}

  updateExpandCollapseNodeToggle(expandAllNodeEvent: MatSlideToggleChange): void {
    this.toggleService.setExpandAll(expandAllNodeEvent.checked);
  }

  ngOnInit(): void {}
}
