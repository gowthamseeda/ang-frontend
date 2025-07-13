import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of } from 'rxjs';

import { BrandService } from '../../../brand/brand.service';

import { BrandComponent } from './brand.component';

describe('BrandIconComponent', () => {
  let component: BrandComponent;
  let fixture: ComponentFixture<BrandComponent>;

  const brandServiceStub = {
    getAll: () => of([
      {
        id: 'MB',
        name: 'Mercedes-Benz'
      }
    ])
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          MatTooltipModule
        ],
        declarations: [BrandComponent],
        providers: [
          { provide: BrandService, useValue: brandServiceStub }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandComponent);
    component = fixture.componentInstance;
    component.id = 'MB';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set id', () => {
    it('should set src based on the ID', () => {
      expect(component.src).toEqual('assets/brand-logos/mb.svg');
    });
  });

  describe('set monowhite', () => {
    it('should set src to include mono-white', () => {
      component.monowhite = true;
      expect(component.src).toEqual('assets/brand-logos/mb-mono-white.svg');
    });
  });

  describe('set tooltip', () => {
    it('should set tooltip to brand name', done => {
      component.tooltip.subscribe((tooltip: string) => {
        expect(tooltip).toEqual('Mercedes-Benz');
        done();
      });
    });
  });
});
