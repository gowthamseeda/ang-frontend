import { Component, Input, OnInit } from '@angular/core';
import { Brand } from 'app/services/brand/brand.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BrandService } from '../../../brand/brand.service';

@Component({
  selector: 'gp-brand-icon',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  @Input()
  id: string;

  @Input()
  monowhite = false;

  @Input()
  small = false;

  @Input()
  tooltipPosition = 'after';

  get src(): string {
    const suffix = this.monowhite ? '-mono-white.svg' : '.svg';
    return 'assets/brand-logos/' + this.id.toLowerCase() + suffix;
  }

  tooltip: Observable<string>;

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.tooltip = this.brandService
      .getAll()
      .pipe(map((brands: Brand[]) => this.findTooltip(brands)));
  }

  private findTooltip(brands: Brand[]): string {
    const currentBrand = brands?.find(
      (brand: Brand) => brand.id.toLowerCase() === this.id.toLowerCase()
    );
    return currentBrand?.name ?? this.id;
  }
}
