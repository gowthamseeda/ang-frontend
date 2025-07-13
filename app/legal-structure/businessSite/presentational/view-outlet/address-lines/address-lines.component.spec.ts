import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AddressLinesComponent } from './address-lines.component';
import { By } from '@angular/platform-browser';

@Component({ selector: 'gp-host-for-test', template: '' })
class HostComponent {}

function createHostComponent(template: string): ComponentFixture<HostComponent> {
  TestBed.overrideComponent(HostComponent, { set: { template: template } });
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return fixture as ComponentFixture<HostComponent>;
}

describe('AddressLinesComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  const httpElement = (): HTMLElement =>
    fixture.debugElement.query(By.css('.address-data-box'))
      ? fixture.debugElement.query(By.css('.address-data-box')).nativeElement
      : null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, AddressLinesComponent]
    });
  });

  test('should be hidden by default', () => {
    const template = '<gp-address-lines></gp-address-lines>';
    fixture = createHostComponent(template);
    expect(httpElement()).toBeNull();
  });

  test('should display address', () => {
    const template = '<gp-address-lines [address]="{}"></gp-address-lines>';
    fixture = createHostComponent(template);
    expect(httpElement().classList.contains('address-data-box')).toBeTruthy();
  });
});
