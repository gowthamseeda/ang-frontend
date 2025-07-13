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
      has: function (name: string) {
        return false;
      },
      get: function (name: string) {
        return '';
      },
      getAll: function (name: string) {
        return [];
      },
      keys: []
    },
    queryParams: { key: '' },
    queryParamMap: {
      has: function (name: string) {
        return false;
      },
      get: function (name: string) {
        return '';
      },
      getAll: function (name: string) {
        return [];
      },
      keys: []
    }
  } as ActivatedRouteSnapshot;
}
