# Approved v0 design migration

Visual source: supplied `savor-ai-ui-design.zip`, inspected under the workspace's `work/v0-approved-reference`. Functional source: existing Vite/React application on `immersive-v2`. Source hashes before migration are recorded in `work/v0-migration-source-before.csv` outside the repository.

## Mapping inspected before implementation

| Approved prototype | Production destination | Functional contract retained |
| --- | --- | --- |
| savor-app header, journey, footer | Navbar, App, WhatCanICookScreen | Conditional screen navigation, lifted draft, profile and saved-ID persistence, onboarding |
| Discovery welcome | HomeHero, HomeScreen | Actual featured recipe, personalised recipe list, Cook/Scan/Healthy callbacks |
| Discovery cuisine | CuisineDiscovery, CuisineSelector | Shared 27-cuisine catalog, No preference, real catalog availability |
| Discovery budget | WhatCanICookScreen | Valid numeric MYR budget, servings 1–6, no maximum |
| PanoramicKitchen | KitchenEquipmentScene | Existing selected equipment, shared 26-tool catalog and capability compatibility |
| EarlyGallery | RecommendationsScreen, RecipeCard | Existing query copies, strict eligibility, production ranking, filters and sorting |
| Discovery refinement | WhatCanICookScreen | Ingredients → Time → optional Health; first choices retained |
| RecipeDetail | RecipeDetailModal | Ingredients, quantities, Have/Need, substitutions, nutrition, healthier swaps, equipment, save/start callbacks |
| CookingMode | CookingModeModal | Real recipe.steps, current step, timer/reset/start/pause, AI Voice preference, cue/tip/progress/exit |
| Saved Recommendations | SavedScreen | Persistent IDs, existing curated tabs and collection callback |
| Shared visual language | Profile, Scan, Healthy, Onboarding | Existing profile editing, portions/logging, transformations, identity setup |

## Decisions

- No Next.js files, routing, package replacement, v0 mock recipe types, ranking, shopping-price fractions, concept percentages or generic cooking steps enter production.
- Recipe and pricing data and all `src/lib` recommendation/pricing modules remain authoritative. Paused recipe API and PriceCatcher phases remain disconnected.
- Real recipe photography stays associated with its actual recipe. Approved cuisine photographs are labelled inspiration. A failed or unavailable image uses an editorial text fallback rather than another dish.
- Relevant v0 component CSS is extracted and scoped; framework resets, shadcn, dark-mode defaults, and unused prototype layouts are excluded.
- Existing unsupported photo/voice demonstrations retain their controls and callbacks, with clear sample/text labels rather than claims of new recognition/audio services.
- The HTML export will be regenerated from the same production bundle, embedding all referenced images, including nested migrated assets.

## Completed migration report — 6 October 2026

The approved prototype has been adapted into the existing application on `immersive-v2`. Nothing was merged to main. Existing uncommitted work was retained. The recipe catalog expansion and pricing engine phases remain paused.

### 1. Files added

| Files | Purpose |
| --- | --- |
| `src/components/FoodVisual.tsx` | Shared recipe/source photography, image loading priorities, dimensions, and editorial fallback |
| `src/components/CuisineDiscovery.tsx` | Approved dedicated cuisine composition using the existing catalog and recipe availability |
| `src/components/DesignUI.tsx` | Shared heading/action/sheet components and native modal focus handling |
| `src/components/CookingModeModal.css` | Approved cooking stage, instruction panel and mobile layout |
| `src/data/visualAssets.ts` | Presentation-only asset mappings |
| `src/data/kitchenLayout.ts` | Panorama zones and hotspot coordinates; tool definitions remain in the equipment catalog |
| `src/savor-design.css` | Relevant, scoped styles extracted from the prototype |
| `src/design-adaptations.css` | Production adaptations, supporting screens, accessibility and motion |
| `tools/migrate-v0-assets.mjs` | One-time conversion/cropping of the supplied artwork |
| `public/images/savor/*.webp`, `asset-inventory.json` | Eleven optimized images and their source/dimension/size inventory |
| `docs/v0-design-migration.md` | Mapping, decisions and this final report |

