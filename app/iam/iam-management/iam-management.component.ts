import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'gp-iam',
  templateUrl: './iam-management.component.html',
  styleUrls: ['./iam-management.component.scss']
})
export class IAMManagementComponent implements OnInit {
  IamManagementForm: UntypedFormGroup;
  pdfSource: string;
  host = `${window.location.protocol}//${window.location.host}/`;
  path = window.location.pathname.split('/')[1];
  IAM_EXCEL_API_PATH = 'iam/api/v1/users/generate-users-excel';

  constructor(private formBuilder: UntypedFormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initIamManagementForm();
    this.pdfSource = this.getExcelSource();
  }

  submit(iam: any) {
    this.router.navigateByUrl('/iam/' + iam.id);
  }

  private initIamManagementForm(): void {
    this.IamManagementForm = this.formBuilder.group({
      id: ['', []]
    });
  }

  exportIamUsers() {
    //TODO
  }

  getExcelSource(): string {
    if (this.path === 'app' || this.path === 'local') {
      return `${this.host}${this.IAM_EXCEL_API_PATH}`;
    }
    return `${this.host}${this.path}/${this.IAM_EXCEL_API_PATH}`;
  }
}
