# portfolio-os

A cute pastel desktop OS in the browser. Also my portfolio.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (many start red on purpose)
npm run e2e        # first time: npx playwright install chromium
```

## Layout

- `src/os/` window manager, desktop, taskbar
- `src/apps/` terminal, projects, about, resume, games
- `src/terminal/` parser, commands, virtual file system
- `src/data/` `projects.json`, `fs.json`

## Design Decisions

TODO: your 2-3 biggest tradeoffs (why a reducer, how the parser works, etc.)
