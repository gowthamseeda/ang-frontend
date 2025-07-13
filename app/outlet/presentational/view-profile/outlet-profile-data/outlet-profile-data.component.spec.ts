import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OutletProfileDataComponent } from './outlet-profile-data.component';
//import { BrowserAnimationsModule   } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

export class TranslateServiceStub {
  instant(arg) {
    return 'TRANSLATED';
  }
}

describe('OutletProfileDataComponent', () => {
  let component: OutletProfileDataComponent;
  let fixture: ComponentFixture<OutletProfileDataComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletProfileDataComponent ],
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
    fixture = TestBed.createComponent(OutletProfileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
