import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { OutletRelationshipsDropdownComponent } from './outlet-relationships-dropdown.component';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import {
  MasterOutletRelationshipService
} from '../../../../master/services/master-outlet-relationship/master-outlet-relationship.service';
import {
  getMasterOutletRelationshipMock
} from '../../../../master/services/master-outlet-relationship/master-outlet-relationship.mock';

describe('OutletRelationshipsDropdownComponent', () => {
  let component: OutletRelationshipsDropdownComponent;
  let fixture: ComponentFixture<OutletRelationshipsDropdownComponent>;
  let outletRelationshipServiceSpy: Spy<MasterOutletRelationshipService>;

  const outletRelationshipMock = getMasterOutletRelationshipMock();

  beforeEach(async () => {
    outletRelationshipServiceSpy = createSpyFromClass(MasterOutletRelationshipService);
    outletRelationshipServiceSpy.getAll.nextWith(outletRelationshipMock.outletRelationships);
    await TestBed.configureTestingModule({
      declarations: [OutletRelationshipsDropdownComponent, TranslatePipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MasterOutletRelationshipService, useValue: outletRelationshipServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletRelationshipsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('init', () => {
      expect(component.outletRelationships).toEqual(outletRelationshipMock.outletRelationships);
    });
  });

  it('should return relationship def codes', () => {
    const defCodes = component.relationshipDefCodes();
    expect(defCodes).toMatchObject(component.outletRelationships.map((outletRelationship) => outletRelationship.id));
  });

  it('should return relationship def code value', () => {
    const defCodeValue = component.relationshipDefCodeValue("is_Branch_of");
    expect(defCodeValue).toEqual('Is Branch of');
  });
});
