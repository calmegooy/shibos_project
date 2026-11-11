# Astro Migration with React Behavior Preserved

## Intent

Move the Shiboss project from a Vite React entry point to Astro without redesigning the product or rewriting its customer and admin workflows. The goal is a safe framework migration with a restrained anti-slop visual polish based on the supplied design reference.

## Goals

- Build and serve the frontend through Astro.
- Keep the existing React application, Context providers, screens, and interaction logic intact in the first migration stage.
- Preserve the existing Express server, `/healthz` endpoint, port behavior, and static `dist` serving unless verification proves a necessary compatibility change.
- Keep cleanup commands limited to generated output; never delete production source files.
- Apply only targeted visual consistency fixes using the supplied cream/charcoal/Inter palette and restrained accents; preserve screen structure and content.
- Verify build/type checks and the customer/admin critical flows.

## Non-goals

- Rewrite application screens as Astro components or vanilla JavaScript.
- Split the existing shared React state into multiple independently hydrated islands.
- Add URL-based workflow routing, persistence, backend functionality, or new features.
- Redesign page layouts, reorder content, or change product copy/features beyond correcting obvious visual inconsistency.
- Claim that Astro alone fixes runtime errors or persists state across refreshes.

## Approaches

1. **Astro shell with the complete React app as one client-hydrated island (selected).** Keep one React tree and its shared Context; Astro owns the document/build entry. This minimizes behavior changes and is the safest initial migration, though most application JavaScript remains client-side.
2. **Astro pages with several React islands.** This uses Astro's rendering model more deeply but requires redesigning shared state boundaries and navigation, increasing migration risk.
3. **Rewrite all interactions in Astro/vanilla JavaScript.** Rejected because it would duplicate or replace order, payment, and admin logic with a much larger regression surface.

## Architecture and constraints

- Add Astro and its React integration, retaining React 19 and existing components.
- Require Node.js `>=22.23.4` for the selected Astro 7 toolchain.
- Create an Astro page that renders the existing `App` with client hydration; do not duplicate the React root or mount a second provider tree.
- Preserve Tailwind CSS v4 integration and verify its Astro/Vite plugin compatibility before changing configuration.
- Keep `esbuild` aligned with Vite 8's peer range (`^0.27` or `^0.28`). Astro's prerender output also needs root-resolvable `cookie@2`; Express 4 keeps its compatible nested `cookie@0.7`.
- Retain the current Express production entry and ensure its static directory still matches Astro's generated output (`dist`). Keep `/healthz` reachable.
- Cleanup removes generated `dist/` and `.astro/` only; it must preserve `server.js` and other source files.
- Keep the current in-memory semantics: refreshing may reset demo state, as it can today. Do not imply URL navigation or durable order storage is included.
- Use the provided tokens selectively. Do not directly use invalid/unsafe extracted values such as `80-120px` as a CSS value or `line-height: 0.67`; translate them to valid context-appropriate rules.

## Visual direction

- Product: dine-in food and drink ordering with an admin operations view.
- Character: warm, grounded, lightly playful.
- World: a neighborhood milk-drink counter, printed menus, and table service.
- Rich moments: existing menu imagery and clear payment/order status, not decorative filler.
- Signature: table-number markers that visibly connect customer and admin order contexts.
- Keep existing layout and features. Focus on consistent spacing, typography, surface colors, borders, and restrained accent use. No wholesale layout redesign, invented illustrations, gradients, glows, or feature/content changes.

## Acceptance criteria

- Astro production build succeeds and the existing TypeScript check succeeds.
- Express serves the generated build and `/healthz` returns HTTP 200.
- React mounts once and customer/admin views remain reachable.
- Manual critical-flow verification covers menu selection, cart quantity/removal, checkout, payment selection/confirmation, order status, admin navigation, and existing menu/order/QRIS management interactions.
- Visual changes are limited to agreed anti-slop polish and do not remove or reorder workflows.
- Dependency/configuration changes are documented in the README with correct dev/build/start commands.

## Remaining implementation calls

- Select Astro and React integration versions compatible with the project's Node/runtime and existing Vite/Tailwind versions after inspecting the installed environment.
- Keep the existing port and Express server contract unless build/preview verification exposes a concrete incompatibility.
- Treat visual modifications as a narrow first pass; defer larger design suggestions for explicit approval.
