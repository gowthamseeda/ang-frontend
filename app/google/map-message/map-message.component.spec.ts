import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MapMessageComponent } from './map-message.component';
import { TranslatePipeMock } from '../../testing/pipe-mocks/translate';
import { mismatchAddressMock } from './mismatch-address-mock';

describe('MapMessageComponent', () => {
  let component: MapMessageComponent;
  let fixture: ComponentFixture<MapMessageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MapMessageComponent, TranslatePipeMock],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.mismatchAddress = mismatchAddressMock;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
