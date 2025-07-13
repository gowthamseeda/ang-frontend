import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';

import { TestingModule } from '../../../testing/testing.module';

import { SnapshotLegalFooterTranslationsComponent } from './snapshot-legal-footer-translations.component';

describe('SnapshotLegalFooterTranslationsComponent', () => {
  let component: SnapshotLegalFooterTranslationsComponent;
  let fixture: ComponentFixture<SnapshotLegalFooterTranslationsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SnapshotLegalFooterTranslationsComponent],
        imports: [TestingModule, PipesModule],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotLegalFooterTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
