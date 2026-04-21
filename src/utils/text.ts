const INLINE_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function parseInlineLinks(text: string): string {
  return text.replace(
    INLINE_LINK_RE,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}
