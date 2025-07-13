import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBiComponent } from './power-bi.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PowerBiService } from './service/power-bi.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { TestingModule } from '../../testing/testing.module';
import { countryMock, powerBiDetailMock } from './model/power-bi.mock';
import { UserService } from '../../iam/user/user.service';

describe('PowerBiComponent', () => {
  let component: PowerBiComponent;
  let fixture: ComponentFixture<PowerBiComponent>;
  let powerBiServiceSpy: Spy<PowerBiService>
  let userServiceSpy: Spy<UserService>

  beforeEach(async () => {
    powerBiServiceSpy = createSpyFromClass(PowerBiService)
    powerBiServiceSpy.getEmbedToken.nextWith(powerBiDetailMock)
    userServiceSpy = createSpyFromClass(UserService)
    userServiceSpy.getUserDataRestrictions.nextWith({ Country: countryMock})

    await TestBed.configureTestingModule({
      declarations: [PowerBiComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TestingModule],
      providers: [{ provide: PowerBiService, useValue: powerBiServiceSpy },
                        { provide: UserService, useValue: userServiceSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PowerBiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should deactivate', () => {
    const canDeactivate = component.canDeactivate()
    expect(canDeactivate).toBeTruthy()
  })

  it('should setup embed config', () => {
    component.ngOnInit()
    expect(component.embedConfig.id).toEqual(powerBiDetailMock.reportId)
    expect(component.embedConfig.accessToken).toEqual(powerBiDetailMock.embeddedToken)
    expect(component.embedConfig.groupId).toEqual(powerBiDetailMock.groupId)
    expect(component.embedConfig.embedUrl).toEqual('https://app.powerbi.com/reportEmbed?filter=Countries/CountryIsoCode in (\'US\')')
  })
});
