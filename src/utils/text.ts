const INLINE_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
// {visible text|tooltip content} — pipe separates the trigger from the popup.
// Both sides forbid braces so tooltips can't nest; the trigger also forbids
// a pipe so the split is unambiguous.
const TOOLTIP_RE = /\{([^|{}]+)\|([^{}]+)\}/g;

function parseInlineLinks(text: string): string {
  return text.replace(
    INLINE_LINK_RE,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}

function parseTooltips(text: string): string {
  return text.replace(
    TOOLTIP_RE,
    (_match, trigger: string, content: string) =>
      `<span class="tip" tabindex="0">${trigger.trim()}` +
      `<span class="tip-pop" role="tooltip">${content.trim()}</span></span>`
  );
}

// Links are resolved first so a markdown link may live inside tooltip content.
export function parseInline(text: string): string {
  return parseTooltips(parseInlineLinks(text));
}
