import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InvesteeMock } from 'app/investors/investee/investee.mock';
import { CapitalFormComponent } from './capital-form.component';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';

describe('CapitalFormComponent', () => {
  const investeeMock = InvesteeMock.asList()[0];
  let component: CapitalFormComponent;
  let fixture: ComponentFixture<CapitalFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CapitalFormComponent, TranslatePipeMock],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set shareCapitalValue and shareCapitalCurrency based on input', () => {
      component.investee = investeeMock;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.shareCapitalCurrency).toEqual(investeeMock.shareCapitalCurrency);
      expect(component.shareCapitalValue.value).toEqual(investeeMock.shareCapitalValue);
    });
  });

  describe('Change shareCapitalValue', () => {
    it('should change shareCapitalValue and mark it as valid', () => {
      component.shareCapitalValue.setValue(1000000);
      fixture.detectChanges();
      expect(component.shareCapitalValue.invalid).toBeFalsy();
    });

    it('should mark shareCapitalValue control as invalid then value is > 2 Mrd.', () => {
      component.shareCapitalValue.setValue(2000000001);
      fixture.detectChanges();
      expect(component.shareCapitalValue.invalid).toBeTruthy();
      expect(component.shareCapitalValue.hasError('max')).toBeTruthy();
    });

    it('should mark shareCapitalValue control as invalid when validation pattern gets violated', () => {
      component.shareCapitalValue.setValue('200000a');
      fixture.detectChanges();
      expect(component.shareCapitalValue.invalid).toBeTruthy();
      expect(component.shareCapitalValue.hasError('numberRequired')).toBeTruthy();
    });

    it('should mark shareCapitalValue control as invalid when value is smaller than 0', () => {
      component.shareCapitalValue.setValue('-100');
      fixture.detectChanges();
      expect(component.shareCapitalValue.invalid).toBeTruthy();
      expect(component.shareCapitalValue.hasError('min')).toBeTruthy();
    });
  });
});
