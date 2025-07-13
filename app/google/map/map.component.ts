import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { CustomLazyMapsAPILoader } from '../google-maps-loader';

@Component({
  selector: 'gp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input()
  latitude: number;
  @Input()
  longitude: number;
  @Input()
  tile: boolean;
  @Output()
  coordinates = new EventEmitter<string>();
  @Output()
  isMapReady = new EventEmitter<boolean>();
  displayMarker: boolean;
  mapHeight = '350px';
  mapVisible = false;
  zoom = 18;
  center: any;
  options = {
    zoomControl: false,
    gestureHandling: 'cooperative',
    disableDoubleClickZoom: true,
    mapTypeId: 'roadmap',
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: true
  };
  marker = { position: { lat: 0, lng: 0 } };

  constructor(private mapsAPILoader: CustomLazyMapsAPILoader) {
    this.mapsAPILoader.load().then(r => {
      this.mapVisible = true;
      this.isMapReady.emit(true);
    });
  }

  ngOnInit(): void {
    this.center = { lat: this.latitude, lng: this.longitude };
    this.addMarker();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.latitude) {
      this.latitude = parseFloat(changes.latitude.currentValue);
      this.mapConfiguration();
    }
    if (changes.longitude) {
      this.longitude = parseFloat(changes.longitude.currentValue);
      this.mapConfiguration();
    }
  }

  mapConfiguration(): void {
    if (this.tile) {
      this.mapHeight = '150px';
      this.options = {
        zoomControl: false,
        gestureHandling: 'cooperative',
        disableDoubleClickZoom: true,
        mapTypeId: 'roadmap',
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false
      };
    }
    if (!this.latitude && !this.longitude) {
      this.setWorldMap();
    } else {
      this.displayMarker = true;
      this.zoom = this.tile ? 15 : 11;
      this.marker = { position: { lat: this.latitude, lng: this.longitude } };
      this.center = { lat: this.latitude, lng: this.longitude };
    }
  }

  addMarker(): void {
    this.marker = { position: { lat: this.latitude, lng: this.longitude } };
  }

  @HostListener('wheel', ['$event'])
  avoidPageScroll(wheelEvent: WheelEvent): void {
    wheelEvent.stopPropagation();
  }

  private setWorldMap(): void {
    this.latitude = 0;
    this.longitude = 0;
    this.zoom = 1;
    this.displayMarker = false;
  }
}
