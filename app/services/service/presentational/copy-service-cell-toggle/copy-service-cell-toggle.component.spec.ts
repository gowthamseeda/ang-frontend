import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectDataService } from '../../services/multi-select-service-data.service';

import { CopyServiceCellToggleComponent } from './copy-service-cell-toggle.component';

describe('ServiceCellCopyToggleComponent', () => {
  let component: CopyServiceCellToggleComponent;
  let fixture: ComponentFixture<CopyServiceCellToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopyServiceCellToggleComponent],
      providers: [MultiSelectDataService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyServiceCellToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
