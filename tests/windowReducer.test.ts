import { describe, expect, it } from "vitest";
import { windowReducer } from "../src/os/windowReducer";
import { DEF_HEIGHT, DEF_WIDTH, MIN_HEIGHT, MIN_WIDTH } from "../src/os/types";
import type { WindowState } from "../src/os/types";

// --- helpers ---------------------------------------------------------------

/** Opens one window per appId, in order, starting from an empty desktop. */
const open = (...appIds: string[]) =>
  appIds.reduce<WindowState[]>(
    (s, appId) => windowReducer(s, { type: "OPEN", appId }),
    []
  );

const byApp = (s: WindowState[], appId: string) => s.find((w) => w.appId === appId)!;

/** Freezes state so any mutation inside the reducer throws. */
const frozen = (s: WindowState[]) => {
  s.forEach((w) => Object.freeze(w));
  return Object.freeze(s) as WindowState[];
};

const BOUNDS = { width: 1000, height: 800 };

// --- tests -----------------------------------------------------------------

describe("OPEN", () => {
  it("opens a window", () => {
    const next = windowReducer([], { type: "OPEN", appId: "about" });
    expect(next).toHaveLength(1);
    expect(next[0]?.appId).toBe("about");
  });

  it("starts visible, not maximized, at the default size", () => {
    const w = byApp(open("about"), "about");
    expect(w.minimized).toBe(false);
    expect(w.maximized).toBe(false);
    expect(w.width).toBe(DEF_WIDTH);
    expect(w.height).toBe(DEF_HEIGHT);
  });

  it("offsets each new window so they don't stack exactly", () => {
    const s = open("about", "terminal");
    const a = byApp(s, "about");
    const t = byApp(s, "terminal");
    expect(t.x).toBeGreaterThan(a.x);
    expect(t.y).toBeGreaterThan(a.y);
  });

  it("gives each window a unique id", () => {
    const ids = open("about", "terminal", "projects").map((w) => w.id);
    expect(new Set(ids).size).toBe(3);
  });

  it("keeps ids unique after closing a window and opening another", () => {
    let s = open("about", "terminal", "projects");
    s = windowReducer(s, { type: "CLOSE", id: byApp(s, "terminal").id });
    s = windowReducer(s, { type: "OPEN", appId: "resume" });
    const ids = s.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("focuses instead of duplicating an already-open app", () => {
    let s = open("about", "terminal");
    s = windowReducer(s, { type: "OPEN", appId: "about" });
    expect(s).toHaveLength(2);
    expect(byApp(s, "about").zIndex).toBeGreaterThan(byApp(s, "terminal").zIndex);
  });

  it("restores a minimized window when its app is opened again", () => {
    let s = open("about");
    s = windowReducer(s, { type: "MINIMIZE", id: byApp(s, "about").id });
    s = windowReducer(s, { type: "OPEN", appId: "about" });
    expect(byApp(s, "about").minimized).toBe(false);
  });
});

describe("CLOSE", () => {
  it("removes only the targeted window", () => {
    let s = open("about", "terminal");
    s = windowReducer(s, { type: "CLOSE", id: byApp(s, "about").id });
    expect(s).toHaveLength(1);
    expect(s[0]?.appId).toBe("terminal");
  });

  it("does nothing for an unknown id", () => {
    const s = open("about");
    expect(windowReducer(s, { type: "CLOSE", id: "nope" })).toEqual(s);
  });
});

describe("FOCUS", () => {
  it("raises the window above all others", () => {
    let s = open("about", "terminal", "projects");
    s = windowReducer(s, { type: "FOCUS", id: byApp(s, "about").id });
    const aboutZ = byApp(s, "about").zIndex;
    expect(aboutZ).toBeGreaterThan(byApp(s, "terminal").zIndex);
    expect(aboutZ).toBeGreaterThan(byApp(s, "projects").zIndex);
  });

  it("restores a minimized window", () => {
    let s = open("about");
    const id = byApp(s, "about").id;
    s = windowReducer(s, { type: "MINIMIZE", id });
    s = windowReducer(s, { type: "FOCUS", id });
    expect(byApp(s, "about").minimized).toBe(false);
  });

  it("does nothing visible for an unknown id", () => {
    const s = open("about");
    expect(windowReducer(s, { type: "FOCUS", id: "nope" })).toEqual(s);
  });
});

describe("MINIMIZE", () => {
  it("hides the window without changing its position or size", () => {
    let s = open("about");
    const before = byApp(s, "about");
    s = windowReducer(s, { type: "MINIMIZE", id: before.id });
    const after = byApp(s, "about");
    expect(after.minimized).toBe(true);
    expect({ x: after.x, y: after.y, w: after.width, h: after.height }).toEqual({
      x: before.x,
      y: before.y,
      w: before.width,
      h: before.height,
    });
  });

  it("only affects the targeted window", () => {
    let s = open("about", "terminal");
    s = windowReducer(s, { type: "MINIMIZE", id: byApp(s, "about").id });
    expect(byApp(s, "terminal").minimized).toBe(false);
  });
});

describe("MAXIMIZE", () => {
  it("toggles maximized on and off", () => {
    let s = open("about");
    const id = byApp(s, "about").id;
    s = windowReducer(s, { type: "MAXIMIZE", id });
    expect(byApp(s, "about").maximized).toBe(true);
    s = windowReducer(s, { type: "MAXIMIZE", id });
    expect(byApp(s, "about").maximized).toBe(false);
  });

  it("keeps the window's own position and size so restore works", () => {
    let s = open("about");
    const before = byApp(s, "about");
    s = windowReducer(s, { type: "MAXIMIZE", id: before.id });
    const after = byApp(s, "about");
    expect({ x: after.x, y: after.y, w: after.width, h: after.height }).toEqual({
      x: before.x,
      y: before.y,
      w: before.width,
      h: before.height,
    });
  });

  it("shows a minimized window when it is maximized", () => {
    let s = open("about");
    const id = byApp(s, "about").id;
    s = windowReducer(s, { type: "MINIMIZE", id });
    s = windowReducer(s, { type: "MAXIMIZE", id });
    expect(byApp(s, "about").minimized).toBe(false);
  });
});

describe("MOVE", () => {
  it("updates x and y", () => {
    let s = open("about");
    s = windowReducer(s, { type: "MOVE", id: byApp(s, "about").id, x: 200, y: 150 });
    expect(byApp(s, "about").x).toBe(200);
    expect(byApp(s, "about").y).toBe(150);
  });

  it("only moves the targeted window", () => {
    let s = open("about", "terminal");
    const before = byApp(s, "terminal");
    s = windowReducer(s, { type: "MOVE", id: byApp(s, "about").id, x: 5, y: 5 });
    expect(byApp(s, "terminal").x).toBe(before.x);
    expect(byApp(s, "terminal").y).toBe(before.y);
  });

  it("keeps a window inside the right and bottom edges", () => {
    let s = open("about");
    s = windowReducer(s, {
      type: "MOVE",
      id: byApp(s, "about").id,
      x: 5000,
      y: 5000,
      bounds: BOUNDS,
    });
    expect(byApp(s, "about").x).toBe(BOUNDS.width - DEF_WIDTH);
    expect(byApp(s, "about").y).toBe(BOUNDS.height - DEF_HEIGHT);
  });

  it("keeps a window inside the left and top edges", () => {
    let s = open("about");
    s = windowReducer(s, {
      type: "MOVE",
      id: byApp(s, "about").id,
      x: -300,
      y: -300,
      bounds: BOUNDS,
    });
    expect(byApp(s, "about").x).toBe(0);
    expect(byApp(s, "about").y).toBe(0);
  });

  it("ignores a maximized window", () => {
    let s = open("about");
    const id = byApp(s, "about").id;
    s = windowReducer(s, { type: "MAXIMIZE", id });
    const before = byApp(s, "about");
    s = windowReducer(s, { type: "MOVE", id, x: 500, y: 500 });
    expect(byApp(s, "about").x).toBe(before.x);
    expect(byApp(s, "about").y).toBe(before.y);
  });
});

describe("RESIZE", () => {
  it("grows a window", () => {
    let s = open("about");
    s = windowReducer(s, {
      type: "RESIZE",
      id: byApp(s, "about").id,
      width: 600,
      height: 450,
      bounds: BOUNDS,
    });
    expect(byApp(s, "about").width).toBe(600);
    expect(byApp(s, "about").height).toBe(450);
  });

  it("never shrinks below the minimum size", () => {
    let s = open("about");
    s = windowReducer(s, { type: "RESIZE", id: byApp(s, "about").id, width: 10, height: 10 });
    expect(byApp(s, "about").width).toBe(MIN_WIDTH);
    expect(byApp(s, "about").height).toBe(MIN_HEIGHT);
  });

  it("can't grow past the right or bottom edge of the screen", () => {
    let s = open("about");
    const win = byApp(s, "about");
    s = windowReducer(s, {
      type: "RESIZE",
      id: win.id,
      width: 5000,
      height: 5000,
      bounds: BOUNDS,
    });
    expect(byApp(s, "about").width).toBe(BOUNDS.width - win.x);
    expect(byApp(s, "about").height).toBe(BOUNDS.height - win.y);
  });

  it("falls back to the minimum when the window is too close to the edge", () => {
    let s = open("about");
    const id = byApp(s, "about").id;
    s = windowReducer(s, { type: "MOVE", id, x: 900, y: 700 }); // no bounds, so no clamp
    s = windowReducer(s, { type: "RESIZE", id, width: 5000, height: 5000, bounds: BOUNDS });
    expect(byApp(s, "about").width).toBe(MIN_WIDTH);
    expect(byApp(s, "about").height).toBe(MIN_HEIGHT);
  });

  it("ignores a maximized window", () => {
    let s = open("about");
    const id = byApp(s, "about").id;
    s = windowReducer(s, { type: "MAXIMIZE", id });
    s = windowReducer(s, { type: "RESIZE", id, width: 700, height: 500, bounds: BOUNDS });
    expect(byApp(s, "about").width).toBe(DEF_WIDTH);
    expect(byApp(s, "about").height).toBe(DEF_HEIGHT);
  });
});

describe("purity", () => {
  it("never mutates the state it is given", () => {
    const s = frozen(open("about", "terminal"));
    const id = byApp(s, "about").id;
    // Any mutation of a frozen object throws, so these just need to not throw.
    expect(() => {
      windowReducer(s, { type: "OPEN", appId: "projects" });
      windowReducer(s, { type: "FOCUS", id });
      windowReducer(s, { type: "MOVE", id, x: 10, y: 10, bounds: BOUNDS });
      windowReducer(s, { type: "RESIZE", id, width: 300, height: 300, bounds: BOUNDS });
      windowReducer(s, { type: "MINIMIZE", id });
      windowReducer(s, { type: "MAXIMIZE", id });
      windowReducer(s, { type: "CLOSE", id });
    }).not.toThrow();
  });
});