export type FSNode =
  | { type: "file"; name: string; content: string }
  | { type: "dir"; name: string; children: FSNode[] };

/**
 * Milestone 3. Pure function: no React, no DOM.
 * Resolve `path` (absolute, relative, "..", ".") against `cwd` (array of directory names
 * from root). Return the node, or null if it does not exist.
 * Think about: trailing slashes, ".." at root, and walking through a file.
 */
export function resolvePath(root: FSNode, cwd: string[], path: string): FSNode | null {
  void root; void cwd; void path;
  throw new Error("TODO: resolvePath");
}
