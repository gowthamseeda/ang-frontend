import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterLanguage } from '../master-language/master-language.model';
import { MasterLanguageService } from '../master-language/master-language.service';

@Component({
  selector: 'gp-update-language',
  templateUrl: './update-language.component.html',
  styleUrls: ['./update-language.component.scss']
})
export class UpdateLanguageComponent implements OnInit {
  languageForm: UntypedFormGroup;
  id: string;
  languageName: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private languageService: MasterLanguageService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initLanguageForm();
    this.getIdByRouteParams().subscribe(() => {
      this.initLanguage();
    });
  }

  submit(language: MasterLanguage): void {
    language.id = this.id;
    this.languageService.update(language).subscribe(
      () => {
        this.languageService.clearCacheAndFetchAll();
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('UPDATE_LANGUAGE_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  private initLanguageForm(): void {
    this.languageForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      representation: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  private initLanguage(): void {
    this.languageService.fetchBy(this.id).subscribe((language: MasterLanguage) => {
      this.languageName = language.name;
      this.languageForm.patchValue({
        id: this.id,
        name: language.name,
        representation: language.representation
      });
    });
  }

  private getIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }
}
