import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuPositionedComponent } from './menu-positioned.component';
import { TestingModule } from '../../../../testing/testing.module';
import { MatMenuModule } from '@angular/material/menu';

describe('MenuPositionedComponent', () => {
  let component: MenuPositionedComponent;
  let fixture: ComponentFixture<MenuPositionedComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MenuPositionedComponent],
        imports: [MatMenuModule, TestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPositionedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
