// src/os/Window.tsx
import { useRef } from "react";
import type { CSSProperties, Dispatch, PointerEvent } from "react";
import type { Action, WindowState } from "./types";

const TASKBAR_HEIGHT = 48;

type Props = { win: WindowState; dispatch: Dispatch<Action> };

export default function Window({ win, dispatch }: Props) {
  // Where inside the window the pointer grabbed it. A ref, not state:
  // updating it shouldn't trigger a re-render.
  const grab = useRef<{ dx: number; dy: number } | null>(null);
  const resizing = useRef<{ startX: number; startW: number; startY: number; startH: number; } | null>(null);

  const style: CSSProperties = win.maximized
    ? { position: "absolute", inset: 0, bottom: TASKBAR_HEIGHT, zIndex: win.zIndex }
    : {
        position: "absolute",
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest("button")) return; // buttons stay buttons
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!grab.current) return;
    dispatch({
      type: "MOVE",
      id: win.id,
      x: e.clientX - grab.current.dx,
      y: e.clientY - grab.current.dy,
      bounds: { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT },
    });
  };

  const endDrag = () => {
    grab.current = null;
  };

  const onResizeDown = (e: PointerEvent<HTMLElement>) => {
    if (win.maximized) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    resizing.current = { startX: e.clientX, startW: win.width, startY: e.clientY, startH: win.height };
  };

  const onResizeMove = (e: PointerEvent<HTMLElement>) => {
    if (!resizing.current) return;

    dispatch({
      type: "RESIZE",
      id: win.id,
      width: resizing.current.startW + (e.clientX - resizing.current.startX),
      height: resizing.current.startH + (e.clientY - resizing.current.startY),
      bounds: { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT },
    });
  };

  const endResize = () => {
    resizing.current = null;
  };

  return (
    <section
      role="dialog"
      aria-label={win.appId}
      style={style}
      onPointerDown={() => dispatch({ type: "FOCUS", id: win.id })}
      className="flex flex-col overflow-hidden rounded-win bg-parchment"
    >
      <header
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => dispatch({ type: "MAXIMIZE", id: win.id })}
        className="flex touch-none select-none items-center gap-2 bg-clear p-2"
      >
        <button
          aria-label="Close"
          onClick={() => dispatch({ type: "CLOSE", id: win.id })}
          className="h-4 w-4 rounded-full border border-ink/30 bg-red"
        />
        <button
          aria-label="Minimize"
          onClick={() => dispatch({ type: "MINIMIZE", id: win.id })}
          className="h-4 w-4 rounded-full border border-ink/30 bg-butter"
        />
        <button
          aria-label="Maximize"
          onClick={() => dispatch({ type: "MAXIMIZE", id: win.id })}
          className="h-4 w-4 rounded-full border border-ink/30 bg-mint"
        />
        <span className="font-heading">{win.appId}</span>
      </header>

      <div className="flex-1 overflow-auto p-3">{/* app content goes here */}</div>
      
      { !win.maximized && (
        <div data-testid="resize-handle"
            onPointerDown={onResizeDown}
            onPointerMove={onResizeMove} 
            onPointerUp={endResize}
            onPointerCancel={endResize}
            className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize touch-none bg-bubblegum"
          />
      )}
      
    </section>
  );
}