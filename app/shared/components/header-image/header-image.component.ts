import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-header-image',
  templateUrl: './header-image.component.html',
  styleUrls: ['./header-image.component.scss']
})
export class HeaderImageComponent implements OnInit {
  src: string;

  @Input()
  set name(name: string) {
    this.src = `assets/logos/tile-avatars/${name.toLowerCase()}.svg`;
  }

  @Input()
  large = false;

  constructor() {}

  ngOnInit(): void {}
}
