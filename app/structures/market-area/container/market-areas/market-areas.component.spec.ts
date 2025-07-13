import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { MarketAreasComponent } from './market-areas.component';

describe('MarketAreasComponent', () => {
  let component: MarketAreasComponent;
  let fixture: ComponentFixture<MarketAreasComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MarketAreasComponent, NgxPermissionsAllowStubDirective],
        imports: [TranslateModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
