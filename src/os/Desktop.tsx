import { useEffect, useReducer } from "react";
import { windowReducer } from "./windowReducer";
// import { apps } from "../apps/registry"
import Window from "./Window"
import Taskbar from "./Taskbar"
import { TASKBAR_HEIGHT } from "./types"

export default function Desktop() {
  const [windows, dispatch] = useReducer(windowReducer, []);

  useEffect(() => {
    const fit = () => {
      dispatch({
        type: "FIT",
        bounds: { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT },
      });
    };

    fit(); // run once on load, in case the site opens in a small window

    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit); // cleanup
  }, []);
  

  return (
  <main className="relative h-full w-full bg-white">
    <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 select-none whitespace-pre-wrap text-center font-name font-bold text-6xl text-ink tracking-[0.25em]">
      HIMARI&#10;TAMURA
    </h1>

    {windows
      .filter((w) => !w.minimized)
      .map((w) => (
        <Window key={w.id} win={w} dispatch={dispatch} />
    ))}

    <Taskbar windows={windows} dispatch={dispatch} />
  </main>
);
}
