List System

A polished React + TypeScript App application built as a front-end developer assignment.

---

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

> **Note:** The app uses MSW (Mock Service Worker) as the API layer. On first load, the browser will register a service worker — this is expected and takes only a second.

---

## Tech Stack

| Tool | Reason |
|---|---|
| **Vite** | Fastest dev experience; instant HMR, minimal config vs CRA |
| **React 18 + TypeScript** | Functional components throughout; TS for type safety and IDE support |
| **React Context API + useReducer** | Lightweight state management without external dependencies; predictable reducer pattern mirrors Redux without the boilerplate |
| **MSW (Mock Service Worker)** | Intercepts real `fetch` calls at the network level, no need to mock module internals; realistic async behavior with artificial delays |
| **DM Serif Display + DM Sans** | Pairs a refined serif display font with a clean grotesque body font; distinctive without being noisy |

---


### State Management

The `AppContext` follows a **reducer + context** pattern:

- A typed `Action` union makes state transitions explicit and traceable
- Async operations (`addApp`, `updateApp`, etc.) live on the context value as `useCallback`-memoised functions, preventing unnecessary child re-renders
- Derived state (`filteredApps`, `stats`) is computed with `useMemo` — no redundant copies in state

### API Layer

`AppApi.ts` is a pure abstraction over `fetch`. Components and the context never call `fetch` directly — this means swapping MSW for a real backend requires changes in exactly one file.

### Mock API

MSW intercepts `/api/Apps` requests using a **browser service worker**. An in-memory array acts as the database (reset on page reload). Artificial `delay()` calls simulate realistic network latency so loading states are visible.

---

## Features

- **Full CRUD** — create, read, update, delete Apps
- **Toggle completion** — optimistic UI feel with inline spinner
- **Priority system** — High / Medium / Low with colour-coded badges
- **Filtering** — All / Active / Done tabs
- **Search** — real-time title + description search
- **Sorting** — by newest, priority, or A–Z
- **Progress bar** — live completion percentage
- **Loading skeletons** — shimmer placeholders during fetch
- **Error display** — inline dismissable error card
- **Empty states** — contextual messages for no tasks vs filtered-out results
- **Accessible** — ARIA roles, labels, keyboard navigation, `role="dialog"` on modal
- **Responsive** — mobile-friendly layout

---

## Extra Ideas Added

1. **Priority picker in the form** — segmented button control rather than a plain `<select>`; more tactile
2. **Relative timestamps** — "2h ago" instead of a raw ISO date
3. **Animated logo** — subtle rotating star mark that reinforces the brand without being distracting
4. **Hover-reveal action buttons** — edit/delete only appear on hover, keeping the list clean on desktop (always visible on mobile via media query)
5. **Descriptions on Apps** — optional detail field for richer task context, clamped to 2 lines in the list

---

## Available Scripts

npm run dev     
npm run build    
npm run preview   
npm run lint      
```
