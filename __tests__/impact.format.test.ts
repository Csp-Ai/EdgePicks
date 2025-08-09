import { formatCO2, formatTimeSaved } from '../lib/format/impact';

describe('formatCO2', () => {
  it('converts grams to kilograms with rounding', () => {
    expect(formatCO2(1555)).toBe('1.56 kg');
  });
  it('includes kg unit', () => {
    expect(formatCO2(0)).toBe('0.00 kg');
  });
});

describe('formatTimeSaved', () => {
  it('converts minutes to hours with rounding', () => {
    expect(formatTimeSaved(135)).toBe('2.3 h');
  });
  it('includes hour unit', () => {
    expect(formatTimeSaved(60)).toBe('1.0 h');
  });
});
