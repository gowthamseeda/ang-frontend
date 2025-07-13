import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LegalNameContentLoaderComponent } from './legal-name-content-loader.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LegalNameContentLoaderComponent', () => {
  let component: LegalNameContentLoaderComponent;
  let fixture: ComponentFixture<LegalNameContentLoaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LegalNameContentLoaderComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalNameContentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
