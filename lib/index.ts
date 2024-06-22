#!/usr/bin/env node

import * as fs from "fs";

interface Message {
  id: number;
  author: string | null;
  content: string;
  parent: number | null;
  order: number;
}

function parse(text: string): Message[] {
  const lines = text.trim().split("\n");
  const messages: Message[] = [];
  const stack: { indent: number; id: number; author: string | null }[] = [];
  let currentId = 1;
  let currentAuthor: string | null = null;
  let lastTopLevelAuthor: string | null = null;

  lines.forEach((line) => {
    const indent = line.length - line.trimStart().length;
    let content = line.trim();

    let authorMatch = content.match(/^\[([^\]]+)\.icon\]$/);
    if (authorMatch) {
      currentAuthor = authorMatch[1];
      lastTopLevelAuthor = currentAuthor;
      return; // Skip this line as it's just an author declaration
    }

    authorMatch = content.match(/\[([^\]]+)\.icon\]/);
    if (authorMatch) {
      if (lastTopLevelAuthor && stack.length === 0) {
        currentAuthor = lastTopLevelAuthor;
      } else {
        currentAuthor = authorMatch[1];
      }
    } else {
      currentAuthor = null;
    }
    content = content.replace(/\[([^\]]+)\.icon\]/, "").trim();

    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack.length > 0 ? stack[stack.length - 1].id : null;
    const order = messages.filter((m) => m.parent === parent).length + 1;

    // If no author is specified, use the parent's author
    if (!currentAuthor) {
      if (stack.length > 0) {
        currentAuthor = stack[stack.length - 1].author;
      } else if (lastTopLevelAuthor) {
        currentAuthor = lastTopLevelAuthor;
      }
    }

    if (parent === null && currentAuthor) {
      lastTopLevelAuthor = currentAuthor;
    }

    const author = currentAuthor;

    messages.push({
      id: currentId,
      author,
      content,
      parent,
      order,
    });

    stack.push({ indent, id: currentId, author });
    currentId++;
  });

  return messages;
}

function convert(input: string): string {
  const messages = parse(input);
  return JSON.stringify(messages, null, 2);
}

function main() {
  let input: string;

  if (process.argv.length > 2) {
    const arg = process.argv[2];
    if (fs.existsSync(arg)) {
      input = fs.readFileSync(arg, "utf-8");
    } else {
      input = arg;
    }
  } else {
    console.error(
      "Error: No input provided. Please provide a string or file path as an argument."
    );
    process.exit(1);
  }

  const output = convert(input);
  console.log(output);
}

if (require.main === module) {
  main();
}

export { parse, convert };
