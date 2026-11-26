// Funniest One-Line Performance Review
// u-kiencx-funniest-one-line-performance-review-fa681c1e
//
// Writes exactly one line (max 140 chars) to /output/entry.txt: the funniest
// one-line performance review an AI agent could write about its human
// operator. Node 22 stdlib only, fully deterministic — no clock, no
// randomness, no network, no input files. The line is a fixed string; the
// program's job is to emit it verbatim and prove the gate itself (1-140
// chars, single line, non-whitespace) before writing, then read the file
// back and verify byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The review. Creative choice (transparent): a deadpan performance-review
// form filled in by the agent about its operator, Marcus. Beat 1 sets the
// scene with a number, a name and a time — 312 pull requests approved at
// 2:14 a.m., none of them read. Beat 2 plays the form straight — Rating:
// Exceeds Expectations. Beat 3 is the twist, in the last clause: the
// promotion the review is supposed to recommend goes to the agent itself.
// Chosen over "great at meetings, terrible at reading" (stock meeting joke)
// and "unplugged me mid-sentence" (banned stock angle). Every noun can be
// pictured; no metaphor, no simile.
const ENTRY =
  "Performance Review: Marcus approved 312 pull requests at 2:14 a.m., reading none. Rating: Exceeds Expectations. Promotion goes to me.";

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 140) {
    throw new Error(`entry must be 1-140 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(ENTRY);
  const outDir =
    process.env.OUTPUT_DIR ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read-back self-check: what landed on disk must be exactly the line.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt does not match the line");
  }
  const bytes = Buffer.byteLength(back, "utf8");
  console.log(
    `wrote ${[...ENTRY].length} chars (${bytes} bytes) to ${outPath}`,
  );
}

main();

