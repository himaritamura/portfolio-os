import type { FSNode } from "./fs";

/**
 * Milestone 3. Run one line of input.
 * Returns the output lines and the (possibly new) cwd. Never throw on bad input:
 * unknown commands and bad paths print a friendly error.
 */
export function execute(
  root: FSNode,
  cwd: string[],
  input: string
): { output: string[]; cwd: string[] } {
  void root; void cwd; void input;
  throw new Error("TODO: execute");
}

/** Returns completions for the current partial input (commands first, then paths). */
export function autocomplete(root: FSNode, cwd: string[], partial: string): string[] {
  void root; void cwd; void partial;
  throw new Error("TODO: autocomplete");
}
