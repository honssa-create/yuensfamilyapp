# Yuen's Family App

Personal family meal and recipe app for the Yuen household. Track who lives in each flat, keep a shared dish library, plan meals, and browse a community kitchen (公海) of recipes other families have shared.

This repository is **only** that Expo app. It is not Nestiee and does not include any invoice or billing code.

## Migration

The app previously lived as draft work inside `honssa-create/invoicegenerator`, under the folder `my-family-app/`. This repo is a standalone copy of that app, placed at the repository root.

Source of this copy:

- Most complete draft: branch `cursor/community-feed-comments-18aa` ([invoicegenerator#8](https://github.com/honssa-create/invoicegenerator/pull/8)) — dishes, meal plan, flats and members, plus the Community 公海 feed and recipe comments.
- Earlier scaffold, for history only: branch `cursor/create-expo-app-my-family-app-18aa` ([invoicegenerator#4](https://github.com/honssa-create/invoicegenerator/pull/4)).

Those invoicegenerator branches and pull requests were left unchanged.

## What's in the app

- **Members** — family members grouped by flat (for example 10J and 20C).
- **Family Tree (族譜)** — names, ages, and short bios, with optional parent and spouse links. Any household member can add or edit a person.
- **祭祀 Ancestral worship** — records of offerings, guides, yearly dates, and addresses. Any household member can add or edit each one. Yearly dates use the Gregorian calendar; a note can hold the lunar date (農曆).
- **地點 Places** — a list of family places. Open one for its address, photos, and notes. Any household member can add or edit a place.
- **Dishes** — shared recipe library, including a hotpot set builder and optional YouTube title lookup.
- **Community (公海)** — public recipes with likes and comments.
- **Planner** — meal calendar, random picks, and a simple budget planner.

Data is local mock state in the app. No API keys or `.env` file are required. Do not commit `.env` files or real credentials.

## Run

Requires Node.js 20+ and npm.

```bash
npm install
npx expo start
```

From the Expo CLI you can open a development build, an Android emulator, an iOS simulator, or Expo Go. For the web:

```bash
npm run web
```

Other scripts: `npm run android`, `npm run ios`, and `npm run lint`.

Routes live in `src/app` (Expo Router). Shared screens and components are under `src/`.

## Web preview on Railway

This deploy is a **browser preview** of the same app. It is not the native app. Expo Go, iOS, and Android still run on a machine with `npx expo start`.

Data stays in the browser as local mock state. No API keys and no environment variables are required. Railway sets `PORT`; the server listens on `0.0.0.0` and that port (8080 if `PORT` is unset).

Build the static Expo web export:

```bash
npm install
npm run build:web
```

Start the preview server (serves the `dist/` export):

```bash
npm run start:web
```

`npm start` is still the local Expo dev server. The Railway container uses `node server.js` instead.

### Deploy

The repo root includes a `Dockerfile` and `railway.toml`. After this branch is on GitHub:

1. In Vanessa's Railway account, create a service from this GitHub repo (root directory, not a subfolder).
2. Railway detects the `Dockerfile`, runs `npm ci` and `npm run build:web`, then starts `node server.js`.
3. In the service networking settings, generate a public domain. That becomes the preview URL. This repo does not create the Railway project or the URL.

From a machine logged into the Railway CLI and linked to that project, `railway up` in the repo root deploys the same Dockerfile.

If the dashboard asks for commands anyway:

- Build: handled by the Dockerfile (`npm ci`, then `npm run build:web`)
- Start: `node server.js`
