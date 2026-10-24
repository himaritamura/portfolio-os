import { lazy, type ComponentType } from "react";
// Milestone 1 and 4: one entry per app. Lazy-load components so first paint stays small.
export type AppDef = {
  id: string;
  title: string;
  icon: string; // path under /public or an emoji while prototyping
  component: ComponentType;
};

export const apps: AppDef[] = [
  { id: "projects", title: "Projects", icon: "📁", component: lazy(() => import("./Projects"))},
  { id: "about", title: "About", icon: "📝", component: lazy(() => import("./About")) },
  { id: "terminal", title: "Terminal", icon: "💻", component: lazy(() => import("./Terminal")) },
  { id: "resume", title: "Resume", icon: "📄", component: lazy(() => import("./Resume")) },
];
