import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DistributionLevelsService } from '../../distribution-levels.service';

@Component({
  selector: 'gp-distribution-level-select-dialog',
  templateUrl: './distribution-level-select-dialog.component.html',
  styleUrls: ['./distribution-level-select-dialog.component.scss']
})
export class DistributionLevelSelectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DistributionLevelSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private distributionLevelService: DistributionLevelsService
  ) {}

  removeDistributionLevel(distributionLevelToRemove: string, clickEvent: Event): void {
    clickEvent.stopPropagation();

    this.data.assignedDistributionLevelControl.setValue(
      this.data.assignedDistributionLevelControl.value.filter(
        (distributionLevel: string) => distributionLevel !== distributionLevelToRemove
      )
    );
    this.data.assignedDistributionLevelControl.markAsDirty();
  }

  isEditable(distributionLevel: string): Boolean {
    if (
      this.data.allEditable &&
      this.data.editableDistributionLevels &&
      this.data.editableDistributionLevels.length === this.data.distributionLevels.length
    ) {
      return true;
    }

    return (
      this.data.editableDistributionLevels.includes(distributionLevel) &&
      (this.data.allEditable ||
        this.distributionLevelService.isDistributionLevelEditable(
          this.data.originDistributionLevels,
          distributionLevel
        ))
    );
  }

  isTestOutletDisable(distributionLevel: string): boolean {
    if (distributionLevel === 'TEST_OUTLET') {
      return !(this.data.productResponsibleUser && !this.data.isEditPage);
    }
    return false;
  }
}
