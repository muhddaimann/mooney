export const about = {
  brand: "Mooney",
  name: "Mooney",
  tagline: "Privacy-first personal finance toolkit.",
  description:
    "A lightweight, privacy-first personal finance app focused on Kutu tracking, money management, savings and shared expenses. Everything works locally without requiring an account.",
  version: "0.9.0",
  changelog: [
    {
      version: "0.9.0",
      date: "2026-07-02",
      changes: [
        "Kutu groups now have a planned member count set at creation, with cycles labeled by calendar month instead of round numbers",
        "Added a payout history view listing every completed cycle's month and recipient",
        "Added a sample-data action to load a fully-populated example kutu group",
        "\"Add member\" is hidden once a group reaches its planned member count",
        "Modal padding revised - less vertical space, more horizontal",
      ],
    },
    {
      version: "0.8.0",
      date: "2026-07-02",
      changes: [
        "Added a three-dot action menu shared across module screens, replacing individual header buttons",
        "Module index screens now offer Add / About / Clear all from one menu (About explains the module and how to use it)",
        "Kutu group screen's menu adds a member, records a contribution, or opens a new payout history view (previous cycles)",
        "Added a shared NoData component for empty states (no groups, no members, etc.)",
        "Back button icon made smaller, with more breathing room in the header",
      ],
    },
    {
      version: "0.7.0",
      date: "2026-07-02",
      changes: [
        "Added a shared Header component (back button, title/subtitle, right-side actions) used across every screen",
        "Back button redesigned as a chevron in a primary-colored circle, vertically centered with the title",
        "Reduced the app-wide type scale for a more compact, PWA-appropriate text size",
      ],
    },
    {
      version: "0.6.0",
      date: "2026-07-02",
      changes: [
        "Added the Kutu Tracker module: create groups, add members, and record contributions with an automatic payout rotation",
        "Removed the DropdownMenu component in favor of a shared PickerModal rendered through overlay.modal",
        "Removed the modal close icon - dismissable modals close by tapping outside; only the mandatory WhoAmI setup stays fully locked",
        "WhoAmI card no longer duplicates Edit/Sign out - those live in the profile menu now",
      ],
    },
    {
      version: "0.5.0",
      date: "2026-07-02",
      changes: [
        "Replaced the top-right theme toggle with a hamburger profile menu (manage profile, toggle theme, sign out)",
        "Dashboard now lists the four Finance modules with their goal and status",
        "WhoAmI form redesigned with its own intro copy instead of a modal title",
        "Fixed non-dismissable modals still showing a lingering empty title bar",
        "Consolidated the profile prompt-and-save flow into a shared useManageProfile hook",
        "Service worker no longer registers in development, and cleans up any stale registration from before this fix",
      ],
    },
    {
      version: "0.4.0",
      date: "2026-07-02",
      changes: [
        "Added a standalone icon-only theme toggle, decoupled from the WhoAmI setup form",
        "WhoAmI profile now stores a theme preference and restores it automatically on app open",
        "Loader overlay spinner/text color now adapts to light vs. dark mode",
        "Dashboard changelog section now shows only the latest release",
        "Removed the /main design-system route from in-app navigation - kept as a reference file only",
      ],
    },
    {
      version: "0.3.0",
      date: "2026-07-02",
      changes: [
        "Turned the home screen into a dashboard with a WhoAmI card and changelog section",
        "Added a mandatory WhoAmI setup gate that runs once per app open (useAuthGate), imitating authentication behind a loader",
        "Consolidated auth hooks (useAuth, useNewUser, useSignOut, useAuthGate) into a single hooks/useAuth.tsx alongside the pure-state authContext",
        "Fixed non-dismissable modals still being closable via the header's close icon",
        "Restyled the blocking loader overlay to use the onBackground token for its spinner and text instead of the primary accent color",
      ],
    },
    {
      version: "0.2.0",
      date: "2026-07-02",
      changes: [
        "Added local storage context (localContext) as the persistence layer for account-free features",
        "Added WhoAmI auth context storing a nickname and emoji avatar per local profile",
      ],
    },
    {
      version: "0.1.0",
      date: "2026-07-02",
      changes: [
        "Initial Mooney release",
        "Planned WhoAmI local profile using browser storage",
        "Planned Kutu Tracker for rotating savings groups",
        "Planned Money Tracker for income, expenses, and budgets",
        "Planned Bill Split for shared expenses",
        "Planned Savings Goals for personal financial targets",
      ],
    },
  ],
} as const;

export type ChangelogEntry = (typeof about.changelog)[number];