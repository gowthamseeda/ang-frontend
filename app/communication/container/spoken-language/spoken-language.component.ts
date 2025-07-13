import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { Language } from '../../../geography/language/language.model';
import { LanguageService } from '../../../geography/language/language.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import { CommunicationService } from '../../communication.service';
import {DistributionLevelsService} from "../../../traits/distribution-levels/distribution-levels.service";

@Component({
  selector: 'gp-spoken-language',
  templateUrl: './spoken-language.component.html',
  styleUrls: ['./spoken-language.component.scss']
})
export class SpokenLanguageComponent implements OnInit, OnDestroy {
  @Input()
  userIsAuthorizedForOutlet: Observable<boolean>;

  @Output()
  dataChangedManually = new EventEmitter();

  isLoadingSpokenLanguage = true;
  allSpokenLanguages: Observable<Language[]>;
  assignedSpokenLanguageId: Observable<string | undefined>;

  userIsAuthorizedForUpdateSpokenLanguage = false;

  private unsubscribe = new Subject<void>();
  private spokenLanguageData: string | undefined;

  constructor(
    private communicationService: CommunicationService,
    private languageService: LanguageService,
    private userAuthorizationService: UserAuthorizationService,
    private distributionLevelsService: DistributionLevelsService,
  ) {}

  ngOnInit(): void {
    this.allSpokenLanguages = this.languageService.getTwoLetterLanguages();
    this.initSpokenLanguage();
    this.initUserAuthorization();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  reset(): void {
    this.initSpokenLanguage();
  }

  languageSelectionChanged(languageId: string): void {
    this.updateSpokenLanguageData(languageId);
    this.dataChangedManually.emit();
  }

  saveObservable(): Observable<ObjectStatus> {
    const languageId: string | undefined = this.spokenLanguageData;
    return this.communicationService.updateSpokenLanguageIdsOfOutlet(
      languageId ? [languageId] : []
    );
  }

  isUserAuthorizedForSpokenLanguageChange(): boolean {
    return this.userIsAuthorizedForUpdateSpokenLanguage;
  }

  private initUserAuthorization(): void {
    let permission: string;
    this.distributionLevelsService.getDistributionLevelsOfOutlet().subscribe(distributionLevels => {
      permission = distributionLevels.includes('TEST_OUTLET')
        ? 'communications.testoutlet.update'
        : 'communications.spokenlanguages.update';
      this.userAuthorizationService.isAuthorizedFor
        .permissions([permission])
        .verify()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(isAuthorized => (this.userIsAuthorizedForUpdateSpokenLanguage = isAuthorized));
    });
  }

  private updateSpokenLanguageData(id: string | undefined): void {
    this.spokenLanguageData = id;
  }

  private initSpokenLanguage(): void {
    this.isLoadingSpokenLanguage = true;
    this.assignedSpokenLanguageId = this.communicationService.getSpokenLanguageIdsOfOutlet().pipe(
      map(languages => languages.shift()),
      tap(languageId => {
        this.updateSpokenLanguageData(languageId);
        this.isLoadingSpokenLanguage = false;
      }),
      takeUntil(this.unsubscribe)
    );
  }
}
