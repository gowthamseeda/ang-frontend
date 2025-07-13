import { ActivatedRouteSnapshot, Params, UrlSegment } from '@angular/router';

export function getActivatedRouteSnapshotMock(
  params: Params,
  routeConfigPath: string
): ActivatedRouteSnapshot {
  return {
    title:'',
    url: [new UrlSegment('', { name: 'name' })],
    params: params,
    fragment: '',
    data: {},
    outlet: '',
    component: null,
    routeConfig: { path: routeConfigPath },
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
        return params.outletId;
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
  } as ActivatedRouteSnapshot;
}
