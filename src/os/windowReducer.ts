import type { Action, WindowState } from "./types";
import { MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT, DEF_WIDTH, DEF_HEIGHT, TASKBAR_HEIGHT } from "./types";

const START_X = 10;
const START_Y = 10;
const OFFSET = 15;

const nextZ = (state: WindowState[]) =>
  state.reduce((max, w) => Math.max(max, w.zIndex), 0) + 1;

const nextWindowId = (state: WindowState[]) => {
  const maxId = state.reduce((max, w) => {
    const n = Number(w.id.replace(/^w/, ""));
    return Number.isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return `w${maxId + 1}`;
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), Math.max(lo, hi));

export function windowReducer(state: WindowState[], action: Action): WindowState[] {
  switch (action.type) {
    case "OPEN": {
      if (state.some((w) => w.appId === action.appId)) {
        return state.map((w) =>
          w.appId === action.appId
            ? { ...w, zIndex: nextZ(state), minimized: false }
            : w
        );
      }
      const newWindow: WindowState = {
        id: nextWindowId(state),
        appId: action.appId,
        x: START_X + state.length * OFFSET,
        y: START_Y + state.length * OFFSET,
        width: DEF_WIDTH,
        height: DEF_HEIGHT,
        zIndex: nextZ(state),
        minimized: false,
        maximized: false,
      };
      return [...state, newWindow];
    }
    case "CLOSE":
      return state.filter((w) => w.id !== action.id);
    case "FOCUS":
      return state.map((w) =>
        w.id === action.id ? { ...w, zIndex: nextZ(state), minimized: false } : w
      );
    case "MOVE": {
      const { bounds } = action;
      return state.map((w) =>
        w.id !== action.id || w.maximized
          ? w
          : {
              ...w,
              x: bounds ? clamp(action.x, 0, bounds.width - w.width) : action.x,
              y: bounds ? clamp(action.y, 0, bounds.height - w.height) : action.y,
            }
      );
    }
    case "RESIZE": {
      const { bounds } = action;
      return state.map((w) =>
        w.id !== action.id || w.maximized
          ? w
          : {
              ...w,
              width: clamp(action.width, MIN_WIDTH, bounds ? bounds.width - w.x : MAX_WIDTH),
              height: clamp(action.height, MIN_HEIGHT, bounds ? bounds.height - w.y : MAX_HEIGHT),  
            }
      );}
    case "MINIMIZE":
      return state.map((w) => (w.id === action.id ? { ...w, minimized: true } : w));
    case "MAXIMIZE":
      return state.map((w) =>
        w.id === action.id ? { ...w, maximized: !w.maximized, minimized: false } : w
      );
    default:
      return state;
  }
}