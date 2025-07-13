import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrandsPillarComponent } from './brands-pillar.component';

describe('BrandsPillarComponent', () => {
  let component: BrandsPillarComponent;
  let fixture: ComponentFixture<BrandsPillarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BrandsPillarComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterTestingModule.withRoutes([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsPillarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
