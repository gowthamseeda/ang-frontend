import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisteredOfficeBlockComponent } from './registered-office-block.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

export class TranslateServiceStub {
  instant(arg) {
    return 'REGISTERED_OFFICE';
  }
}

describe('RegisteredOfficeBlockComponent', () => {
  let component: RegisteredOfficeBlockComponent;
  let fixture: ComponentFixture<RegisteredOfficeBlockComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegisteredOfficeBlockComponent],
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          })
        ],
        providers: [{ provide: TranslateService, useClass: TranslateServiceStub }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredOfficeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
