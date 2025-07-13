import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { createFunctionSpy } from 'jest-auto-spies';

import { CommunicationFieldFormat } from '../../model/communication-field-format';
import { SocialMediaChannel } from '../../model/social-media-channel.model';

import { SocialMediaChannelsComponent } from './social-media-channels.component';

const socialMediaChannelsMock: SocialMediaChannel[] = [
  {
    id: 'YOUTUBE',
    name: 'Youtube',
    selected: true,
    format: CommunicationFieldFormat.URL,
    template: 'https://www.youtube.com/user/',
    value: 'https://www.youtube.com/user/Daimler/'
  },
  {
    id: 'INSTAGRAM',
    name: 'Instagram',
    selected: false,
    format: CommunicationFieldFormat.URL,
    template: 'https://www.instagram.com/user/',
    value: 'https://www.instagram.com/user/Daimler/'
  }
];

describe('SocialMediaChannelsComponent', () => {
  let component: SocialMediaChannelsComponent;
  let fixture: ComponentFixture<SocialMediaChannelsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [TranslateService],
      declarations: [SocialMediaChannelsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaChannelsComponent);
    component = fixture.componentInstance;
    component.socialMediaChannels = [];
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should update formGroup', () => {
      const expected = { YOUTUBE: 'https://www.youtube.com/user/Daimler/' };
      component.socialMediaChannels = socialMediaChannelsMock;
      component.ngOnChanges();
      expect(component.selectedSocialMediaChannelsFormGroup.value).toEqual(expected);
    });
  });

  describe('writeValue', () => {
    it('should update formGroup', () => {
      const expected = { YOUTUBE: 'https://www.youtube.com/user/Daimler/' };
      component.writeValue(socialMediaChannelsMock);
      expect(component.selectedSocialMediaChannelsFormGroup.value).toEqual(expected);
    });
  });

  describe('registerOnChange', () => {
    it('should call registerOnChange callback function when form value changes', done => {
      const callbackSpy = createFunctionSpy('registerOnChange');
      component.registerOnChange(callbackSpy);
      component.selectedSocialMediaChannelsFormGroup.valueChanges.subscribe(value => {
        expect(callbackSpy).toHaveBeenCalled();
        done();
      });
      component.selectedSocialMediaChannelsFormGroup.setValue({});
    });
  });

  describe('validate', () => {
    it('should return a validation error', done => {
      component.validate(new FormControl()).subscribe(validationErrors => {
        expect(validationErrors).toEqual({ socialMediaChannelsError: true });
        done();
      });
      component.selectedSocialMediaChannelsFormGroup.addControl(
        'anyId',
        new FormControl('', Validators.required)
      );
    });

    it('should return a valid state', done => {
      component.validate(new FormControl()).subscribe(validationErrors => {
        expect(validationErrors).toBeNull();
        done();
      });
      component.selectedSocialMediaChannelsFormGroup.addControl(
        'anyId',
        new FormControl('anyValue', Validators.required)
      );
    });
  });

  describe('selectedSocialMediaChannels', () => {
    it('should get selected social media channels', () => {
      component.socialMediaChannels = [socialMediaChannelsMock[0], socialMediaChannelsMock[1]];
      component.ngOnChanges();
      expect(component.selectedSocialMediaChannels).toEqual([socialMediaChannelsMock[0]]);
    });
  });

  describe('updateSocialMediaChannelsSelection', () => {
    it('should update social media channels selection', () => {
      component.socialMediaChannels = [socialMediaChannelsMock[0], socialMediaChannelsMock[1]];
      component.ngOnChanges();
      const socialMediaChannelsChange = {
        value: [socialMediaChannelsMock[1]]
      } as MatButtonToggleChange;
      component.updateSocialMediaChannelsSelection(socialMediaChannelsChange);
      expect(component.socialMediaChannels[0].selected).toBeFalsy();
      expect(component.socialMediaChannels[1].selected).toBeTruthy();
    });

    it('should use template as default value for newly selected social media channel', () => {
      const mockSocialMediaChannel: SocialMediaChannel = {
        id: 'INSTAGRAM',
        name: 'Instagram',
        selected: false,
        format: CommunicationFieldFormat.URL,
        template: 'https://www.instagram.com/user/',
        value: '' // No value supplied so template used as default
      };

      component.socialMediaChannels = [mockSocialMediaChannel];
      component.ngOnChanges();
      const socialMediaChannelsChange = {
        value: [mockSocialMediaChannel]
      } as MatButtonToggleChange;
      component.updateSocialMediaChannelsSelection(socialMediaChannelsChange);
      expect(
        component.selectedSocialMediaChannelsFormGroup?.get(mockSocialMediaChannel.id)?.value
      ).toEqual(mockSocialMediaChannel.template);
    });

    it('should not update any social media channels selection', () => {
      component.socialMediaChannels = socialMediaChannelsMock;
      component.ngOnChanges();
      const socialMediaChannelsChange = { value: [] } as MatButtonToggleChange;
      component.updateSocialMediaChannelsSelection(socialMediaChannelsChange);
      expect(component.socialMediaChannels).toEqual(socialMediaChannelsMock);
    });
  });

  describe('removeSocialMediaChannel', () => {
    it('should remove social media channel', () => {
      component.socialMediaChannels = [socialMediaChannelsMock[0], socialMediaChannelsMock[1]];
      component.ngOnChanges();
      component.removeSocialMediaChannel(socialMediaChannelsMock[0].id);
      expect(component.socialMediaChannels[0].selected).toBeFalsy();
      expect(
        component.selectedSocialMediaChannelsFormGroup.get(socialMediaChannelsMock[0].id)
      ).toBeNull();
    });
  });

  describe('openLink', () => {
    it('should open URLs with http directly', () => {
      const windowSpy = spyOn(window, 'open');
      const url = 'http://www.google.de';
      component.openLink(url);
      expect(windowSpy).toHaveBeenCalledWith(url, '_blank');
    });

    it('should open URLs with https directly', () => {
      const windowSpy = spyOn(window, 'open');
      const url = 'https://www.google.de';
      component.openLink(url);
      expect(windowSpy).toHaveBeenCalledWith(url, '_blank');
    });

    it('should open URLs appending HTTPS protocol if necessary', () => {
      const windowSpy = spyOn(window, 'open');
      const url = 'www.google.de';
      component.openLink(url);
      expect(windowSpy).toHaveBeenCalledWith('https://' + url, '_blank');
    });
  });
});
