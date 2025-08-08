export const nativeShare = async (
  url: string,
  title?: string,
): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ url, title });
      return true;
    } catch {
      // fall through to clipboard
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore copy failures
    }
  }

  return false;
};

export default nativeShare;
