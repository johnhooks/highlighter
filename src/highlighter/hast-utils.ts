/**
 * A super simple, probably naive hast implementation.
 *
 * {@link https://github.com/syntax-tree/hast-util-to-html/tree/fa187494263aa1087ba1c307abce72b2413e452e#tohtmltree-options | toHtml} escapes `&` and `<` and doesn't allow
 * control of HTML entities.
 */

import { html, find } from "property-information";

import { escapeHtml } from "./utils.js";

export type TProperty = string | string[] | boolean | undefined;
export type TProperties = Record<string, TProperty>;
export type TText = { type: "text"; value: string };
export type TElement = {
  type: "element";
  tagName: string;
  properties: TProperties;
  children: Array<TNode>;
};
export type TNode = TElement | TText;
export type TChild = TNode | string;
export type TChildren = TChild[];

/**
 * Render {@link TText} node.
 */
function renderText({ value }: TText): string {
  return escapeHtml(value);
}

/**
 * Render HTML attributes.
 */
function renderAttributes(attributes: TProperties): string {
  const result: string[] = [];

  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined || value === false) continue;

    const { attribute, booleanish, commaSeparated } = find(html, name);

    if (value === true) {
      if (booleanish || /^data-/.test(attribute)) {
        result.push(attribute);
      }
    } else if (Array.isArray(value)) {
      const seperator = commaSeparated ? "," : " ";
      result.push(`${attribute}="${value.join(seperator)}"`);
    } else {
      result.push(`${attribute}="${value}"`);
    }
  }

  if (result.length === 0) return "";

  // Add a space to separate from the tag.
  return result.join(" ");
}

function renderNode(node: TNode) {
  if (node.type === "text") {
    return renderText(node);
  } else {
    // This is pretty hacky, but it works for now.
    const newline = "dataLineNumber" in node.properties ? "\n" : "";
    const attributes = renderAttributes(node.properties);
    const children = node.children.map(renderNode).join("");
    const opening = node.tagName + (attributes.length > 1 ? " " + attributes : "");
    return `<${opening}>${children}</${node.tagName}>${newline}`;
  }
}

export function toHtml(node: TElement) {
  return renderNode(node);
}

export function h(tagName: string, properties: TProperties, children?: TChildren): TElement {
  const nodes: Array<TNode> = children
    ? children.map((child) => (typeof child === "string" ? { type: "text", value: child } : child))
    : [];

  return {
    type: "element",
    tagName,
    properties,
    children: nodes,
  };
}
