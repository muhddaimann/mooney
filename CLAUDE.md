# Mooney

Privacy-first personal finance PWA. Expo Router, web-only (`app.json` → `platforms: ["web"]`), no backend/account — everything persists to `localStorage` on-device.

## Module workflow

Every feature is tracked in `about.md` as: **Category → Module → Goal → Features → Progress**. Before building a module, check/update its entry there. Progress markers: 🟡 Planning → 🔵 In Progress → 🟢 Done.

## File layout per module

A module may use any of these layers — only create the ones it actually needs:

- `constants/` — static config/tokens (no logic)
- `contexts/` — **pure state only**. `createContext` + a `Provider` + a `use*` hook that just reads the context. No modals, loaders, toasts, or side effects here.
- `hooks/` — **all process/orchestration** for the module, in one consolidated file per module (e.g. `hooks/useAuth.tsx` exports `useAuth`, `useNewUser`, `useManageProfile`, `useSignOut`, `useAuthGate` — one file, several named hooks). This is where overlay calls (`modal`, `confirm`, `toast`), loaders, and multi-step flows live. Use `.tsx` when a hook renders JSX (e.g. passing a form component into `overlay.modal`); plain `.ts` otherwise.
- `components/<module>/` — presentational UI only, grouped in a subfolder per module (e.g. `components/auth/whoAmIForm.tsx`, `whoAmICard.tsx`, `profileMenu.tsx`). Components call hooks; they don't talk to contexts directly if a hook already wraps that logic.
- `components/shared/` — presentational UI reused across modules (not tied to one): `pickerModal.tsx`, `emojiPicker.tsx`, `header.tsx`, `actionMenu.tsx`, `moduleMenu.tsx`, `moduleAbout.tsx`, `noData.tsx`.
- `app/` — routes/screens (Expo Router), compose components + hooks.

**Keep each module's context+hook file count minimal.** Don't scatter the same orchestration logic (e.g. "open a form modal and save") across multiple hook files or duplicate it inline inside a component — put it once in the module's `hooks/use*.tsx` and have every caller use that.

## Every screen uses `components/shared/header.tsx`

Left slot is a back button (`showBack`, wired to `router.back()`, rendered as a `chevron-left` in a small primary-colored circle), center is `title`/`subtitle`, right slot (`right`) is free-form (an action button, `ProfileMenu`, `ModuleMenu`, etc.) — all vertically centered in the row. The root dashboard (`app/index.tsx`) omits `showBack` since there's nowhere to go back to; every other screen (module index, detail, sub-pages) sets it. Don't hand-roll a header row or a separate "Back to X" link/button elsewhere on the screen — the back button in the header covers that. See `app/kutu/index.tsx` and `app/kutu/[id].tsx` for the reference usage.

## Three-dot menus: `components/shared/actionMenu.tsx`, not buttons in the header

Any screen with more than one header-level action (add, edit, delete, view history, etc.) uses a `dots-vertical` icon in the header's `right` slot instead of a row of buttons. `actionMenu.tsx` is the generic primitive: give it `options: PickerOption[]` and an `onSelect`, and it wires up the icon + `overlay.modal` + `PickerModal` for you.

- **Module index screens that only need add/About/clear** use `moduleMenu.tsx`, a fixed wrapper around `ActionMenu` (`addLabel`/`onAdd`, `about: { title, goal, howTo }` rendering `moduleAbout.tsx`'s `ModuleAboutView`, `clearLabel`/`onClearAll` - the destructive clear is confirmed internally, callers don't need their own confirm). No screen currently uses it as-is (see below), but it's there for a module that genuinely only needs those three.
- **Screens with a different or larger set of actions** use `ActionMenu` directly with their own `PickerOption[]`, rather than stretching `ModuleMenu`'s fixed shape or going back to separate buttons. `app/kutu/index.tsx` started on `ModuleMenu` but outgrew it once "Load sample data" became a 4th action, so it now builds its own options list (add/seed/about/clear, with the same confirm-before-clear pattern inlined). `app/kutu/[id].tsx` (add member / record contribution / view history) never fit `ModuleMenu`'s shape to begin with. Both are the reference usages for `ActionMenu`.

