import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import {
  getLanguageEnglishPure,
  getLanguageGermanPure
} from '../../../geography/language/language.mock';
import { LanguageService } from '../../../geography/language/language.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { TestingModule } from '../../../testing/testing.module';
import { CommunicationService } from '../../communication.service';
import { SpokenLanguageComponent } from './spoken-language.component';
import {DistributionLevelsService} from "../../../traits/distribution-levels/distribution-levels.service";

@Component({
  selector: 'gp-spoken-language',
  template: '',
  providers: [
    {
      provide: SpokenLanguageComponent,
      useClass: SpokenLanguageStubComponent
    }
  ]
})
export class SpokenLanguageStubComponent {
  isUserAuthorizedForSpokenLanguageChange() {}
  reset() {}
  saveObservable() {}
}

describe('SpokenLanguageComponent', () => {
  let component: SpokenLanguageComponent;
  let fixture: ComponentFixture<SpokenLanguageComponent>;
  let communicationServiceSpy: Spy<CommunicationService>;
  let languageServiceSpy: Spy<LanguageService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;

  const languagesMock = [getLanguageEnglishPure(), getLanguageGermanPure()];

  beforeEach(async () => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);
    communicationServiceSpy = createSpyFromClass(CommunicationService);
    languageServiceSpy = createSpyFromClass(LanguageService);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);
    await TestBed.configureTestingModule({
      declarations: [SpokenLanguageComponent],
      imports: [TestingModule],
      providers: [
        { provide: CommunicationService, useValue: communicationServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
        },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy },
        ApiService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    communicationServiceSpy.getSpokenLanguageIdsOfOutlet.nextWith(['en']);
    languageServiceSpy.getTwoLetterLanguages.nextWith(languagesMock);

    fixture = TestBed.createComponent(SpokenLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isUserAuthorizedForSpokenLanguageChange should ', () => {
    test('return true if user is authorized', () => {
      fixture.detectChanges();
      const authorized = component.isUserAuthorizedForSpokenLanguageChange();
      expect(authorized).toBeTruthy();
    });

    test('return false if user is not authorized', () => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      fixture.detectChanges();
      const authorized = component.isUserAuthorizedForSpokenLanguageChange();
      expect(authorized).toBeFalsy();
    });
  });

  describe('dataChangedManually should', () => {
    test('emit on languageSelectionChanged', () => {
      fixture.detectChanges();

      component.dataChangedManually.subscribe(done => {
        expect(true);
        done();
      });

      component.languageSelectionChanged('any_id');
    });
  });
});
