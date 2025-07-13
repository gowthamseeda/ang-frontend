import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ObservableInput } from 'ngx-observable-input';
import { Observable } from 'rxjs';

@Component({
  selector: 'gp-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {
  @Input()
  componentLink: string = "";
  @Input()
  headerText: string;
  @Input()
  noTileDataText: string;
  @Input()
  noTileDataTextPrefix: string = "";
  @Input()
  noTileDataTextLink: string = "";
  @Input()
  noTileDataTextPostfix: string = "";
  @Input()
  iconUrl: string = "";
  @Input()
  fragment: string = "";
  @Input()
  @ObservableInput()
  isLoading: Observable<Boolean>;
  @Input()
  isEmpty: Boolean;
  @Input()
  detailsLinkText: string;
  @Input()
  menu: Boolean = true;
}
