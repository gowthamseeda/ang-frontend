import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestingModule } from '../../../../../testing/testing.module';
import { TaxIdLayoutComponent } from './tax-id-layout.component';

describe('TaxIdLayoutComponent', () => {
  let component: TaxIdLayoutComponent;
  let fixture: ComponentFixture<TaxIdLayoutComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TaxIdLayoutComponent],
        imports: [TestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxIdLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
