import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventNameHistoryModel } from '../../models/event-name-history.model';
import { OfferedServiceValidity } from '../../models/outlet-history-snapshot.model';
import { HistorizationService } from '../../service/historization.service';

@Component({
  selector: 'gp-detail-offered-service',
  templateUrl: './detail-offered-service.component.html',
  styleUrls: ['./detail-offered-service.component.scss']
})
export class DetailOfferedServiceComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['event', 'time', 'value'];
  offeredServiceValidity: OfferedServiceValidity;

  private unsubscribe = new Subject<void>();

  constructor(
    private historizationService: HistorizationService,
    public dialogRef: MatDialogRef<DetailOfferedServiceComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      outletId: string;
      offeredServiceId: string;
      date: string;
    }
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.historizationService
      .getOfferedServiceValidity(this.data.outletId, this.data.offeredServiceId, this.data.date)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((offeredServiceValidity: OfferedServiceValidity) => {
        this.offeredServiceValidity = offeredServiceValidity;
        for (const validity of this.offeredServiceValidity.validities) {
          validity.eventName = this.getEventNameTranslation(validity.eventName!!);
          validity.occurredOnForTimeOnly = this.formatAMPM(validity.occurredOn!!.toString());
        }
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  getEventNameTranslation(eventName: string): string {
    switch (eventName) {
      case 'OfferedServiceValidityChanged': {
        return EventNameHistoryModel.OFFERED_SERVICE_VALIDITY_CHANGED;
      }
      default: {
        return eventName;
      }
    }
  }

  formatAMPM(dateStr: string): string {
    let time: number = Date.parse(dateStr); // use (dateStr + "Z") if wanna use local time
    let date: Date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesTxt = minutes < 10 ? '0' + minutes : minutes;
    return (
      hours + ':' + minutesTxt + ':' + date.getSeconds() + '.' + date.getMilliseconds() + ' ' + ampm
    );
  }
}
