const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  // Svelty escapes
  "{": "&#123;",
  "}": "&#125;",
  "`": "&#96;",
};

export function escapeHtml(html: string) {
  return html
    .replace(/[&<>"'{}`]/g, (chr) => htmlEscapes[chr as keyof typeof htmlEscapes])
    .replace(/\\([trn])/g, "&#92;$1");
}

/**
 * Escape HTML for safe use in Svelte templates.
 * Alias for escapeHtml that makes the intent clearer.
 */
export const escapeSvelte = escapeHtml;
