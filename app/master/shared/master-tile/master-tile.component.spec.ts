import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MasterTileComponent } from './master-tile.component';

@Component({
  template:
    '<gp-master-tile ' +
    '[headerText]="headerText" ' +
    '[searchPlaceHolder]="searchPlaceHolder" ' +
    '[buttonText]="buttonText" ' +
    '[componentLink]="componentLink">' +
    '</gp-master-tile>'
})
class TestComponent {
  @ViewChild(MasterTileComponent)
  masterTileComponent: MasterTileComponent;
  headerText = 'Header Text';
  searchPlaceHolder = 'Search PlaceHolder';
  buttonText = 'butonText';
  componentLink = '/master';
}

describe('MasterTileComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatMenuModule],
        declarations: [MasterTileComponent, TestComponent],
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
