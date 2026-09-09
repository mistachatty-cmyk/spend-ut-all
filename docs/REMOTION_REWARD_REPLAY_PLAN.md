# Remotion reward replay plan

## Decision

Do not load Remotion during ordinary gameplay. Spend It All's existing CSS micro-motion remains the default, including on low-end phones and computers. Add Remotion later as an opt-in **Creator Replay** route that turns a compact run summary into a shareable video.

This keeps the base game simple while giving the project a path to richer presentation. Remotion's Player can be embedded in a React/Next.js application and driven by runtime props, but its code should be dynamically imported only after the player opens Creator Replay.

## First useful composition

`CardCreditRunRecap` receives serializable props rather than the live `GameState` object:

```ts
type CardCreditRunRecapProps = {
  scenarioName: string;
  companionId: string;
  creditsEarned: number;
  rewards: Array<{ source: string; amount: number; label: string }>;
  questTitle?: string;
  questBonus?: "cash" | "business-boost" | "card-pack";
  themeId?: string;
};
```

The 8–12 second clip would show the companion entering, the CC total counting up, the day's reward receipts stacking, and the selected quest bonus as the final beat. The same composition can later render daily wrap-ups, card-pack openings, achievement reels, or full run recaps.

## Low-end-device guardrails

- Keep gameplay animation in CSS and respect reduced-motion settings.
- Put `@remotion/player` behind a dynamic import and a user click; never import it from the root layout or main game page.
- Default the preview to paused, 720p, 30 FPS, and a short duration.
- Use existing SVG/pixel assets and system fonts; do not preload a large font or media library.
- Keep the composition deterministic and prop-driven. Do not subscribe it to the 250 ms game loop.
- Render MP4 files outside the gameplay tab. A future server render can be queued, but local preview must remain optional.
- Add a static recap card fallback when the browser/device does not meet the feature budget.

## Suggested file boundary for the later implementation

```text
app/creator-replay/page.tsx        opt-in route and capability gate
app/components/ReplayLauncher.tsx dynamic import boundary
remotion/index.tsx                 Remotion root registration
remotion/Root.tsx                  composition registry
remotion/CardCreditRunRecap.tsx    first composition
game/replay-types.ts               small serializable payloads
game/systems/replay-snapshot.ts    GameState → replay payload
```

## Rollout

1. Ship the CC ledger and companion quests without Remotion dependencies.
2. Add a static “Day Receipt” preview sourced from `recentCreditRewards`.
3. Install `remotion`, `@remotion/cli`, and `@remotion/player` at identical versions and add the isolated Creator Replay route.
4. Measure the base route bundle before and after. The main gameplay route should not materially grow.
5. Add rendering only after preview performance is acceptable and the current Remotion license is reviewed for the intended usage.

## Official references reviewed

- https://www.remotion.dev/docs/player/
- https://www.remotion.dev/docs/player/integration
- https://www.remotion.dev/docs/parameterized-rendering
- https://www.remotion.dev/docs/license/pricing
