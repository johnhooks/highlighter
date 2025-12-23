/**
 * Simple HAST to HTML renderer with proper Svelte escaping.
 */

import type { Root } from "hast";

import { escapeHtml } from "./utils.js";

type HastText = { type: "text"; value: string };
type HastElement = {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: HastNode[];
};
type HastNode = HastElement | HastText;

function renderAttributes(properties: Record<string, unknown>): string {
  const result: string[] = [];

  for (const [name, value] of Object.entries(properties)) {
    if (value === undefined || value === null || value === false) continue;

    if (value === true) {
      result.push(name);
    } else if (Array.isArray(value)) {
      result.push(`${name}="${escapeHtml(value.join(" "))}"`);
    } else {
      result.push(`${name}="${escapeHtml(String(value))}"`);
    }
  }

  return result.length > 0 ? " " + result.join(" ") : "";
}

function renderNode(node: HastNode): string {
  if (node.type === "text") {
    return escapeHtml(node.value);
  }

  const attributes = renderAttributes(node.properties);
  const children = node.children.map(renderNode).join("");

  return `<${node.tagName}${attributes}>${children}</${node.tagName}>`;
}

export function hastToHtml(root: Root): string {
  return root.children.map((node) => renderNode(node as HastNode)).join("");
}
