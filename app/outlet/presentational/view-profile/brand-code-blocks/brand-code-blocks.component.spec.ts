import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrandCodeBlocksComponent } from './brand-code-blocks.component';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';

@Component({
  template: '<gp-brand-code-blocks [brandCodes]=""></gp-brand-code-blocks>'
})
class BrandCodeBlocksTestComponent {
  @ViewChild(BrandCodeBlocksComponent)
  public component = BrandCodeBlocksComponent;
}

describe('BrandCodeBlocksComponent', () => {
  let component: BrandCodeBlocksTestComponent;
  let fixture: ComponentFixture<BrandCodeBlocksTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BrandCodeBlocksTestComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandCodeBlocksTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
