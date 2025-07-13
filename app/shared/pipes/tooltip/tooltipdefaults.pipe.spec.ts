import { tooltipdefaults } from './tooltipdefaults';
import { TooltipDefaultPipe } from './tooltipdefaults.pipe';

describe('TooltipDefaultPipe', () => {
  let pipe: TooltipDefaultPipe;

  beforeEach(() => {
    pipe = new TooltipDefaultPipe();
  });

  it('transform position to after', () => {
    expect(pipe.transform('position')).toEqual(tooltipdefaults.position);
  });

  it('transform showDelay to 800', () => {
    expect(pipe.transform('showDelay')).toEqual(tooltipdefaults.showdelay);
  });

  it('transform hideDelay to 1000', () => {
    expect(pipe.transform('hideDelay')).toEqual(tooltipdefaults.hidedelay);
  });

  it('transform unknown to Error', () => {
    const p = () => {
      pipe.transform('unknown');
    };
    expect(p).toThrowError('Unexpected parameter unknown');
  });
});
