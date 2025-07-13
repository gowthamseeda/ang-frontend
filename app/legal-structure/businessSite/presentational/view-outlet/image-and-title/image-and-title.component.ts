import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-image-and-title',
  templateUrl: './image-and-title.component.html',
  styleUrls: ['./image-and-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageAndTitleComponent implements OnInit {
  @Input()
  assetForIconImage: string;
  @Input()
  titleText: string;

  constructor() {}

  ngOnInit(): void {}
}
