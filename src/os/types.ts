export type WindowState = {
  id: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
};

export type Action =
  | { type: "OPEN"; appId: string }
  | { type: "CLOSE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "MOVE"; id: string; x: number; y: number; bounds?: { width: number; height: number } }
  | { type: "RESIZE"; id: string; width: number; height: number;  bounds?: { width: number; height: number } }
  | { type: "MINIMIZE"; id: string }
  | { type: "MAXIMIZE"; id: string }
  | { type: "FIT"; bounds: { width: number; height: number } };

export const MIN_WIDTH = 240;
export const MIN_HEIGHT = 160;

export const MAX_WIDTH = 720;
export const MAX_HEIGHT = 400;

export const DEF_WIDTH = 480;
export const DEF_HEIGHT = 320;

export const TASKBAR_HEIGHT = 48;