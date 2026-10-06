SavorAI Phase 1 — Core recommendation data architecture

The app now uses shared cuisine and equipment catalogs, a deterministic pricing engine and a recipe-source boundary. The approved layouts and food imagery were retained. Only the requested catalog controls and cost/equipment explanations were added to existing screens.

Files added

| File | Responsibility |
| --- | --- |
| `src/data/cuisineCatalog.ts` | 27 cuisines in seven browsing groups, plus the shared No preference value; popular choices, normalization, actual recipe counts and preference toggling. |
| `src/data/equipmentCatalog.ts` | 26 tools in five categories, aliases, default tools, nine scene positions and capability compatibility. |
| `src/data/ingredientCatalog.ts` | Stable ingredient IDs and conservative structured quantity metadata. |
| `src/lib/pricing.ts` | Price records, source interface, unit conversion, ingredient consumption cost, purchase costs, remaining budget and explicit fallback/unknown states. |
| `src/lib/priceCatcher.ts` | Import boundary for joined, explicitly mapped PriceCatcher observations. |
| `src/lib/recipeRepository.ts` | Local recipe normalization and the future RecipeSource adapter interface. |
| `src/components/RecipeDataContext.tsx` | Shared runtime recipes, price observations and optional geography for every consumer. |
| `src/components/CuisineSelector.tsx` | Popular choices plus a searchable all-cuisine panel with grouped browsing and availability labels. |
| `src/components/EquipmentCatalogPanel.tsx` | Searchable “Add more kitchen tools” panel with category filtering. |
| `src/components/CatalogSelectors.css` | Scoped styling for the added controls; no changes to approved screen stylesheets. |
| `tests/dataArchitecture.test.ts` | 16 architecture regression tests, in addition to the 10 existing cooking-flow tests. |
| `docs/core-data-architecture.md` | This implementation and integration report. |

Files changed

| File | Change |
| --- | --- |
| `src/App.tsx` | Uses the normalized local repository, provides shared RecipeData, accepts future injected data and normalizes legacy profile names. |
| `src/types.ts` | Adds optional ingredient quantities, pricing provenance, cuisine tags, source metadata and capability requirements; existing Recipe fields/callbacks remain compatible. |
| `src/data/initialProfile.ts` | Gets default cuisines/equipment from shared catalogs. |
| `src/lib/cookingFlow.ts` | Uses shared cuisine/capability matching and the pricing engine for serving projections. |
| `src/components/WhatCanICookScreen.tsx` | Uses the shared cuisine selector. |
| `src/components/KitchenEquipmentScene.tsx` | Gets the existing nine hotspots from the catalog; adds the extra-tools panel and keeps the selected tray. |
| `src/components/OnboardingModal.tsx` | Uses shared selectors, reads the current profile when reopened, allows removal of the last tool, handles No preference exclusively and describes pricing as estimated. |
| `src/components/ProfileScreen.tsx` | Uses the same catalog controls and capability wording. |
| `src/components/RecommendationsScreen.tsx` | Uses shared cuisine and equipment compatibility; keeps the approved hero/cards; displays separate meal cost, remaining budget and shopping status. |
| `src/components/RecipeDetailModal.tsx` | Uses the same pricing and compatibility; preserves the approved layout and Start Cooking callbacks. |
| `src/components/RecipeCard.tsx` | Uses the centralized meal-cost accessor and an accessible estimate/fallback label. |
| `tests/runFlowTests.mjs` | Compiles the expanded pure-data test graph and runs both test files. |
| `package.json` | Adds `test` and `export:html` scripts. |

Generated outputs were refreshed: the production `dist/` bundle and `outputs/SavorAI.html`. The HTML has all 20 images embedded, validated JavaScript and no external application script/styles dependencies. Google Fonts remains optional with a system-font fallback. Browser review used the running app on localhost; direct local-file rendering was not inspected through the in-app browser's file URL policy.

Hard-coded option arrays removed

- Four cuisine option arrays: What Can I Cook, Recommendations, Profile and Onboarding.
- Three equipment option arrays: KitchenEquipmentScene, Profile and Onboarding. Scene coordinates now live with catalog entries; the previous nine-object order is retained.
- Initial-profile default cuisine/equipment name arrays now consume shared catalog exports.

Recipe-specific `requiredEquipment` arrays remain in `recipes.ts`: these describe recipe requirements, not duplicated lists of available options. The static recipes and original cooking steps were not edited.

Cuisine availability

There are still 12 real recipes, covering Malaysian, Chinese, Japanese, Korean, Italian and Western. The larger taxonomy does not create recipes, infer regional tags or broaden a cuisine into unrelated dishes. For example, Thai can be selected or saved as a preference, but is labelled “No recipes yet” and produces an explicit empty result. Counts come from the same runtime catalog used by Recommendations. No preference includes the actual catalog.

Equipment compatibility

Frying pan requires `stovetop-fry` and `sear`; Wok supplies those plus `stir-fry`. Stove and Induction cooker supply `stovetop-heat`. Pot, Saucepan and Stock pot supply `boil` and `simmer`. Compatibility checks actual owned capabilities and supports explicit alternative capability sets on future recipes. Unknown legacy tools use case-insensitive exact matching.

