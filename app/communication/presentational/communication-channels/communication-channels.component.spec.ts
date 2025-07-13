import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

import { CommunicationChannel } from '../../model/communication-channel.model';
import { CommunicationFieldFormat } from '../../model/communication-field-format';
import {
  CommunicationChannelsComponent,
  DEFAULT_COMMUNICATION_FIELD_UI_FIELD_SIZE
} from './communication-channels.component';
import { TaskDataService } from '../../../tasks/task/store/task-data.service';
import { CommunicationChannelsService } from '../../communication-channels.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('CommunicationChannelsComponent', () => {
  let component: CommunicationChannelsComponent;
  let fixture: ComponentFixture<CommunicationChannelsComponent>;
  let windowOpenSpy;

  const communicationChannels: CommunicationChannel[] = [
    {
      id: 'INTERNET_ADDRESS',
      value: 'www.test.com/go',
      format: CommunicationFieldFormat.URL
    },
    {
      id: 'TELEPHONE',
      value: '0731-569-230',
      format: CommunicationFieldFormat.TEL
    },
    {
      id: 'EMAIL',
      value: 'happy@golucky.com',
      format: CommunicationFieldFormat.EMAIL
    },
    {
      id: 'What3Words',
      value: 'justGoHome'
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
        MatDialogModule 
      ],
      providers: [UntypedFormBuilder, TranslateService,
         { provide: TaskDataService, useValue: {} },
        { provide: CommunicationChannelsService, useValue: { resetServices: jest.fn() }}
      ],
      declarations: [CommunicationChannelsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationChannelsComponent);
    component = fixture.componentInstance;
    component.communicationChannels = communicationChannels;
    component.ngOnChanges();
    windowOpenSpy = spyOn(window, 'open');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize communication form', () => {
    const formArraySpy = spyOn(component.channelsFormArray, 'push');
    component.initCommunicationForm();

    expect(formArraySpy).toHaveBeenCalled();
  });

  it('should return true when input is an URL', () => {
    const url = 'www.google.de';
    const format = CommunicationFieldFormat.URL;

    const isAllowed = component.isLinkOutAllowed(url, format);
    expect(isAllowed).toBeTruthy();
  });

  it('should return true when input is an E-MAIL', () => {
    const email = 'test@test.com';
    const format = CommunicationFieldFormat.EMAIL;

    const isAllowed = component.isLinkOutAllowed(email, format);
    expect(isAllowed).toBeTruthy();
  });

  it('should return false when input is empty', () => {
    const email = '';
    const format = CommunicationFieldFormat.EMAIL;

    const isAllowed = component.isLinkOutAllowed(email, format);
    expect(isAllowed).toBeFalsy();
  });

  it('should return false when input is Telephone number', () => {
    const value = '0049-34957489';
    const format = CommunicationFieldFormat.TEL;

    const isAllowed = component.isLinkOutAllowed(value, format);
    expect(isAllowed).toBeFalsy();
  });

  it('should open URL', () => {
    const url = 'www.google.de';

    component.openLink(url, 'URL');
    expect(windowOpenSpy).toHaveBeenCalledWith('http://' + url, '_blank');
  });

  it('should open link to E-mail', () => {
    const email = 'test@test.com';

    component.openLink(email, 'EMAIL');
    expect(windowOpenSpy).toHaveBeenCalledWith('mailto:' + email, '');
  });

  it('should calculate flex layout width for communication channel', () => {
    const communicationFieldStub = {
      uiFieldSize: 5
    };

    const fxFlexWidth = component.getFieldSizeFor(communicationFieldStub);
    expect(fxFlexWidth).toBe("50%");
  });

  it('should use default value for flex layout width for communication channel', () => {
    const communicationFieldStub = {};

    const fxFlexWidth = component.getFieldSizeFor(communicationFieldStub);
    expect(fxFlexWidth).toBe(DEFAULT_COMMUNICATION_FIELD_UI_FIELD_SIZE * 10 + "%");
  });
});