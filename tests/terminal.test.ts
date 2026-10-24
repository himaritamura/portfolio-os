import { describe, expect, it } from "vitest";
import { parseInput } from "../src/terminal/parser";

describe("parseInput", () => {
  it("splits a command and args", () => {
    expect(parseInput("cd projects")).toEqual({ cmd: "cd", args: ["projects"] });
  });

  it("handles quoted arguments", () => {
    expect(parseInput('cat "my file.txt"')).toEqual({ cmd: "cat", args: ["my file.txt"] });
  });

  it("ignores extra whitespace", () => {
    expect(parseInput("  ls   ")).toEqual({ cmd: "ls", args: [] });
  });

  it.todo("resolvePath: '..', '.', absolute, nonexistent, trailing slash");
  it.todo("execute: every command, including error cases");
  it.todo("autocomplete: unique, ambiguous, none");
});
