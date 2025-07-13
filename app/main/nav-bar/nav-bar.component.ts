import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ActivationStart, NavigationEnd, Router } from '@angular/router';
import { filter, take, takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { UserService } from '../../iam/user/user.service';
import { SearchFilterTag } from '../../search/models/search-filter.model';
import { SearchResultMessage } from '../../search/search-result/search-result.component';
import { SearchFieldInput } from '../../search/searchfield/searchfield-input.model';
import { SearchFieldSettings } from '../../search/searchfield/searchfield-settings.model';
import { CustomEventBusService } from '../../shared/services/custom-event-bus/custom-event-bus.service';
import { AppStateService } from '../../shared/services/state/app-state-service';
import { TaskWebSocketService } from '../../tasks/service/task-websocket.service';

@Component({
  selector: 'gp-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class SideNavigationComponent implements OnInit {
  searchFieldInput: SearchFieldInput;
  searchFieldSettings: SearchFieldSettings;

  @ViewChild(MatSidenav, { static: true })
  navDetail: MatSidenav;
  fragmentsWithDetailNavigation = ['search', 'creation-menu', 'structures-menu', 'app-menu'];

  newTaskAvailable: boolean = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private appState: AppStateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private customEventBus: CustomEventBusService,
    private taskWebSocketService: TaskWebSocketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initSearchFieldInput();
    this.initSearchFieldSettings();
    this.subscribeToWebSocketPromptRefresh();

    this.router.events
      .pipe(
        filter(event => event instanceof ActivationStart && event.snapshot.component !== undefined)
      )
      .subscribe((event: ActivationStart) => {
        if (this.navDetail.opened && !event.snapshot.paramMap.get('outletId')) {
          this.closeNavDetail();
        }
      });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url.includes('dashboard')) {
        this.userService.getRoles().subscribe(Roles => {
          if (Roles.includes('GSSNPLUS.BusinessSiteResponsible')) {
            this.showNavDetail('retailer-outlets');
          } else {
            this.showNavDetail('search');
          }
        });
      }
    });

    this.activatedRoute.fragment
      .pipe(
        filter(fragment =>
          fragment ? this.fragmentsWithDetailNavigation.includes(fragment) : false
        )
      )
      .subscribe((fragment: string) => {
        this.toggleNavDetail(fragment);
      });

    this.customEventBus
      .data('updateTaskList')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.subscribeToWebSocketPromptRefresh();
      });
  }

  subscribeToWebSocketPromptRefresh() {
    this.taskWebSocketService
      .getPromptRefresh()
      .pipe(
        filter(isUpdated => isUpdated === true),
        take(1)
      )
      .toPromise()
      .then(newTaskAvailable => {
        if (newTaskAvailable) {
          this.newTaskAvailable = newTaskAvailable;
        }
      });
  }

  toggleNavDetail(navItem?: string): void {
    !navItem || this.isActiveNavItem(navItem)
      ? this.closeNavDetailAndUpdateUrl()
      : this.showNavDetail(navItem);
  }

  isActiveNavItem(navItem: string): boolean {
    return this.appState.get('activeNavItem') && this.appState.get('activeNavItem') === navItem;
  }

  reloadTaskList(): void {
    this.newTaskAvailable = false;
    this.customEventBus.dispatchEvent('updateTaskList');
  }

  private closeNavDetailAndUpdateUrl(): void {
    this.closeNavDetail();
    this.updateUrlInBrowser();
  }

  private closeNavDetail(): void {
    this.appState.save('activeNavItem', null);
    this.navDetail.close();
  }

  private showNavDetail(navItem: string): void {
    if (!this.navDetail.opened) {
      this.navDetail.open();
    }
    this.appState.save('activeNavItem', navItem);
    this.updateUrlInBrowser('#' + navItem);
  }

  private updateUrlInBrowser(fragment: string = ''): void {
    const urlTree = this.router.parseUrl(this.router.url);

    const rootUlr = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
    if (rootUlr) {
      this.location.go(rootUlr + fragment);
    }
  }

  private initSearchFieldInput(): void {
    this.searchFieldInput = new SearchFieldInput({
      predefinedSearchFilters: [new SearchFilterTag('type=BusinessSite')],
      searchResultMessage: new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
    });
  }

  private initSearchFieldSettings(): void {
    this.searchFieldSettings = new SearchFieldSettings({
      searchResultItemClickAction: 'routing',
      contextId: 'NavBar'
    });
  }
}
