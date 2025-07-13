import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import {
  ObjectPosition,
  PositionControl,
  PositionControlResponse
} from './position-control.model';
import { PositionControlComponent } from './position-control.component';
import { getObjectPositionControlMock } from './position-control.mock';

class MockService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<PositionControl[]> {
    return this.apiService
      .get<PositionControlResponse>('mockUrl')
      .pipe(map(result => result.genericObjects));
  }

  update(): Observable<any> {
    return this.apiService.put('mockUrl', 'mockPayload');
  }

  updatePosition(): Observable<any> {
    return this.apiService.put('mockUrl', 'mockPayload');
  }

  clearCacheAndFetchAll(): Observable<any> {
    return this.getAll();
  }
}

describe('PositionControlComponent', () => {
  let component: PositionControlComponent<PositionControl>;
  let fixture: ComponentFixture<PositionControlComponent<PositionControl>>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let mockServiceSpy: Spy<MockService>;

  beforeEach(
    waitForAsync(() => {
      mockServiceSpy = createSpyFromClass(MockService);
      mockServiceSpy.getAll.nextWith([]);
      mockServiceSpy.update.nextWith({});
      mockServiceSpy.updatePosition.nextWith({});
      mockServiceSpy.clearCacheAndFetchAll.nextWith({});
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [PositionControlComponent],
        imports: [MatTableModule, TestingModule],
        providers: [
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: MockService, useValue: mockServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionControlComponent);
    component = fixture.componentInstance;
    component.service = mockServiceSpy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should construct brand logo url based on brand id', () => {
    mockServiceSpy.getAll.nextWith(getObjectPositionControlMock());
    component.imageFolder = 'brand-logos';
    const url = component.getObjectImageUrl('MB');
    expect(url).toEqual('assets/brand-logos/mb.svg');
  });

  it('when getting before Brand and current brand is moved to first position', () => {
    mockServiceSpy.getAll.nextWith(getObjectPositionControlMock());
    const currentIndex = 0;
    const beforeBrandIndex = currentIndex + 1;
    const beforeBrand = component.beforeBrandId(currentIndex);
    expect(beforeBrand).toEqual(component.dataSource.data[beforeBrandIndex].id);
  });

  it('when getting before Brand and current brand is moved to any position than first position', () => {
    mockServiceSpy.getAll.nextWith(getObjectPositionControlMock());
    const currentIndex = 1;
    const beforeBrand = component.beforeBrandId(currentIndex);
    expect(beforeBrand).toEqual('');
  });

  it('when getting after Brand and current brand is moved to first position', () => {
    mockServiceSpy.getAll.nextWith(getObjectPositionControlMock());
    const currentIndex = 0;
    const afterBrand = component.afterBrandId(currentIndex);
    expect(afterBrand).toEqual('');
  });

  it('when getting after Brand and current brand is moved to any position than first position', () => {
    mockServiceSpy.getAll.nextWith(getObjectPositionControlMock());
    const currentIndex = 1;
    const afterBrandIndex = currentIndex - 1;
    const afterBrand = component.afterBrandId(currentIndex);
    expect(afterBrand).toEqual(component.dataSource.data[afterBrandIndex].id);
  });

  describe('dropBrandRow()', () => {
    beforeEach(() => {
      mockServiceSpy.getAll.nextWith(getObjectPositionControlMock());
      spyOn(component, 'beforeBrandId').and.callThrough();
      spyOn(component, 'afterBrandId').and.callThrough();
    });

    it('when position did not change after dropping', () => {
      const dragDropNoChangesEventMock: any = {
        currentIndex: 1,
        item: {
          data: component.dataSource.data[1]
        }
      };

      component.dropObjectRow(dragDropNoChangesEventMock);
      expect(component.dataSource.data[dragDropNoChangesEventMock.currentIndex].id).toEqual(
        dragDropNoChangesEventMock.item.data.id
      );
      expect(component.beforeBrandId).toHaveBeenCalledTimes(0);
      expect(component.afterBrandId).toHaveBeenCalledTimes(0);
      expect(mockServiceSpy.updatePosition).toHaveBeenCalledTimes(0);
    });

    it('when position change after dropping - verify specification requirement', () => {
      const dragDropEventMock: any = {
        currentIndex: 1,
        item: {
          data: component.dataSource.data[2]
        }
      };

      component.dropObjectRow(dragDropEventMock);
      expect(component.beforeBrandId).toHaveBeenCalledTimes(dragDropEventMock.currentIndex);
      expect(component.afterBrandId).toHaveBeenCalledTimes(dragDropEventMock.currentIndex);
      expect(mockServiceSpy.updatePosition).toHaveBeenCalledTimes(1);
    });

    it('when position is move upwards after dropping', () => {
      const dragDropMoveUpEventMock: any = {
        currentIndex: 1,
        item: {
          data: component.dataSource.data[2]
        }
      };

      const afterBrandPosition =
        component.dataSource.data[dragDropMoveUpEventMock.currentIndex - 1].id;

      component.dropObjectRow(dragDropMoveUpEventMock);

      const position: ObjectPosition = {
        id: dragDropMoveUpEventMock.item.data.id,
        afterId: afterBrandPosition
      };
      expect(component.dataSource.data[dragDropMoveUpEventMock.currentIndex].id).toEqual(
        dragDropMoveUpEventMock.item.data.id
      );
      expect(mockServiceSpy.updatePosition).toHaveBeenCalledTimes(1);
      expect(mockServiceSpy.updatePosition).toHaveBeenCalledWith(position);
    });

    it('when position is move downwards after dropping', () => {
      const dragDropMoveDownEventMock: any = {
        currentIndex: 3,
        item: {
          data: component.dataSource.data[1]
        }
      };

      const afterBrandPosition =
        component.dataSource.data[dragDropMoveDownEventMock.currentIndex].id;

      const position: ObjectPosition = {
        id: dragDropMoveDownEventMock.item.data.id,
        afterId: afterBrandPosition
      };

      component.dropObjectRow(dragDropMoveDownEventMock);
      expect(component.dataSource.data[dragDropMoveDownEventMock.currentIndex].id).toEqual(
        dragDropMoveDownEventMock.item.data.id
      );
      expect(mockServiceSpy.updatePosition).toHaveBeenCalledTimes(1);
      expect(mockServiceSpy.updatePosition).toHaveBeenCalledWith(position);
    });

    it('when position is to first position after dropping', () => {
      const dragDropToFirstEventMock: any = {
        currentIndex: 0,
        item: {
          data: component.dataSource.data[3]
        }
      };
      const brandPositionToBeReplaced =
        component.dataSource.data[dragDropToFirstEventMock.currentIndex].id;

      const position: ObjectPosition = {
        id: dragDropToFirstEventMock.item.data.id,
        beforeId: brandPositionToBeReplaced
      };

      component.dropObjectRow(dragDropToFirstEventMock);
      expect(component.dataSource.data[dragDropToFirstEventMock.currentIndex].id).toEqual(
        dragDropToFirstEventMock.item.data.id
      );
      expect(mockServiceSpy.updatePosition).toHaveBeenCalledWith(position);
    });

    it('when position is to last position after dropping', () => {
      const dragDropToLastEventMock: any = {
        currentIndex: 4,
        item: {
          data: component.dataSource.data[1]
        }
      };
      const brandPositionToBeReplaced =
        component.dataSource.data[dragDropToLastEventMock.currentIndex].id;

      const position: ObjectPosition = {
        id: dragDropToLastEventMock.item.data.id,
        afterId: brandPositionToBeReplaced
      };

      component.dropObjectRow(dragDropToLastEventMock);

      expect(component.dataSource.data[dragDropToLastEventMock.currentIndex].id).toEqual(
        dragDropToLastEventMock.item.data.id
      );
      expect(mockServiceSpy.updatePosition).toHaveBeenCalledWith(position);
    });

    it('should not update brand row', () => {
      const error = new Error('Error!');
      const dragDropEventMock: any = {
        currentIndex: 1,
        item: {
          data: component.dataSource.data[2]
        }
      };

      mockServiceSpy.updatePosition.throwWith(error);
      component.dropObjectRow(dragDropEventMock);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
