import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

export interface MenuAction {
  action: string;
  param?: string;
}

export interface MenuItem extends MenuAction {
  label: string;
  fontIcon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'gp-outlet-menu',
  templateUrl: './outlet-menu.component.html',
  styleUrls: ['./outlet-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class OutletMenuComponent implements OnInit {
  @Input()
  items: MenuItem[];
  @Input()
  disabled = false;
  @Input()
  fontIcon = 'more';
  @Input()
  brightProfile: boolean;
  @Output()
  itemClick: EventEmitter<MenuAction> = new EventEmitter<MenuAction>();

  constructor() {}

  ngOnInit(): void {}

  clicked(action: string, id: string): void {
    this.itemClick.emit({ action: action, param: id });
  }
}
