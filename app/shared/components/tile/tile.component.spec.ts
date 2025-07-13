import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { TestingModule } from '../../../testing/testing.module';
import { TileComponent } from './tile.component';

@Component({
  template:
    '<gp-tile ' +
    '[componentLink]="componentLink" ' +
    '[headerText]="headerText" ' +
    '[noTileDataText]="noTileDataText" ' +
    '[noTileDataTextPrefix]="noTileDataTextPrefix" ' +
    '[noTileDataTextLink]="noTileDataTextLink" ' +
    '[noTileDataTextPostfix]="noTileDataTextPostfix" ' +
    '[iconUrl]="iconUrl">' +
    '<div *ngIf="show">content</div>' +
    '</gp-tile>'
})
class TestComponent {
  @ViewChild(TileComponent)
  tileComponent: TileComponent;
  componentLink = './edit';
  headerText = 'Header Text';
  noTileDataText = 'No XYZ data is maintained.';
  noTileDataTextPrefix = 'Would you like to ';
  noTileDataTextLink = 'edit';
  noTileDataTextPostfix = 'this information now';
  iconUrl = 'assets/xyz.svg';
  show = true;
}

describe('TileComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TileComponent, TestComponent],
        imports: [TestingModule, MatMenuModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
