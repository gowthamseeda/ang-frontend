import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NavigationService } from './navigation.service';

describe('NavigationService Test Suite', () => {
  let navigationService: NavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn()
          }
        }
      ]
    });

    navigationService = TestBed.inject(NavigationService);
    router = TestBed.inject(Router);
  });

  test('should init', () => {
    expect(navigationService).toBeTruthy();
  });

  describe('navigateAbsoluteTo should', () => {
    test('call navigateByUrl with correct param', () => {
      jest.spyOn(router, 'navigateByUrl');

      navigationService.navigateAbsoluteTo('myTarget');

      expect(router.navigateByUrl).toHaveBeenCalledWith('myTarget');
    });
  });
});
