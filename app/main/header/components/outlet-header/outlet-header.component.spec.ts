import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BreadcrumbItem } from '../../models/header.model';
import { OutletBreadcrumbService } from '../../services/outlet-breadcrumb/outlet-breadcrumb.service';

import { OutletHeaderComponent } from './outlet-header.component';

class OutletBreadcrumbServiceStub {
  breadcrumbItems = new BehaviorSubject<BreadcrumbItem[]>([]);
}

describe('OutletHeaderComponent', () => {
  let component: OutletHeaderComponent;
  let fixture: ComponentFixture<OutletHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutletHeaderComponent],
      providers: [{ provide: OutletBreadcrumbService, useClass: OutletBreadcrumbServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
