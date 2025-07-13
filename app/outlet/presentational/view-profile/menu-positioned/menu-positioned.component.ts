import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

export interface MenuPositionedItem {
  text: string;
  actionUrl: string;
}

@Component({
  selector: 'gp-menu-positioned',
  templateUrl: './menu-positioned.component.html',
  styleUrls: ['./menu-positioned.component.scss']
})
export class MenuPositionedComponent implements OnInit {
  @Input()
  menuItems: MenuPositionedItem[];

  @Output()
  menuItemClicked: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatMenuTrigger, { static: true })
  private menuTrigger: MatMenuTrigger;

  constructor() {}

  ngOnInit(): void {}

  triggerMenuShow($event: any): void {
    const menuElement = document.getElementById('positionedMenuTriggerBtn');
    if (menuElement) {
      menuElement.style.display = '';
      menuElement.style.position = 'absolute';
      menuElement.style.left = $event.pageX + 5 + 'px';
      menuElement.style.top = $event.pageY + 5 + 'px';
      this.menuTrigger.openMenu();
    }
  }

  menuClose(): void {
    const menu = document.getElementById('positionedMenuTriggerBtn');
    if (menu) {
      menu.style.display = 'none';
    }
  }

  emitMenuItemClicked(relativeUrl: string): void {
    this.menuItemClicked.emit(relativeUrl);
  }
}
