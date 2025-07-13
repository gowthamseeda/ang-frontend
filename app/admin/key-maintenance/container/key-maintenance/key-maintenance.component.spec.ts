import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyMaintenanceComponent } from './key-maintenance.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('FileDownloadComponent', () => {
  let component: KeyMaintenanceComponent;
  let fixture: ComponentFixture<KeyMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyMaintenanceComponent ],
      imports: [
        TranslateModule.forRoot(),
        MatTabsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
