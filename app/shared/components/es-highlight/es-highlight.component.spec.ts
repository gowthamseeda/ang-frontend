import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EsHighlightComponent, TextPart } from './es-highlight.component';

describe('EsHighlightComponent', () => {
  let component: EsHighlightComponent;
  let fixture: ComponentFixture<EsHighlightComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EsHighlightComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EsHighlightComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngPnChanges', () => {
    it('highlight text within a string', () => {
      component.text = 'Lorem ipsum do***!"§*$%***&/()=?lor sit amet, **sed di*am VoLuPtUa.';
      component.ngOnChanges();

      const expected: TextPart[] = [
        new TextPart('Lorem ipsum do', false),
        new TextPart('!"§*$%', true),
        new TextPart('&/()=?lor sit amet, **sed di*am VoLuPtUa.', false)
      ];

      expect(component.textParts).toEqual(expected);
    });

    it('highlight text at the beginning of a string', () => {
      component.text = '***Lor*em*** ipsum do!"§*$%&/()=?lor sit amet, **sed di*am VoLuPtUa.';
      component.ngOnChanges();

      const expected: TextPart[] = [
        new TextPart('Lor*em', true),
        new TextPart(' ipsum do!"§*$%&/()=?lor sit amet, **sed di*am VoLuPtUa.', false)
      ];

      expect(component.textParts).toEqual(expected);
    });

    it('highlight text at the beginning and withing a string', () => {
      component.text = '***Lor*em*** ipsum do!"§*$%&/()=?lor ***sit*** amet, **sed di*am VoLuPtUa.';
      component.ngOnChanges();

      const expected: TextPart[] = [
        new TextPart('Lor*em', true),
        new TextPart(' ipsum do!"§*$%&/()=?lor ', false),
        new TextPart('sit', true),
        new TextPart(' amet, **sed di*am VoLuPtUa.', false)
      ];

      expect(component.textParts).toEqual(expected);
    });

    it('highlight all words in string', () => {
      component.text = '***Lorem*** ***sit*** ***amet, **sed di*am VoLuPtUa.***';
      component.ngOnChanges();

      const expected: TextPart[] = [
        new TextPart('Lorem', true),
        new TextPart(' ', false),
        new TextPart('sit', true),
        new TextPart(' ', false),
        new TextPart('amet, **sed di*am VoLuPtUa.', true)
      ];

      expect(component.textParts).toEqual(expected);
    });

    it('no highlighting', () => {
      component.text = 'Lorem ipsum do!"§*$%&/()=?lor sit amet, **sed di*am VoLuPtUa.';
      component.ngOnChanges();

      expect(component.textParts).toEqual([new TextPart(component.text, false)]);
    });

    it('highlight complete single word string', () => {
      component.text = '***Lorem***';
      component.ngOnChanges();

      expect(component.textParts).toEqual([new TextPart('Lorem', true)]);
    });

    it('no hightlighting of a single word string', () => {
      component.text = 'Lorem';
      component.ngOnChanges();

      expect(component.textParts).toEqual([new TextPart('Lorem', false)]);
    });

    it('manual highlighting of a single word in string', () => {
      component.text = 'lorem ipsum dolor sit amet';
      component.manualHighlightText = 'ipsum';
      component.ngOnChanges();

      const expected: TextPart[] = [
        new TextPart('lorem ', false),
        new TextPart('ipsum', true),
        new TextPart(' dolor sit amet', false)
      ];

      expect(component.textParts).toEqual(expected);
    });

    it('manual highlighting of a multiple words in string', () => {
      component.text = 'lorem ipsum dolor sit amet';
      component.manualHighlightText = 'sit lorem';
      component.ngOnChanges();

      const expected: TextPart[] = [
        new TextPart('lorem', true),
        new TextPart(' ipsum dolor ', false),
        new TextPart('sit', true),
        new TextPart(' amet', false)
      ];

      expect(component.textParts).toEqual(expected);
    });

    it('manual highlighting overrules automatic highlighting', () => {
      component.text = 'lorem ipsum ***dolor*** sit amet';
      component.manualHighlightText = 'sit';
      component.ngOnChanges();

      const expected: TextPart[] = [
        new TextPart('lorem ipsum dolor ', false),
        new TextPart('sit', true),
        new TextPart(' amet', false)
      ];

      expect(component.textParts).toEqual(expected);
    });

    it('manual highlighting of a multiple equal words in string', () => {
      component.text = 'this is a very very long string';
      component.manualHighlightText = 'very long';
      component.ngOnChanges();

      const expected: TextPart[] = [
        new TextPart('this is a ', false),
        new TextPart('very', true),
        new TextPart(' ', false),
        new TextPart('very', true),
        new TextPart(' ', false),
        new TextPart('long', true),
        new TextPart(' string', false)
      ];

      expect(component.textParts).toEqual(expected);
    });
  });
});
