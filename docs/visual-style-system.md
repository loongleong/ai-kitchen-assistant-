# SavorAI visual style system

The Ginger Chicken Rice Bowl Home hero is the visual benchmark: realistic ceramic food styling, warm directional lighting, deep forest green, translucent metrics and quiet depth. Keep the original warm light app canvas requested by the user, with cinematic green focal environments inside it. Profile is deliberately lighter and functional.

## Foundations

| Role | Value |
| --- | --- |
| Canvas | Warm off-white `#FBF9F5`, with faint orange and green lighting |
| Forest / primary ink | `#183B2B` |
| Action accent | Warm orange `#E86C38` |
| Light-canvas accent text | `#C45223` |
| Cinematic accent text | Muted warm gold `#E8B68A` |
| Typeface | Plus Jakarta Sans |
| Display type | Weight 500, tight tracking, generous line height |
| Numerical type | Tabular numerals, 28–46px according to importance, small units |
| Corners | 22–28px major surfaces, 12–16px controls and metrics |
| Depth | Thin borders, soft directional gradients, restrained shadows |

`src/premium.css` defines the shared system. `.premium-theme` provides the light palette; `.premium-cinematic` scopes the dark palette to a dominant section. `.premium-hud` provides green glass metrics with bright numbers and readable secondary labels. Use the dark HUD background with sufficient opacity on the light canvas.

## Food imagery

Use the registry in `src/data/foodVisuals.ts` and the shared `DishIllustration` component. Its existing API remains compatible with current screens. The assets are realistic food renders in WebP, with ceramic bowls or plates, natural texture, studio lighting and a consistent three-quarter overhead angle. The name of the component is retained for compatibility; it renders photographic-style images.

Use close food crops for secondary recipe cards and larger plate views for dominant features. Avoid flat food vectors, emoji, illustrated placeholders, unrelated decorations and mismatched photographic styles. Keep cooking scene captions clear when an image is illustrative or a finished-dish preview.

## Screen hierarchy

| Screen | Dominant focal point | Supporting treatment |
| --- | --- | --- |
| Home | Ginger Chicken bowl | Floating ingredient labels, orbit lines, steam and glass HUD metrics |
| What can I cook | The six-step kitchen decision panel | Warm light panel, forest-green current-step HUD and selected step, green primary actions, quieter profile context |
| Recommendations | One Best Match dish | Existing score, RM cost, time and calories in glass panels; remaining cards stay secondary |
| Recipe detail | Dish and Start Cooking decision | Large food image, green metric panels, fixed visible action footer |
| Cooking mode | Current cooking action and written instructions | Realistic scene or recipe preview, strong step title, live timer, quiet transitions |
| Scan food | Food photo and its analysis | Green energy HUD, readable component list and portion controls |
| Healthy mode | Original-to-healthier food transformation | Side-by-side imagery, emphasized energy change, ingredient disclosures |
| Saved | Personal food library | Green curated collection, realistic food cards and existing tabs |
| Profile | Settings and active kitchen identity | Warm light surfaces, clear controls, restrained lighting |

## Motion and responsive behavior

1. Ambient: Home steam, soft glow, gentle food float; do not animate every card.
2. Interaction: Small hover lift, subtle food zoom, button and chip response.
3. State: Short fade/translation when a step or result changes. Keep instructions visible after cooking-step changes.
4. Entrance: Stagger the main hero elements calmly.

Prefer transform and opacity animation. Shared CSS disables animation and transitions for `prefers-reduced-motion`; the Home Motion implementation also respects reduced motion and restricts mouse parallax to suitable pointer devices. No Three.js.

On mobile, Best Match stacks food above its copy and uses a two-column metric grid. Healthy comparison remains side-by-side at typical phone widths and stacks below 360px. Cooking uses a compact scene so the written instruction is visible in the initial viewport. Settings and navigation adapt to narrow screens.

## Preservation rules

Consume existing recipe scores and callbacks. Do not change recommendation filtering, ordering, nutrition math, timers, saved state, profile data or recipe structures for visual reasons. Best Match highlights the highest existing score among current filtered results without changing their order. Presentation-only controls may disclose detail while retaining all content and original actions.

For every screen, review realistic food styling, one clear focal point, readable numbers, spacing, contrast, hover and focus feedback, responsive fallback, quiet motion and consistency with the Home benchmark.
