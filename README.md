# Milo's Garden — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rezimtirani/best-spot-the-difference-game-20261121-0451-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rezimtirani/best-spot-the-difference-game-20261121-0451-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game for make.fun's "Make the best spot the difference game" bounty ($50 in USDC). Two near-identical pictures side by side — find every difference before the timer runs out.

## The game

Three hand-drawn levels, each a little harder than the last:

- **Level 1 · Sunny Garden** — 5 differences, 90 seconds
- **Level 2 · Pond at Dusk** — 7 differences, 100 seconds
- **Level 3 · Treehouse Night** — 9 differences, 120 seconds

Click a difference on either picture and it gets circled in red on both. A wrong click costs 5 seconds. The hint button (H) points at a difference you missed — it costs 5 seconds and you only get three per level. Find them all for a time bonus and stars.

Every scene is original art drawn in code — no borrowed images, no network requests, no libraries. Sound effects are synthesised with the Web Audio API.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. Keyboard: H hint, R restart level, M mute, 1/2/3 jump to a level.

To hand the game in the way the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=mxxxb8b6&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
