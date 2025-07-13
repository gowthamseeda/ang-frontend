import { CdkDragDrop, CdkDragStart, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { difference } from 'ramda';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Country } from '../../../../../geography/country/country.model';
import { SortingService } from '../../../../../shared/services/sorting/sorting.service';
import { MasterCountryService } from '../../../../country/master-country/master-country.service';

@Component({
  selector: 'gp-service-variant-country-drag-drop',
  templateUrl: './service-variant-country-drag-drop.component.html',
  styleUrls: ['./service-variant-country-drag-drop.component.scss']
})
export class ServiceVariantCountryDragDropComponent
  implements OnChanges, AfterViewChecked, OnDestroy {
  @Input() countryRestrictions: string[];
  @Output() restrictedCountries = new EventEmitter<Country[]>();

  availableCountries: Country[];
  restrictCountries: Country[];
  displayAvailableCountries: Country[];
  displayRestrictCountries: Country[];
  searchFormGroup: UntypedFormGroup;

  multiSelect = {
    multiSelect: false,
    verifyDragStarted: false,
    ctrlMode: false,
    firstContainer: (null as unknown) as HTMLElement,

    selectDrag(element: HTMLElement): HTMLElement {
      while (!element.classList.contains('cdk-drag')) {
        element = element.parentElement as HTMLElement;
      }
      return element;
    },

    mouseDown(event: Event): void {
      const target = this.selectDrag(event.target as HTMLElement);
      const ctrlKey = (event as KeyboardEvent).ctrlKey;

      if (this.multiSelect) {
        const allSelected = document.querySelectorAll('.selected').length;
        if (
          allSelected === 1 &&
          target.classList.contains('selected') &&
          (this.ctrlMode ? ctrlKey : true)
        ) {
          target.classList.remove('selected');
          this.multiSelect = false;
        }
      } else {
        const addSelected = () => {
          this.multiSelect = true;
          this.firstContainer = target.parentElement as HTMLElement;
          target.classList.add('selected');
        };

        if (ctrlKey) {
          this.ctrlMode = true;
          addSelected();
        }
      }
    },

    mouseUp(event: Event): void {
      if (this.multiSelect && !this.verifyDragStarted) {
        const target = this.selectDrag(event.target as HTMLElement);
        const allSelected = document.querySelectorAll('.selected');
        const ctrlKey = (event as KeyboardEvent).ctrlKey;

        if (
          target.classList.contains('selected') &&
          allSelected.length > 1 &&
          (this.ctrlMode ? ctrlKey : true)
        ) {
          target.classList.remove('selected');
        } else {
          if (this.firstContainer === target.parentElement && (this.ctrlMode ? ctrlKey : true)) {
            target.classList.add('selected');
          } else if (this.ctrlMode ? ctrlKey : true) {
            allSelected.forEach(element => {
              element.classList.remove('selected', 'hide');
            });
            this.firstContainer = target.parentElement as HTMLElement;
            target.classList.add('selected');
          }
        }
      }
    },

    dragStarted(): void {
      this.verifyDragStarted = true;
    },

    dragEnded(): void {
      this.verifyDragStarted = false;
    },

    dropListDropped(e: CdkDragDrop<string[]>): void {
      if (e.item.element.nativeElement.classList.contains('selected')) {
        this.multiSelect = false;
      }
    }
  };

  multiDrag = {
    dragErase: Symbol('DragErase') as any,
    dragList: [''],
    dragListClone: [''],

    dragStarted(event: CdkDragStart): void {
      if (event.source.element.nativeElement.classList.contains('selected')) {
        const listData = event.source.dropContainer.data;
        this.dragList = [];
        this.dragListClone = [...listData];

        const containerElement = event.source.dropContainer.element.nativeElement;
        const container = Array.from(containerElement.children);
        const allSelected = Array.from(containerElement.getElementsByClassName('selected'));

        allSelected.forEach(eli => {
          const currDOMIndex = container.indexOf(eli);

          this.dragList.push(listData[currDOMIndex]);
          this.dragListClone[currDOMIndex] = this.dragErase;

          eli.classList.add('hide');
        });
      }
    },

    dropListDropped(event: CdkDragDrop<Country[]>): void {
      if (event.previousContainer !== event.container) {
        this.dragListClone = this.dragListClone.filter(
          (element: any) => element !== this.dragErase
        );
        for (let i = 0; i < event.previousContainer.data.length; i++) {
          event.previousContainer.data[i] = this.dragListClone[i];
        }
        for (let i = 0; i < this.dragList.length; i++) {
          event.previousContainer.data.pop();
        }

        const otherListCopy = [...event.container.data];
        otherListCopy.splice(event.currentIndex, 0, ...this.dragList);

        for (let i = 0; i < otherListCopy.length; i++) {
          event.container.data[i] = otherListCopy[i];
        }
      }

      const allHidden = document.querySelectorAll('.hide');
      allHidden.forEach(element => {
        element.classList.remove('hide');
      });

      setTimeout(() => {
        const allSelected = document.querySelectorAll('.selected');
        allSelected.forEach(element => {
          element.classList.remove('selected');
        });
      }, 100);

      this.dragListClone = [];
      this.dragList = [];
    }
  };

  private unsubscribe = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private countryService: MasterCountryService,
    private sortingService: SortingService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnChanges(): void {
    this.initFormGroup();
    this.initAvailableCountries();
    this.initRestrictedCountries();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initAvailableCountries(): void {
    this.countryService
      .getAll()
      .pipe(takeUntil(this.unsubscribe))
      .pipe(
        map(countries =>
          countries.filter(country => !this.countryRestrictions.includes(country.id))
        )
      )
      .subscribe(countries => {
        this.displayAvailableCountries = countries.sort(this.sortingService.sortByName);
        this.availableCountries = this.displayAvailableCountries;
      });
  }

  initRestrictedCountries(): void {
    this.countryService
      .getAll()
      .pipe(takeUntil(this.unsubscribe))
      .pipe(
        map(countries => countries.filter(country => this.countryRestrictions.includes(country.id)))
      )
      .subscribe(countries => {
        this.displayRestrictCountries = countries.sort(this.sortingService.sortByName);
        this.restrictCountries = this.displayRestrictCountries;
      });
  }

  onKeyUpAvailableCountries(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    this.displayAvailableCountries = this.filterCountries(this.availableCountries, filterValue);
  }

  onKeyUpRestrictCountries(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    this.displayRestrictCountries = this.filterCountries(this.restrictCountries, filterValue);
  }

  drop(event: CdkDragDrop<Country[]>): void {
    if (event.item.element.nativeElement.classList.contains('selected')) {
      this.multiDrag.dropListDropped(event);
    } else {
      if (event.previousContainer !== event.container) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
    if (event.container.id === 'availableCountry') {
      this.availableCountries = event.container.data;
      this.displayAvailableCountries = this.availableCountries.sort(this.sortingService.sortByName);

      this.restrictCountries = difference(this.restrictCountries, this.availableCountries);
      this.displayRestrictCountries = this.restrictCountries;
    }
    if (event.container.id === 'restrictCountry') {
      this.restrictCountries = event.container.data;
      this.displayRestrictCountries = this.restrictCountries.sort(this.sortingService.sortByName);

      this.availableCountries = difference(this.availableCountries, this.restrictCountries);
      this.displayAvailableCountries = this.availableCountries;
    }
    this.restrictedCountries.emit(this.restrictCountries);
  }

  selectAll(event: Event, isSelectedAll: boolean): void {
    const selectedParent = event.target as HTMLElement;
    if (selectedParent !== null) {
      const selectedDiv = selectedParent
        .closest('button')
        ?.parentElement?.getElementsByClassName('cdk-drag');
      if (selectedDiv !== undefined) {
        for (let i = 0; i < selectedDiv.length; i++) {
          if (isSelectedAll) {
            selectedDiv[i].classList.add('selected');
          } else {
            selectedDiv[i].classList.remove('selected');
          }
        }
      }
    }
  }

  private filterCountries(countries: Country[], filterValue: string): Country[] {
    return countries.filter(country =>
      country.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  private initFormGroup(): void {
    this.searchFormGroup = this.formBuilder.group({
      searchAvailable: '',
      searchRestrict: ''
    });
  }
}
