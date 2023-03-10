/**
 * Copy of internal utils not exported by `shiki`.
 *
 * [shiki/src/utils.ts](https://github.com/shikijs/shiki/blob/a585c9d6860334a6233ff1c035a42d023e016400/packages/shiki/src/types.ts#L203-L242)
 */

export function groupBy<TElement, TKey>(
  elements: TElement[],
  keyGetter: (element: TElement) => TKey
): Map<TKey, TElement[]> {
  const map = new Map<TKey, TElement[]>();
  for (const element of elements) {
    const key = keyGetter(element);
    if (map.has(key)) {
      const group = map.get(key);
      group?.push(element);
    } else {
      map.set(key, [element]);
    }
  }
  return map;
}

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
