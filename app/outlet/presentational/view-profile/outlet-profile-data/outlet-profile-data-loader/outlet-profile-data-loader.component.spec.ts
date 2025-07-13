import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OutletProfileDataLoaderComponent } from './outlet-profile-data-loader.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OutletProfileDataLoaderComponent', () => {
  let component: OutletProfileDataLoaderComponent;
  let fixture: ComponentFixture<OutletProfileDataLoaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletProfileDataLoaderComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletProfileDataLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
