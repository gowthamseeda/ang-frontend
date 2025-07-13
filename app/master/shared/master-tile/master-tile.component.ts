import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gp-master-tile',
  templateUrl: './master-tile.component.html',
  styleUrls: ['./master-tile.component.scss']
})
export class MasterTileComponent {
  @Input()
  iconLink: string;

  @Input()
  headerText: string;

  @Input()
  searchPlaceHolder: string;

  @Input()
  buttonText: string;

  @Input()
  componentLink: string;

  @Input()
  displayBurgerMenu: boolean;

  @Input()
  detailsLinks: DetailsLinks[];

  @Output()
  searchText = new EventEmitter<string>();

  search(event: any): void {
    this.searchText.emit(event.target.value);
  }
}

export class DetailsLinks {
  link: string;
  text: string;
}
