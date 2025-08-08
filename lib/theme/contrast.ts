export type TokenMap = Record<string, string>;

/**
 * Resolves a token to a hex color value. If the token isn't found, the input is
 * assumed to be a color value already.
 */
function resolveColor(token: string, tokens: TokenMap): string {
  return tokens[token] || token;
}

function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(
  foreground: string,
  background: string,
  tokens: TokenMap = {}
): number {
  const fg = resolveColor(foreground, tokens);
  const bg = resolveColor(background, tokens);
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsAA(
  foreground: string,
  background: string,
  tokens: TokenMap = {},
  opts: { largeText?: boolean } = {}
): boolean {
  const ratio = contrastRatio(foreground, background, tokens);
  return ratio >= (opts.largeText ? 3 : 4.5);
}
