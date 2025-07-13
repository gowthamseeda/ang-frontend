import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let routerSpy: Spy<Router>;
  let activatedRouteSpy: Spy<ActivatedRoute>;

  beforeEach(async () => {
    routerSpy = createSpyFromClass(Router);
    activatedRouteSpy = createSpyFromClass(ActivatedRoute);

    await TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update arrow visibility on breadcrumb items change', () => {
    component.breadcrumbItems = [{ label: 'TEST', path: '../' }, { label: 'TEST2' }];
    component.hasNavigableParentBreadcrumb = false;

    component.ngOnChanges({});

    expect(component.hasNavigableParentBreadcrumb).toBeTruthy();
  });

  describe('should navigate up breadcrumb', () => {
    it('should navigate by URL', () => {
      component.breadcrumbItems = [{ label: 'TEST', path: 'TEST' }, { label: 'TEST2' }];

      component.ngOnChanges({});
      component.navigateUpBreadcrumb();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['TEST'], { relativeTo: null });
    });

    it('should navigate by relative path', () => {
      component.breadcrumbItems = [{ label: 'TEST', path: '../' }, { label: 'TEST2' }];

      component.ngOnChanges({});
      component.navigateUpBreadcrumb();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['../'], { relativeTo: activatedRouteSpy });
    });
  });
});
