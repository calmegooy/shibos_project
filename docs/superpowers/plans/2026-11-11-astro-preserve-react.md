# Astro Migration with React Preserved Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the current React/Vite Shiboss app to an Astro build entry while preserving the whole React tree and applying only restrained visual consistency fixes.

**Architecture:** Astro provides the document and build pipeline. The existing React `App` remains one client-hydrated island so `AdminProvider`, `OrderProvider`, and all current workflows stay in one tree. Express continues serving static output from `dist` and its `/healthz` endpoint.

**Tech Stack:** Astro, Astro React integration, React 19, TypeScript, Tailwind CSS 4, existing Express server.

**Spec:** `docs/superpowers/specs/2026-11-11-astro-preserve-react-design.md`

## Global Constraints

- Preserve existing customer and admin workflows and shared React Context behavior.
- No feature rewrite, multi-island split, URL-routing redesign, or state persistence addition.
- Keep Express static serving and `/healthz` unless a verified compatibility issue requires a focused change.
- Apply anti-slop changes as narrow polish; keep existing page structure/content.
- Validate compatibility before installing/upgrading framework dependencies.

## Review Focus

- Tailwind v4's Vite integration compatibility with Astro — confirm generated styles appear in the production output.
- Client hydration and provider placement — verify the app mounts once and both view modes render.
- Production output path and Express fallback — verify `/` and `/healthz` work against `dist`.
- Existing TypeScript path aliases and asset imports — ensure the Astro build resolves current imports.
- Migration visual scope — confirm no screen/order/feature is removed or reorganized.

---

### Task 1: Capture baseline and establish compatibility

**Files:**
- Read: `package.json`, `vite.config.ts`, `tsconfig.json`, `server.js`, `index.html`, `src/App.tsx`, `src/index.css`
- Modify: none

- [x] **Step 1: Record environment and dependency baseline**

Run `node --version`, `npm --version`, `npm ls --depth=0`, and `npm run lint`.

- [x] **Step 2: Run the current production build**

Run `npm run build`; record any pre-existing errors before migration.

- [x] **Step 3: Check available test scripts and preserve baseline findings**

Inspect `package.json` scripts and report whether automated interaction tests exist. Do not infer that lint/build exercises application behavior.

### Task 2: Add Astro while preserving the React root

**Files:**
- Create: `astro.config.mjs`
- Create: `src/pages/index.astro`
- Modify: `package.json`
- Modify: `tsconfig.json` only if required by Astro's generated types/config
- Modify: `index.html` only if Astro ownership makes it obsolete and removal is verified safe

- [x] **Step 1: Add framework configuration and entry**

Configure Astro with the React integration and retain the existing Tailwind v4 Vite plugin after compatibility confirmation. The Astro index page must render the existing `src/App.tsx` exactly once with client hydration; do not move providers or split components.

- [x] **Step 2: Replace Vite scripts with Astro equivalents**

Set `dev` to Astro dev on port 3000 and host `0.0.0.0`; set `build` to `astro build`; set `preview` to Astro preview. Keep `start` invoking the existing Express server. Preserve relevant `DISABLE_HMR` behavior if supported; otherwise document the limitation rather than silently dropping it.

- [x] **Step 3: Install only required Astro dependencies**

Add compatible `astro` and `@astrojs/react` dependencies; do not upgrade unrelated React/Tailwind packages. Generate the package lock using the project's package manager.

- [x] **Step 4: Run the Astro build and TypeScript check**

Run `npm run build` and `npm run lint`. Both must pass before proceeding; investigate any failures rather than masking them.

### Task 3: Preserve production server and developer documentation

**Files:**
- Modify: `server.js` only if verification demonstrates output/fallback incompatibility
- Modify: `README.md`
- Modify: `package.json` clean script and create `scripts/clean.mjs` if needed to ensure cleanup only removes generated files
- Test: `scripts/clean.test.mjs`

- [x] **Step 1: Verify generated output and Express contract**

Run the built app with `npm start`; request `/` and `/healthz`. Confirm the page loads, `/healthz` returns `200 OK`, and server still binds to `PORT` or default `3000` on `0.0.0.0`.

- [x] **Step 2: Make only evidence-driven server changes**

If Astro's output path differs, align `express.static` and fallback to the actual output. Keep `/healthz`. Do not replace Express with a different runtime in this migration.

- [x] **Step 3: Document local commands and architecture**

Update README with Astro dev/build/preview commands, Express start behavior, and the single hydrated React app boundary.

- [x] **Step 4: Verify cleanup preserves source files**

Run `npm test`. It must confirm generated `dist` and `.astro` directories are removed while `server.js` remains untouched.

### Task 4: Apply restrained anti-slop styling

**Files:**
- Modify: `src/index.css`
- Modify: only the smallest set of existing React component/style files needed for consistency, chosen after visual audit
- Reference: provided `DESIGN (12).md`, `tokens (6).json`, `variables (5).css`, `theme (5).css`

- [x] **Step 1: Audit current screens and styles against the agreed direction**

Record concrete inconsistencies (spacing, color, typography, surface/shadow, generic effects). Keep layout, feature order, and copy intact. Ignore unrelated issues.

- [x] **Step 2: Define valid, narrow CSS tokens**

Use cream/charcoal/Inter and valid spacing/radii; do not use invalid range values or the extracted `line-height: 0.67`. Preserve useful existing brand/status semantics where changing them would confuse order/payment meaning.

- [x] **Step 3: Make targeted polish edits**

Fix only audited inconsistencies; no new imagery, decorative assets, content, or animation. Use the lucide icon set already installed if an existing emoji/decorative icon genuinely needs replacement.

- [x] **Step 4: Verify styling and all critical interactions**

Run build and lint again. Headless Chrome smoke testing exercised admin-to-customer switching, menu, cart, checkout, payment simulation, order status, and return to admin. The source changes leave the underlying order handlers and providers unchanged. The screenshot is available at `C:\Users\ASUS\AppData\Local\Temp\opencode\shiboss-customer.png` for inspection.

#### Rulings

- Ruling: Raise the direct `esbuild` constraint from `^0.25.0` to `^0.28.2` — npm refused the existing dependency graph because Vite 8 requires `^0.27` or `^0.28`, and the project does not import esbuild directly — cost if wrong: future direct esbuild use must stay compatible with Vite 8.
- Ruling: Add root dev dependency `cookie@^2.0.2` — Astro's generated prerender bundle resolved Express's root `cookie@0.7.2`, which lacks Astro's named exports; pinning v2 at project root lets Express keep v0.7 nested — cost if wrong: the extra development dependency may be removable if Astro changes its prerender externalization.
- Ruling: Replace the existing clean command with a script that removes only `dist/` and `.astro/` — the old command also deleted the production `server.js` source and used a Unix-only `rm` command — cost if wrong: a caller expecting source deletion will no longer get it, intentionally.

### Task 5: Final verification and report

**Files:**
- Modify: none unless a verified issue is found

- [ ] **Step 1: Run production checks**

Run `npm run lint`, `npm run build`, then start the Express server and check `/` and `/healthz`.

- [ ] **Step 2: Report exact verification evidence**

List checks that passed/failed, any existing limitations, changed files, and confirm no unsupported claims about persistence or backend behavior.
