import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AutocompleteComponent } from './autocomplete.component';
import { MaterialModule } from '../../material/material.module';
import { EsHighlightComponent } from '../es-highlight/es-highlight.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let keyEventArrowDown: KeyboardEvent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AutocompleteComponent, EsHighlightComponent],
        imports: [MaterialModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.listItems = [];
    component.listItems.push('Item 1');
    component.isHidden = true;
    fixture.detectChanges();

    keyEventArrowDown = new KeyboardEvent('keyup', {
      key: 'ArrowDown'
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('first keyup ArrowDown event should select first option', () => {
    component.selectMatOptionByKeyboard(keyEventArrowDown);
    fixture.detectChanges();
    expect(component.list.first.selected).toBe(true);
  });

  it('keyup ArrowDown and enter event should emit a searchTagSelect event', () => {
    jest.spyOn(component.itemSelect, 'emit');
    component.selectMatOptionByKeyboard(keyEventArrowDown);
    const keyEventEnter = new KeyboardEvent('keyup', {
      key: 'Enter'
    });
    component.selectMatOptionByKeyboard(keyEventEnter);
    fixture.detectChanges();
    expect(component.itemSelect.emit).toHaveBeenCalled();
  });

  it('should emit value', () => {
    jest.spyOn(component.itemSelect, 'emit');
    component.emitValue('my search value');
    expect(component.itemSelect.emit).toHaveBeenCalled();
  });

  it('should not emit value has less than 3 characters', () => {
    jest.spyOn(component.itemSelect, 'emit');
    component.emitValue('gs');
    expect(component.itemSelect.emit).not.toHaveBeenCalled();
  });

  it('should not emit value when only spaces', () => {
    jest.spyOn(component.itemSelect, 'emit');
    component.emitValue(' '.repeat(5));
    expect(component.itemSelect.emit).not.toHaveBeenCalled();
  });
});
