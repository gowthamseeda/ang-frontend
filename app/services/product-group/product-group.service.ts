import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../../iam/user/user.service';

import { ProductGroup } from './product-group.model';
import { ProductGroupCollectionService } from './store/product-group-collection.service';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {
  constructor(
    private productGroupCollectionService: ProductGroupCollectionService,
    private userService: UserService
  ) {
    this.productGroupCollectionService.getAll();
  }

  get(id: string): Observable<ProductGroup | undefined> {
    return this.productGroupCollectionService.entityMap$.pipe(map(entityMap => entityMap[id]));
  }

  getAll(): Observable<ProductGroup[]> {
    return this.productGroupCollectionService.entities$;
  }

  getAllForUserDataRestrictions(isFocusEnabled: boolean): Observable<ProductGroup[]> {
    return combineLatest([this.getAll(), this.userService.getProductGroupRestrictions()]).pipe(
      map(([productGroups, productGroupRestrictions]) => {
        if (
          (!productGroupRestrictions || productGroupRestrictions.length === 0) &&
          !isFocusEnabled
        ) {
          return productGroups;
        }

        return productGroups.filter(productGroup =>
          productGroupRestrictions.includes(productGroup.id)
        );
      })
    );
  }
}