## Empty states use `components/shared/noData.tsx`

Whenever a list can be empty (no groups, no members, no transactions...), render `<NoData icon title description />` instead of a plain `<Text>`. Pick an `icon` that matches the missing thing (e.g. `account-group-outline` for groups); it defaults to `inbox-outline` if omitted. See `app/kutu/index.tsx` and `app/kutu/[id].tsx`.

## Option-list menus: `overlay.modal` + `PickerModal`, not a bespoke dropdown

For any "pick one of these actions" menu (profile menu, context menus, etc.), use `overlay.modal` (default `variant: 'standard'`, centered) rendering `components/shared/pickerModal.tsx`, and route the result through `onSelect={close}`. There used to be a separately-positioned `DropdownMenu` component (measured/anchored under a trigger button, rendered in a `Portal`) - it was removed in favor of this, so all option menus go through the same overlay system as everything else. Don't reintroduce a bespoke anchored dropdown; see `components/auth/profileMenu.tsx` for the reference implementation.

## `app/main.tsx` is a reference file, not a screen

It's not registered as a route and there's no in-app link to it — it exists purely as a living reference for design-token usage and, more importantly, **every `useOverlay` pattern** (`alert`, `confirm`, `toast`, `showLoader`/`withLoader`, `modal` in all four variants, `openWindow`, `openPanel`). Read it before writing new overlay-driven flows instead of re-deriving the API from `contexts/overlayTypes.ts` alone — it shows real call shapes and common combinations (e.g. `modal` resolving into a `toast`). Update it if the overlay API itself changes, but don't wire it back into navigation.

## Changelog

`constants/about.ts` (`version` + `changelog`) and `about.md`'s progress markers are only bumped **when explicitly asked**. Don't bump automatically after routine changes.

## Verifying changes

No test suite or linter is configured. After any change:
```
npx tsc --noEmit
npx expo export --platform web   # then rm -rf dist — it's just a build check
```
If a dev server is already running (`expo start --web`), you can also sanity-check the compiled bundle directly (`curl` the entry bundle and grep for expected strings) when browser automation isn't available.

## PWA specifics (don't relitigate these)

- `public/index.html` is a hand-maintained override of Expo's default web template (Expo copies `public/` as-is and substitutes `%WEB_TITLE%`/`%LANG_ISO_CODE%`). It contains: manifest link, PWA meta tags, and a desktop-only "phone frame" preview (`#mooney-phone-frame` + fake status-bar/home-indicator) that collapses to real edge-to-edge on `max-width: 480px` or `display-mode: standalone`.
- `apple-mobile-web-app-status-bar-style` must be `"default"`, not `"black-translucent"` — translucent always applies a dark tint to the iOS status bar regardless of actual page background.
- `public/manifest.json`'s `theme_color`/`background_color` are **static** — read once at install/launch, can't track the in-app light/dark toggle. Keep them matching the app's default light mode.
- `app/_layout.tsx`'s `WebThemeSync` keeps `document.body` background and the live `<meta name="theme-color">` tag in sync with the active theme (plain DOM mutation, no `expo-router/head`). `useAuthGate` (in `hooks/useAuth.tsx`) restores the user's saved theme preference from their `WhoAmI` profile on app boot.
- `public/sw.js`: bump `CACHE_NAME` whenever changing cache strategy or fixing a caching bug — otherwise already-installed PWAs keep serving stale cached files (this bit us once with a stale `manifest.json`). Unfingerprinted files (`/`, `/manifest.json`) use network-first; fingerprinted JS/icons use cache-first.

## Conventions

- Path alias `@/*` → project root.
- No comments explaining *what* code does — only *why*, and only when non-obvious (a platform quirk, a deliberate trade-off, a workaround).
- File names are camelCase (`whoAmICard.tsx`, not `WhoAmICard.tsx`).
