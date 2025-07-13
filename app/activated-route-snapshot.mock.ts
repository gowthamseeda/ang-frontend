import { ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

export function getActivatedRouteSnapshotMock(): ActivatedRouteSnapshot {
  const activatedRouteSnapshot = {
    title:'',
    url: [new UrlSegment('', { name: 'name' })],
    params: { key: '' },
    fragment: '',
    data: {
      authorizationGuardPermissions: [
        'legalstructure.businesssite.create',
        'legalstructure.businesssite.update',
        'legalstructure.company.create',
        'legalstructure.company.update',
        'geography.country.update',
        'geography.country.delete'
      ],
      authorizationGuardBlockedPermissions: ['app.retail.hide']
    },
    outlet: '',
    component: null,
    routeConfig: null,
    root: this,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: {
      has: function (): boolean {
        return false;
      },
      get: function (): string {
        return '';
      },
      getAll: function (): any[] {
        return [];
      },
      keys: []
    },
    queryParams: { key: '' },
    queryParamMap: {
      has: function (): boolean {
        return false;
      },
      get: function (): string {
        return '';
      },
      getAll: function (): any[] {
        return [];
      },
      keys: []
    }
  };
  return activatedRouteSnapshot as ActivatedRouteSnapshot;
}
