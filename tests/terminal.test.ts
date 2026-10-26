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

  it("collapses runs of spaces between arguments", () => {
    expect(parseInput("cd    projects")).toEqual({ cmd: "cd", args: ["projects"] });
  });

  it("returns an empty command for empty input", () => {
    expect(parseInput("")).toEqual({ cmd: "", args: [] });
    expect(parseInput("   ")).toEqual({ cmd: "", args: [] });
  });

  it("treats an unterminated quote as one argument", () => {
    expect(parseInput('cat "oops')).toEqual({ cmd: "cat", args: ["oops"] });
  });

  it("keeps spaces inside quotes", () => {
    expect(parseInput('cat "a  b"')).toEqual({ cmd: "cat", args: ["a  b"] });
  });

  it("handles multiple quoted arguments", () => {
    expect(parseInput('cp "a b" "c d"')).toEqual({ cmd: "cp", args: ["a b", "c d"] });
  });

  

  

  // it.todo("resolvePath: '..', '.', absolute, nonexistent, trailing slash");
  // it.todo("execute: every command, including error cases");
  // it.todo("autocomplete: unique, ambiguous, none");
});
