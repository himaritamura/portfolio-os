// src/os/Taskbar.tsx
import type { Dispatch } from "react";
import { apps } from "../apps/registry";
import Clock from "./Clock";
import { TASKBAR_HEIGHT } from "./types";
import type { Action, WindowState } from "./types";

type Props = { windows: WindowState[]; dispatch: Dispatch<Action> };

export default function Taskbar({ windows, dispatch }: Props) {
  const topZ = Math.max(0, ...windows.map((w) => w.zIndex));

  return (
    <nav
      style={{ height: TASKBAR_HEIGHT, zIndex: 100000 }}
      className="fixed inset-x-0 bottom-0 flex items-center gap-2 bg-milk/80 px-3 backdrop-blur"
    >
      {/* Launchers: one per app */}
      {apps.map((app) => (
        <button
          key={app.id}
          aria-label={`Open ${app.title}`}
          onClick={() => dispatch({ type: "OPEN", appId: app.id })}
          className="text-xl"
        >
          {app.icon}
        </button>
      ))}

      <span className="mx-1 h-6 w-px bg-ink/20" />

      {/* Running windows */}
      {windows.map((w) => {
        const focused = !w.minimized && w.zIndex === topZ;
        return (
          <button
            key={w.id}
            onClick={() =>
              dispatch(focused ? { type: "MINIMIZE", id: w.id } : { type: "FOCUS", id: w.id })
            }
            className={`rounded-win px-3 py-1 font-pixel text-sm ${
              focused ? "bg-bubblegum" : w.minimized ? "bg-ink/10 opacity-60" : "bg-mint"
            }`}
          >
            {w.appId}
          </button>
        );
      })}

      <div className="ml-auto"><Clock /></div>
    </nav>
  );
}