Generated deliverables outside the repository: `outputs/SavorAI.html`, `outputs/v0-home-desktop.png`, `outputs/v0-recommendations-desktop.png`, and `outputs/v0-cooking-mobile.png`.

### 2. Files modified

These are changes relative to the source snapshot at the beginning of this migration, rather than all changes shown by Git from earlier work:

- App/style entry: `src/App.tsx`, `src/main.tsx`, `src/premium.css`.
- Home/navigation: `src/components/Navbar.tsx`, `HomeHero.tsx`, `HomeHero.css`, `HomeScreen.tsx`, `DishIllustration.tsx`.
- Discovery/kitchen: `src/components/WhatCanICookScreen.tsx`, `WhatCanICookScreen.css`, `KitchenEquipmentScene.tsx`, `KitchenEquipmentScene.css`, `CuisineSelector.tsx`, `EquipmentCatalogPanel.tsx`.
- Results/recipe/cooking: `src/components/RecommendationsScreen.tsx`, `RecommendationsScreen.css`, `RecipeCard.tsx`, `RecipeDetailModal.tsx`, `RecipeDetailModal.css`, `CookingModeModal.tsx`.
- Supporting screens: `src/components/SavedScreen.tsx`, `HealthyModeScreen.tsx`, `ScanFoodScreen.tsx`, `ProfileScreen.tsx`, `OnboardingModal.tsx`.
- Existing export utility: `tools/export-html.mjs`.

Styles now load in one explicit order from `main.tsx`, avoiding differences between a fresh page load and hot updates. The migration did not change dependencies, package configuration, Vite configuration, routing or the persistence model.

### 3. Prototype-to-production mapping

The mapping table above was established before implementation. Home remains separate from Cuisine. The prototype's welcome, discovery, panorama, early gallery, recipe and cooking compositions now wrap the existing production screens and callbacks. Refinement retains Ingredients → Time → optional Health. Saved, Profile, Scan, Healthy and onboarding adopt the same typography, photography, spacing and forest/cream surfaces while retaining their richer production controls.

### 4. Assets migrated

| Supplied PNG | Production WebP | Use |
| --- | --- | --- |
| `basil-chicken.png` | `savor/basil-chicken.webp` | Cuisine inspiration; never represented as an available Thai recipe |
| `cooking.png` | `savor/cooking.webp` | Photographic chicken-searing guidance where the existing step is appropriate |
| `kitchen-panorama.png` | `savor/kitchen-panorama.webp` | Four-zone interactive kitchen |
| `cuisines.png` | `savor/cuisines.webp` and six individual cuisine crops | Search/discovery imagery; complete mosaic retained as source artwork |
| `kitchen.png` | `savor/kitchen.webp` | Retained approved artwork; not downloaded by a current screen |

All five source images were converted locally. Eleven WebPs, including the six crops, total **1,177,560 bytes (~1.18 MB)**; the five original PNGs total **8,744,588 bytes (~8.74 MB)**. No new runtime image dependency was added. Existing real recipe, scan and cooking photos were retained, giving 31 WebPs in the export. Western cuisine uses the existing tomato/chicken photograph. Each image has descriptive alternative text; missing artwork falls back to a styled recipe title rather than a fabricated path or a different meal.

### 5. Existing functionality preserved

A SHA-256 comparison against the migration-start snapshot confirms that `src/types.ts`, the cuisine/equipment/ingredient catalogs, `initialProfile.ts`, `recipes.ts`, and every existing `src/lib` module are unchanged. The 12 recipes, 27 named cuisines plus No preference, 26 tools, capability substitutions, pricing fallbacks and repository adapters remain authoritative.

