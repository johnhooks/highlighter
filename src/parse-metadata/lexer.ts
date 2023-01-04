type PairStart = "{" | "(" | '"' | "'" | "/";
type PairEnd = "}" | ")" | '"' | "'" | "/";

export type Token = {
  value: string;
  start: number;
  end: number;
  type: "identifier" | "literal" | "symbol";
};

type State = "identifier" | "literal" | null;

/**
 * Lexer for Markdown code fence meta data parsing.
 *
 * @internal
 */
export function lexer(input: string): readonly Token[] {
  const tokens: Token[] = [];

  let pos = 0;
  let pair: PairEnd | null = null;
  let start = 0;
  let state: State = null;
  let accumulator: string[] = [];

  loop: while (pos <= input.length) {
    const char = input[pos];

    if (state === "identifier") {
      if (isIdentifier(char)) {
        accumulator.push(char);
      } else {
        tokens.push({ type: "identifier", value: accumulator.join(""), start, end: pos });
        accumulator = [];
        state = null;
      }
    } else if (state === "literal") {
      if (isPairEnd(char, pair)) {
        if (accumulator.length > 0) {
          tokens.push({ type: "literal", value: accumulator.join(""), start, end: pos });
        }
        tokens.push({ type: "symbol", value: char, start: pos, end: pos + 1 });
        accumulator = [];
        state = null;
        // The closing symbol was just lexed, need to break out before `isPairStart`
        pos = pos + 1;
        continue loop;
      } else {
        // Safety to break out of literal if no more `input`
        if (char === undefined) {
          tokens.push({ type: "literal", value: accumulator.join(""), start, end: pos });
          break loop;
        } else {
          accumulator.push(char);
        }
      }
    }

    // Continue lexing `identifier` or `literal`
    if (state !== null) {
      pos = pos + 1;
      continue loop;
    }

    if (isPairStart(char)) {
      switch (char) {
        case "{":
          pair = "}";
          break;
        case "(":
          pair = ")";
          break;
        default:
          pair = char;
      }
      start = pos + 1;
      state = "literal";
      tokens.push({ type: "symbol", value: char, start: pos, end: pos + 1 });
    } else if (isSymbol(char)) {
      tokens.push({ type: "symbol", value: char, start: pos, end: pos + 1 });
    } else if (isIdentifier(char)) {
      start = pos;
      state = "identifier";
      accumulator = [char];
    }

    // Always advance.
    pos = pos + 1;
  }

  return tokens;
}

function isPairEnd(char: unknown, pairEnd: PairEnd | null): boolean {
  return typeof char === "string" && char === pairEnd;
}

function isPairStart(char: unknown): char is PairStart {
  return typeof char === "string" && /^[{("'/]/.test(char);
}

function isIdentifier(char: unknown): boolean {
  return typeof char === "string" && /^[A-Za-z]/.test(char);
}

function isSymbol(char: unknown): boolean {
  return typeof char === "string" && /^[=]/.test(char);
}