This allows Wok + Induction cooker + Knife to prepare Homestyle Tomato & Egg Rice. Recipe Detail explains “Wok works” and “Induction cooker works.” Appliance methods stay distinct: an oven is not silently treated as an air fryer, and a kettle does not replace a simmering pot. Original cooking steps/timers remain unchanged.

Current pricing fallback behavior

`estimatedMealCostRM` measures the value of ingredient quantities used. If every ingredient has compatible structured quantities and a verified price observation, the engine calculates this ingredient by ingredient. Otherwise it uses the original recipe's estimate as a labelled whole-meal fallback, scaled from the original serving count. Partial observations never get added to the whole-meal fallback, preventing double-counting.

`additionalShoppingCostRM` is separate. For missing priced ingredients, purchase packs are rounded up and repeated ingredients share a pack calculation. Loose-price observations use the required quantity. Existing `estCostIfMissing` values remain clearly identified item fallbacks when available. If some missing items lack estimates, the full total is `null`; the UI shows “estimate unavailable” or a known lower bound instead of an invented RM0.00. Before pantry refinement it is unknown. If all required ingredients are owned, it is RM0.00.

The verified ingredient-price collection is deliberately empty. No fake prices, update dates, live-price claims, paid APIs or LLM-generated price totals were introduced. Existing `estimatedCostRM` remains a compatibility alias for estimated meal cost, never remaining budget. A future external recipe source's reported cost is ignored; it must have complete ingredient pricing before it is admitted to recommendations.

Mass and volume conversions are explicit (kg/g, l/ml, tbsp/tsp). The engine does not invent ingredient densities, weights of “large” tomatoes, mixed-ingredient proportions, or raw/cooked rice equivalences. Those require explicit quantity metadata from a reviewed recipe adapter.

RM93.20 investigation

The current source stored Homestyle Tomato & Egg Rice at RM6.80 for two servings. Its only budget subtraction was used for a “below your budget” explanation; I did not find a current source path assigning that remainder to the meal-cost field. RM100 − RM6.80 = RM93.20.

The new pricing engine keeps the values separate and the browser check confirms:

| Value | For two servings and RM100 budget |
| --- | --- |
| Estimated meal cost | RM6.80, labelled as a fallback recipe estimate |
| Remaining budget | RM93.20 |
| Additional shopping required | RM0.00 when the five ingredient groups are owned; unknown when an unpriced ingredient is missing |

At four servings, the temporary fallback is RM13.60; six servings gives RM20.40. These calculations are anchored to the original two-serving recipe rather than repeatedly scaling an already-scaled total. Ingredient pricing replaces that fallback when full verified coverage is supplied.

Where a future recipe API connects

Implement `RecipeSource.listRecipes()` in `src/lib/recipeRepository.ts`. The adapter maps provider DTOs into the existing Recipe model, with stable IDs, known cuisine labels/explicit taxonomy IDs, ingredient IDs/quantities, steps and capability requirements. Keep provider-specific network/authentication outside screen components. Call `loadRecipeCatalog(source, {prices, location})`, then supply the returned catalog, price observations and geography to `<App recipeData={{recipes, prices, location}} />`. Its shared context feeds selectors, recommendations and recipe pricing together.

Duplicate IDs, unknown primary cuisines and recipes without complete verified pricing are rejected for external sources. No external API has been connected in this phase.

Where PriceCatcher data connects

The official [PriceCatcher transactional dataset](https://data.gov.my/data-catalogue/pricecatcher) provides date, item code, premise code and RM price. It is distributed as bulk downloads and is explicitly unavailable through the catalogue OpenAPI. The [Item Lookup](https://data.gov.my/data-catalogue/lookup_item) provides item names/units; the [Premise Lookup](https://data.gov.my/data-catalogue/lookup_premise) provides geography.

A future server-side ingestion job should join those datasets, review mappings of item codes/unit labels to SavorAI ingredient IDs and purchase bases, then call `importPriceCatcherPrices()` in `src/lib/priceCatcher.ts`. The importer retains source, observation date, state, district and premise. It refuses unmapped/mismatched units and invalid prices. Serve the small normalized result through an `IngredientPriceSource.loadPrices()` implementation from `src/lib/pricing.ts`, and supply the observations and selected location through RecipeData. Scoped observations are used only for matching geography; the current app does not guess a location or fabricate a national price.

Validation and preserved scope

- `pnpm run lint`: passed.
- `pnpm test`: all 26 tests passed, including pricing separation, fallback scaling, purchase packs, partial/unknown prices, unit conversion, geography, provenance, API price rejection, cuisine availability and equipment substitution.
- `pnpm run build`: passed. The existing Vite configuration warning about future native config loading remains unrelated to this change.
- Browser: popular/grouped/search cuisine controls, Thai empty results, tool search/category filtering, Wok/Induction substitution, retained setup/refinement, separate RM6.80/RM93.20 labels, unknown shopping estimates and RM0.00 for an owned pantry were checked.
- Profile and Onboarding were inspected using the shared catalogs. No test profile edits or save changes were persisted.
- At 390px, body scroll width was 375px (scrollbar excluded), all extra-tool buttons were at least 44px high and none overflowed its own width. The temporary viewport was reset.
- Source hashes captured before this phase confirm Home, HomeHero, CookingMode, Scan, Healthy, Saved, all approved screen stylesheets and the static recipe dataset are unchanged in this phase. Existing earlier working-tree edits were preserved.

The work stops at Phase 1. Cooking Mode was not modified.
