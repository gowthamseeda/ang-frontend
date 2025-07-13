import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsService } from 'ngx-permissions';

import { BrandService } from '../../../services/brand/brand.service';
import { TestingModule } from '../../../testing/testing.module';
import { KeysService } from '../../../traits/keys/keys.service';
import { getGroupedKeysMock } from '../key.mock';

import { KeysTileComponent } from './keys-tile.component';

const permissionServiceMock = {
  getPermissions: () => {
    return {
      legalStructure: {
        businessSite: {
          update: {
            name: 'legalStructure.businessSite.update'
          }
        }
      }
    };
  }
};

@Component({
  template: '<gp-keys-tile [outletId]="outletId" [countryId]="countryId"></gp-keys-tile>'
})
class TestComponent {
  @ViewChild(KeysTileComponent)
  keysTileComponent: KeysTileComponent;
  outletId = 'GS0000001';
  countryId = 'FR';
}

describe('KeysTileComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  let keysServiceSpy: Spy<KeysService>;
  let brandServiceSpy: Spy<BrandService>;

  beforeEach(
    waitForAsync(() => {
      keysServiceSpy = createSpyFromClass(KeysService);
      brandServiceSpy = createSpyFromClass(BrandService);

      TestBed.configureTestingModule({
        declarations: [KeysTileComponent, TestComponent],
        imports: [
          TestingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          })
        ],
        providers: [
          { provide: KeysService, useValue: keysServiceSpy },
          { provide: BrandService, useValue: brandServiceSpy },
          TranslateService,
          { provide: NgxPermissionsService, useValue: permissionServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    brandServiceSpy.getAllIds.nextWith(['MB', 'SMT', 'FUSO']);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be empty', () => {
    keysServiceSpy.get.nextWith(getGroupedKeysMock());
    fixture.detectChanges();
    expect(component.keysTileComponent.isEmpty()).toBe(false);
  });

  it('should be empty', () => {
    keysServiceSpy.get.nextWith([]);
    fixture.detectChanges();
    expect(component.keysTileComponent.isEmpty()).toBe(true);
  });
});