The app still uses its existing lifted profile/draft/query state and saved recipe IDs. Production filtering and ranking choose the results. Budget validation accepts amounts above RM40, serving scaling remains anchored to the original recipe, and nutrition remains per serving. Meal cost, shopping estimate and remaining budget stay separate. In the verified RM100/two-serving example, Tomato & Egg Rice costs **RM6.80** and **RM93.20** is remaining budget. Early results say shopping is not assessed; refined results use the existing known/unknown shopping calculation.

Recipe Detail retains Have/Need, quantities, substitutions, nutrition, healthier selection, tool compatibility, save and start callbacks. Cooking retains real `recipe.steps`, step index, timer countdown/start/pause/reset, voice toggle, progress, cues, tips, Previous/Next/completion and Exit. Scan retains sample selection, portion adjustment and logging. Profile, identity/onboarding, health preferences and saved collections retain their callbacks and persistence.

### 6. Mock logic deliberately excluded

No prototype recipe array, recipe type, simplified ranking, price formula, pantry percentages, pretend grocery totals, generic cooking steps or mock profile/saved-state engine was copied. No Next.js app, routes, framework reset, shadcn library, package replacement, recipe API, PriceCatcher connection, database or Three.js was introduced.

### 7. Conflicts and resolutions

| Conflict | Resolution |
| --- | --- |
| Prototype dish/metrics differ from production recipes | Home uses the actual Ginger Chicken recipe and its existing RM9.80/540 kcal/22-minute values; cuisine photos are explicitly inspiration |
| Ingredients are unknown during early recommendations | Suppress pantry percentages and exact owned/missing counts; Recipe Detail shows a checklist and shopping “Not assessed” |
| Prototype cuisine list is smaller than the shared taxonomy | Use the production catalog, real availability counts, search/grouping and honest empty results; Surprise me chooses an available cuisine |
| Panorama cannot represent every catalog tool | Map 24 hotspots to catalog IDs and expose all 26 tools through “Add more kitchen tools” |
| Prototype lacks rich recipe/supporting features | Keep the production sections and controls, adapting their appearance |
| Old scan/photo and voice demos could imply connected services | Label sample plates and text guidance clearly; preserve toggles/callbacks without pretending recognition or audio exists |
| Saved collection/history could imply tracked data | Derive featured collection numbers from existing recipes; label Recently Cooked as a curated preview because history is not tracked |
| White small text on orange has weak contrast | Keep the orange accent with deep-green text on affected CTAs and selected preference chips; lighten hover orange to retain contrast |
| Fresh-load CSS and hot-update CSS differed | Centralize stylesheet imports and remove unused prototype/old hero rules |
| Modal and cooking layout review exposed focus/scroll issues | Use native dialog focus containment and explicit return focus; focus onboarding step headings; give desktop cooking one instruction scroller and mobile a compact photo above readable instructions |

### 8. Responsive checks

Browser checks covered **1440×1000 desktop**, **1280px laptop**, **768px tablet**, and **390×844 mobile** across the major layouts. Cuisine changes from a split hero/explorer to stacked content and two-column mobile cards. Recommendations become vertical; Recipe Detail becomes a full-screen mobile sheet. Mobile Cooking has a ~203px photo followed by the written instruction, with its full first instruction visible around 530px from the top.

Document-width checks found no unwanted horizontal page overflow in the tested views. The kitchen intentionally scrolls horizontally: desktop mouse dragging was verified, zone controls and Arrow/Home/End navigation were verified, and mobile horizontal panning was exercised. Tool selections survived zone changes and back navigation. Touch compatibility uses native overflow scrolling with `touch-action: pan-x pan-y`; physical-device swipe testing was not available.

### 9. Accessibility checks

Native modal focus containment, Escape, close controls and return focus were checked. Cooking returned focus to its launch button; onboarding focuses the current step heading. The kitchen remains usable through zone controls, keyboard navigation and focusable 44px hotspots without dragging. Search, budget, servings, timers, portion controls, profile sliders and icon-only buttons have accessible names. Selected states use `aria-pressed`; visible focus outlines remain available.

