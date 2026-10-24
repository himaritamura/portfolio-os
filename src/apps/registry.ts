// Milestone 1 and 4: one entry per app. Lazy-load components so first paint stays small.
export type AppDef = {
  id: string;
  title: string;
  icon: string; // path under /public or an emoji while prototyping
};

export const apps: AppDef[] = [
  { id: "projects", title: "Projects", icon: "📁" },
  { id: "about", title: "About", icon: "📝" },
  { id: "terminal", title: "Terminal", icon: "💻" },
  { id: "resume", title: "Resume", icon: "📄" },
];
