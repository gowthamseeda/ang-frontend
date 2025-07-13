import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { noop, Observable, zip } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { UserSearchResults } from '../../iam/user-search/user-search.model';
import { UserSearchService } from '../../iam/user-search/user-search.service';
import { UserService } from '../../iam/user/user.service';
import { RetailerOutletsService } from '../../search/retailer-outlets/retailer-outlets.service';
import { UserSettingsService } from '../../user-settings/user-settings/services/user-settings.service';
import {
  CONTACTS,
  FALLBACK_LANGUAGE,
  MPC_ROLE,
  MPC_ROLE_HEADER,
  PDFS,
  RETAILER_ROLE,
  VIDEOS
} from '../help.constants';
import { Contact, Pdf, Video } from '../help.model';

import { HelpVideoDialogComponent } from './help-video-dialog/help-video-dialog.component';

@Component({
  selector: 'gp-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  videos: Video[] = VIDEOS;
  pdfs: Pdf[] = PDFS;
  contacts: Contact[] = CONTACTS;

  language = FALLBACK_LANGUAGE;

  constructor(
    private dialog: MatDialog,
    private userSettingsService: UserSettingsService,
    private userService: UserService,
    private userSearchService: UserSearchService,
    private retailerOutletsService: RetailerOutletsService
  ) {}

  ngOnInit(): void {
    this.userSettingsService.get().subscribe(userSettings => {
      if (userSettings.languageId != null) {
        // Get the language only i.e. en in en-US
        this.language = userSettings.languageId.split('-')[0];
      }
    });

    this.userService
      .getRoles()
      .pipe(tap(roles => (roles.includes(RETAILER_ROLE) ? this.getMPCList() : noop())))
      .subscribe();
  }

  getMPCList(): void {
    zip(this.getBusinessSitesCountryIds(), this.userService.getBusinessSiteRestrictions())
      .pipe(
        tap(([countries, businessSites]) => {
          this.searchUsersByCountryAndBusinessSite(countries, businessSites);
        })
      )
      .subscribe();
  }

  getBusinessSitesCountryIds(): Observable<string[]> {
    return this.retailerOutletsService.getAll().pipe(
      map(result => {
        return result.searchItems
          .map(item => item.payload.countryId)
          .filter((value, index, self) => self.indexOf(value) === index);
      }),
      catchError(_ => [])
    );
  }

  searchUsersByCountryAndBusinessSite(Country: string[], BusinessSite: string[]): void {
    const dataRestrictions = {
      Country,
      BusinessSite
    };

    this.userSearchService
      .get(MPC_ROLE, dataRestrictions)
      .pipe(tap((results: UserSearchResults) => this.handleSearchUsersSuccessRes(results)))
      .subscribe();
  }

  handleSearchUsersSuccessRes(results: UserSearchResults): void {
    this.contacts[1] = {
      role: MPC_ROLE_HEADER,
      users: results.userSearchResults
    };
  }

  playVideo(video: Video): void {
    this.dialog.open(HelpVideoDialogComponent, {
      width: '1080px',
      data: {
        video: video,
        language: this.language
      }
    });
  }
}
