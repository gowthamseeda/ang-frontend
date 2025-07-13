import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogCleanSchedulerTableComponent } from './audit-log-clean-scheduler-table.component';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipeMock } from 'app/testing/pipe-mocks/translate';

describe('AuditLogCleanSchedulerTableComponent', () => {
  let component: AuditLogCleanSchedulerTableComponent;
  let fixture: ComponentFixture<AuditLogCleanSchedulerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditLogCleanSchedulerTableComponent, TranslatePipeMock],
      imports: [MatTableModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AuditLogCleanSchedulerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
