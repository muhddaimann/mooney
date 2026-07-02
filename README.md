# Mooney

Privacy-first personal finance PWA. Everything runs locally in the browser — no account, no backend, no data leaving the device.

## What it does

- **WhoAmI** — a lightweight local profile (nickname + emoji avatar), gating the app on first open.
- **Kutu Tracker** — manage rotating savings groups (kutu/arisan): create a group, add members, record each round's contribution, and track the payout rotation by calendar month.
- More finance modules (Money Tracker, Bill Split, Savings Goals) are planned — see `about.md`.

## Stack

Expo Router (web-only target), React Native Web, React Native Paper (Material Design 3), TypeScript. Installable as a PWA (manifest + service worker under `public/`).

## Getting started

```bash
npm install
npm run web
```

## Project docs

- `about.md` — feature roadmap (Category → Module → Goal → Features → Progress).
- `CLAUDE.md` — architecture conventions for this codebase (file layout per module, shared UI patterns, PWA specifics).
