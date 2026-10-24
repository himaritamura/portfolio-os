// src/os/Clock.tsx
import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // cleanup, or the timer leaks
  }, []);

  return (
    <time className="font-heading text-parchment tabular-nums" dateTime={now.toISOString()}>
      {pad(now.getHours())}
      <span style={{ opacity: now.getSeconds() % 2 === 0 ? 1 : 0 }}>:</span>
      {pad(now.getMinutes())}
    </time>
  );
}