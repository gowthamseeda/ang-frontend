import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ContentChange, QuillModules } from 'ngx-quill';
import { Observable, of, Subject } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { UserAuthorizationService } from '../../iam/user/user-authorization.service';

import { User } from '../../iam/user/user.model';
import { UserService } from '../../iam/user/user.service';
import { Announcement, AnnouncementType } from '../../notifications/models/announcement.model';
import { AnnouncementService } from '../../notifications/services/announcement.service';
import { FeatureToggleService } from '../../shared/directives/feature-toggle/feature-toggle.service';
import { CanDeactivateComponent } from '../../shared/guards/can-deactivate-guard.model';
import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';
import { MatDialog } from "@angular/material/dialog";
import { SecurityPopUpComponent } from "../security-notification/security-pop-up.component";
import { UserSettingsService } from "../../user-settings/user-settings/services/user-settings.service";
import {PR_ROLE} from "../../tasks/tasks.constants";

export const MAX_WORD_COUNT = 2000;

@Component({
  selector: 'gp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  currentUser: Observable<User>;
  announcementFeature: boolean;

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    content: new UntypedFormControl('')
  });

  readOnly = true;
  currentWordCount = 0;
  maxWordCount = MAX_WORD_COUNT;
  editMode = false;

  quillModules: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: [] }],
      [{ header: [] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean']
    ]
  };

  private content = '';
  private unsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private userAuthorizationService: UserAuthorizationService,
    private featureToggleService: FeatureToggleService,
    private announcementService: AnnouncementService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrent();

    this.featureToggleService
      .isFeatureEnabled('DASHBOARD_ANNOUNCEMENT')
      .pipe(
        takeUntil(this.unsubscribe),
        tap(enabled => (this.announcementFeature = enabled))
      )
      .subscribe();

    this.userAuthorizationService.isAuthorizedFor
      .permissions(['notifications.announcement.update'])
      .verify()
      .pipe(
        takeUntil(this.unsubscribe),
        tap(updatePermission => (this.readOnly = !updatePermission))
      )
      .subscribe();
    
    this.userService
      .getRoles()
      .subscribe(roles => {
        if(roles.some(role => PR_ROLE.includes(role))){
          if (sessionStorage.getItem("SeenSecurityPopUp") != "TRUE") {
            this.currentUser
              .pipe(take(1))
              .subscribe(currentUser => {
                this.userSettingsService
                  .fetchUserAgreementStatus(currentUser.userId)
                  .pipe(take(1))
                  .subscribe(status => {
                    if (!status) {
                      this.showSecurityPopUp()
                    }
                  })
              })
            sessionStorage.setItem("SeenSecurityPopUp", "TRUE")
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  editorCreated(): void {
    this.announcementService
      .get(AnnouncementType.DASHBOARD, 'en')
      .pipe(
        takeUntil(this.unsubscribe),
        tap(announcement => {
          this.content = announcement.content;
          this.formGroup.patchValue({ content: this.content });
        }),
        catchError(error => {
          return of(error);
        })
      )
      .subscribe();
  }

  contentChanged(event: ContentChange): void {
    this.currentWordCount = event.text
      .trim()
      .split(/\s+/g)
      .filter(word => word !== '').length;
    this.currentWordCount > this.maxWordCount
      ? this.formGroup.setErrors({})
      : this.formGroup.setErrors(null);
  }

  save(): void {
    let content = this.formGroup.get('content')?.value;
    let announcement: Announcement = {
      type: AnnouncementType.DASHBOARD,
      languageId: 'en',
      content
    };
    this.announcementService
      .update(announcement)
      .pipe(
        takeUntil(this.unsubscribe),
        tap(_ => {
          this.content = content;
          this.formGroup.markAsPristine();
          this.snackBarService.showInfo('DASHBOARD_ANNOUNCEMENT_SUCCESS');
          this.editMode = false;
        }),
        catchError(error => {
          this.snackBarService.showError(error);
          return of(error);
        })
      )
      .subscribe();
  }

  cancel(): void {
    this.formGroup.patchValue({ content: this.content });
    this.formGroup.markAsPristine();
  }

  canDeactivate(): boolean {
    return this.formGroup.pristine;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  contentAsDelta() : any  {
    if (this.content) {
      try {
        return JSON.parse(this.content);
      } catch (e) {
        console.error('Error parsing Delta content:', e);
      }
    }

    // Return a default empty Delta object if there's no content
    return { ops: [] };
  }

  showSecurityPopUp(): void {
    this.dialog.open(SecurityPopUpComponent, {
      width: '40%',
      disableClose: true
    })
  }
}
