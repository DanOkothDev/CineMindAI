# CineMindAI Studio — Frontend

React (Vite) frontend for CineMindAI, built from the architecture doc. It talks to
your Flask backend over the REST endpoints listed in that doc — there is no mock
data anywhere; every page renders real loading, empty, and error states.

## Setup

```bash
npm install
cp .env.example .env   # adjust if your backend isn't on http://localhost:5000
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api/*` requests to
your Flask backend (default `http://localhost:5000`) — see `vite.config.js`.
This avoids CORS headaches in development. If you deploy the built frontend
separately from the backend, set `VITE_API_BASE_URL` in `.env` to the
backend's full origin instead.

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## What's where

This follows the folder structure from the architecture doc exactly, with two
small additions: `components/StatusMessage.jsx` (shared empty/error state UI)
and a few helper functions in `services/projectService.js` (file downloads,
formatting). Everything else maps 1:1 to the doc.

- `src/api/api.js` — the axios instance (baseURL + error normalization)
- `src/api/projectApi.js` — one function per endpoint in the doc
- `src/context/ProjectContext.jsx` + `src/hooks/useProject.js` — shared state
- `src/services/projectService.js` — pure helpers (downloads, formatting)
- `src/components/` — Navbar, Sidebar, the five card types, loading/empty/error UI
- `src/layouts/DashboardLayout.jsx` — persistent top nav shell
- `src/pages/` — Home, Dashboard, CreateProject, Workspace + its six modules

## One thing to double-check: response field names

The architecture doc specifies endpoints and what each one returns in
*concept* ("the complete movie package — story, characters, scenes,
dialogues, and visual prompts"), but not the exact JSON key names your Flask
routes use. I picked the most likely shape and made the UI defensive about
naming, for example:

```js
character.emotionalArc || character.emotional_arc
scene.heading || scene.title
dialogue.character || dialogue.speaker
```

If your backend's actual responses use different keys, the fastest fix is
usually a one-line edit inside the matching `pages/*.jsx` or `components/*.jsx`
file — the API call shapes in `projectApi.js` already match the doc exactly,
so you likely won't need to touch those.

Assumed (and easy to change) request payload for `POST /api/project/generate-full`,
sent from `CreateProject.jsx`:

```json
{
  "idea": "string",
  "genre": "string",
  "duration": 90,
  "targetAudience": "string",
  "artStyle": "string",
  "aiModel": "balanced"
}
```

## Design

Dark "screening room" palette (warm charcoal + projector amber + tally-light
crimson), paired with a serif display face (Fraunces) and screenplay-style
slug-line labels throughout — e.g. scene cards read like real slug lines
(`SCENE 04 · NIGHT`), and the home page's pipeline section is a genuine
numbered sequence (Story → Characters → Scenes → Dialogue → Visual Prompts →
Export), not a decorative 01/02/03.