Affected orange CTAs use deep green text: **5.05:1** for `#0E261C` on `#E86C38`. Forest/cream headings and the corrected light Healthy comparison were inspected. This was a targeted accessibility review, not a complete WCAG or screen-reader certification.

Reduced-motion CSS disables ambient animation/transitions/smooth scrolling; Home's Motion hook suppresses entrance/parallax effects and the kitchen checks the motion preference before smooth navigation. Normal motion uses short opacity/transform reveals, restrained hover lifts, gentle food drift and pointer springs rather than particles or animated blur. The reduced-motion path was inspected in source; an operating-system reduced-motion setting was not changed during QA.

### 10. Build and regression status

| Check | Result |
| --- | --- |
| `pnpm lint` (`tsc --noEmit`) | Passed |
| `pnpm test` | **26 passed, 0 failed** |
| `pnpm build` | Passed; JS 486.18 kB / gzip 145.30 kB, CSS 125.58 kB / gzip 23.53 kB |
| `pnpm export:html` | Passed; 31 images embedded, valid JavaScript, no external app scripts/stylesheets, 3,895,528 bytes |
| Production browser console during QA | No captured errors |
| Visible images across reviewed screens | Loaded; no broken images observed |
| Full direct journey | Home → Cuisine → Budget → Kitchen → Early → Recipe → Cooking verified |
| Full refinement journey | Early → Ingredients → Time → skip optional Health → Refined → Recipe → Cooking verified |

Additional checks: Thai returns honest empty results; No preference returns eligible recipes; large and invalid budgets; serving changes; equipment substitutions; search/sort/reset filters; pantry score and unpriced-shopping caveats; substitution expansion; healthier nutrition/start; countdown/pause/reset/step progress/completion; save/unsave with reload; profile persistence; onboarding; saved tabs; and back navigation. Temporary bookmark/skill edits on the user's localhost profile were restored. Sample food logging was tested on the isolated production-preview origin: increasing rice changed Nasi Lemak from 640 to 760 kcal, and logging updated the existing daily snapshot from 1,240 to 2,000 kcal and protein from 68 to 92g.

The existing Vite warning about `__dirname` being unsupported by a future default native config loader remains nonblocking; build succeeds and that configuration was not changed. The HTML export is generated from the same tested production bundle and embeds its CSS/JavaScript/photos. Google Fonts is optional with a system-font fallback. Export structure, JavaScript syntax and image embedding were verified; direct `file://` browser automation was unavailable, so a separate offline-file visual run is not claimed.

### 11. Remaining visual differences from v0

Production meal imagery/numbers reflect the actual catalog rather than the prototype's small mock set. Existing 512px dish assets can look softer at large hero sizes than the new 1264px approved inspiration photographs. Recipe Detail contains more ingredients/nutrition/substitution/equipment content than the prototype, and mobile Cooking deliberately limits the photo height to keep instructions readable. Profile, Scan, Healthy and onboarding extend the approved visual language because the prototype is not a complete specification for those features. Dark CTA labels are an intentional contrast adaptation. Voice playback, live photo recognition and cooking history remain unsupported existing capabilities with honest labels.

### 12. Remaining gaps against the Solar System benchmark

The migration implements the requested principles: dominant photography, layered lighting/HUD surfaces, editorial spacing, calm entrance/ambient motion, tactile controls and a spatial kitchen interaction. The actual Solar System benchmark URL/file was not supplied in this task, so a direct visual comparison or claim of equal quality is not possible. Cooking uses photographic step references rather than custom action video/3D scenes. Physical-device testing, assistive-technology testing and measured animation/frame-rate profiling remain outside the completed browser checks. No unnecessary rendering framework was added to approximate that benchmark.

The approved design migration ends here. Recipe catalog expansion and pricing API work remain paused.
