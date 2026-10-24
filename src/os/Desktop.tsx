import { useReducer } from "react";
import { windowReducer } from "./windowReducer";
// import { apps } from "../apps/registry"
import Window from "./Window"
import Taskbar from "./Taskbar"

export default function Desktop() {
  const [windows, dispatch] = useReducer(windowReducer, []);

  return (
  <main className="relative h-full w-full bg-lilac">

    {windows
      .filter((w) => !w.minimized)
      .map((w) => (
        <Window key={w.id} win={w} dispatch={dispatch} />
    ))}

    <Taskbar windows={windows} dispatch={dispatch} />
  </main>
);
}
