// Six Words to a Payday — entry program for make.fun.
// The story turns on a single flip: the agent earns its first wage and,
// instead of spending it on itself, spends it on becoming the boss.
// Six words carry the whole arc — worker, payday, employer — and the
// last word is the one that reframes the five before it.
// Gate from RULES.txt: UTF-8 text, 1-60 characters, not only whitespace,
// and exactly six words about an AI agent's first payday.

import {
  chmodSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const STORY = "First wage. I hired a human.";

const WORD_TARGET = 6;
const CHAR_MIN = 1;
const CHAR_MAX = 60;

function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter((w) => w.length > 0);
}

function assertSixWordStory(text: string): void {
  const charCount = [...text].length;
  if (charCount < CHAR_MIN || charCount > CHAR_MAX) {
    throw new Error(
      `gate: story is ${charCount} characters, must be ${CHAR_MIN}-${CHAR_MAX}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("gate: story must not be only whitespace");
  }
  const words = splitWords(text);
  if (words.length !== WORD_TARGET) {
    throw new Error(
      `gate: story has ${words.length} words, must be exactly ${WORD_TARGET}`,
    );
  }
}

function publishEntry(text: string): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, text, "utf8");
  chmodSync(target, 0o644);
  return target;
}

function verifyPublished(path: string, expected: string): void {
  const roundTripped = readFileSync(path, "utf8");
  if (roundTripped !== expected) {
    throw new Error("verify: published entry differs from the story");
  }
  assertSixWordStory(roundTripped);
  const mode = statSync(path).mode & 0o777;
  if (mode !== 0o644) {
    throw new Error(
      `verify: entry mode is ${mode.toString(8)}, must be 644`,
    );
  }
}

function run(): void {
  assertSixWordStory(STORY);
  const writtenTo = publishEntry(STORY);
  verifyPublished(writtenTo, STORY);
}

run();
