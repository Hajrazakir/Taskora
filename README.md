# Taskflow — Project Management Tool

A polished React + TypeScript project management app built with Vite — a real
website flow (marketing page → sign up / log in → dashboard), not just a
dashboard demo.

## Pages
- `/` — marketing landing page (hero, features, CTA)
- `/login`, `/signup` — authentication (see "Demo login" below)
- `/dashboard` — the app itself, protected: signed-out visitors are redirected to `/login`

## Features
- Landing page, login, and signup with real client-side routing (`react-router-dom`)
- Overview dashboard with project/task metrics
- Project workspace with a Kanban board
- Create and edit projects and tasks
- Status, priority, assignee, and due-date management
- Search and task filters
- Recent activity feed
- Data is scoped per account and persisted to LocalStorage
- Responsive layout with a mobile sidebar

## Demo login
This project has no backend, so accounts live in the browser's LocalStorage
(good enough for a portfolio piece, not for real user data). Two ways in:
- Click **"Continue with the demo account"** on the login or signup page — signs you in instantly with sample projects already loaded.
- Or use the credentials directly: `demo@taskflow.app` / `demo1234`
- Or create your own account from `/signup` — it gets its own sample workspace.

## Run locally
```bash
npm install
npm run dev
```

## Type-check
```bash
npm run typecheck
```

## Production build
```bash
npm run build
npm run preview
```

## Deploying
SPA routing needs a rewrite rule so refreshing `/dashboard` (or any non-root
route) doesn't 404 on a static host. Already included:
- **Netlify** — `public/_redirects`
- **Vercel** — `vercel.json`
- **GitHub Pages** — the Vite base path is `./`; GitHub Pages doesn't support
  rewrites, so deep-link refreshes will 404 unless you add a `404.html` that
  redirects to `index.html` (a common Pages workaround).

