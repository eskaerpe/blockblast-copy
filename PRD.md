# you asked

message time: 2026-07-04 19:39:15

give me the PRD.md file explaining about detailed Product Requirements Document  of this game project

---

# claude response

# PRD.md

# TechBlast Clone — Product Requirements Document

**Version:** 1.0
**Status:** Draft for team review
**Owner:** Product/Engineering
**Last updated:** 2026-07-04

---

## 1. Overview

### 1.1 Product Summary

TechBlast Clone is a casual, client-side puzzle game inspired by Block Blast mechanics. Players drag polyomino-shaped blocks from a dock onto an 8×8 grid. Filling a full row or column clears it and awards points. The game ends when none of the three blocks currently in the dock can be legally placed anywhere on the board.

The product is intentionally scoped as **front-end only**: no accounts, no server, no network calls after initial load. All persistence — high score, theme preference, audio preference — is handled through `localStorage`.

### 1.2 Problem Statement

Casual puzzle games with a "quick session, satisfying loop" shape (Tetris-likes, match-3, block-fit) retain players through short, replayable sessions rather than long onboarding or narrative investment. This project targets that same shape: a game a player can open, understand in five seconds, and either put down or keep playing for twenty minutes.

### 1.3 Goals

| Goal | Why it matters |
|---|---|
| Sub-second time-to-playable on mobile | Casual games lose players during load |
| Deterministic, bug-free core loop | A puzzle game with score-tracking that can be broken by a bad state transition undermines the entire product |
| Fully offline-capable | No backend means no excuse for network dependency |
| Comfortable one-handed mobile play | Primary platform is mobile web |

### 1.4 Non-Goals (v1)

- Multiplayer or asynchronous competition
- Server-side leaderboards or accounts
- In-app purchases or ads
- Level/stage progression (this is an endless-mode game)
- Native app wrapper (web-only for v1)

---

## 2. Target Users & Platform

**Primary platform:** Mobile web browsers (iOS Safari, Android Chrome), portrait orientation.
**Secondary platform:** Desktop browsers, responsive down-scaled layout.

**User profile:** Casual players looking for a short-session distraction; no assumed familiarity with the game beyond "block puzzle games" as a genre.

---

## 3. Core Gameplay Requirements

### 3.1 The Board

- An 8×8 grid, initialized empty.
- Each cell is either empty (`0`) or occupied (holds the color identity of the block that filled it).
- The board is the single source of visual and logical truth — no shadow/duplicate state elsewhere in the app should track occupancy.

### 3.2 The Dock

- Always holds exactly 3 blocks at a time (or fewer, transiently, as they're placed).
- When all 3 dock blocks have been placed, the dock refreshes with 3 new randomly generated blocks.
- Blocks are generated from a fixed shape set (see 3.3) chosen via weighted random selection.

**Requirement:** the dock must never refresh with a set of 3 blocks where it's already impossible to place all three in sequence, if this is avoidable by generation-time checking. (Open question — see Section 9.)

### 3.3 Block Shapes

- Blocks are polyominoes of varying size (from single-cell up to shapes spanning roughly 5×5 bounding boxes), matching the Block Blast reference genre.
- Each block has exactly one color, used consistently for both the dock preview and the placed cells on the board.
- Shape and color definitions live in a static constants file — not procedurally generated — for predictable balancing.

### 3.4 Placement Rules

- A block may be placed at any board position where every filled cell of its shape maps to an empty, in-bounds board cell.
- Invalid placement (out of bounds, or overlapping an occupied cell, at any single cell of the shape) rejects the entire placement — no partial placement.
- On valid placement:
1. All shape cells are written to the board with the block's color.
2. The board is scanned for full rows and full columns.
3. Any full rows/columns are cleared simultaneously.
4. Score is updated (see 3.6).
5. The placed block is removed from the dock.

### 3.5 Line Clearing

- A row is "full" when all 8 cells are occupied. Same for columns.
- Row and column checks happen independently in the same pass — a single placement can clear multiple rows and columns at once.
- Clearing sets the relevant cells back to `0`. It does not shift or gravity-drop remaining blocks (this is a fixed-grid clear, not a Tetris-style collapse).

### 3.6 Scoring

- Placing a block awards points per filled cell.
- Clearing a line awards a larger, fixed bonus per line.
- Clearing multiple lines in one placement, or clearing lines on consecutive placements without a "miss" in between, increases a combo multiplier applied to the line-clear bonus.
- Placement points are never multiplied — only line-clear points are.
- High score updates only when current score exceeds the previously stored high score; this comparison is internal to the scoring logic, not something set arbitrarily by any other part of the app.

### 3.7 Game Over

- The game is over when, of the blocks currently occupying the dock, not a single one has any legal position anywhere on the board.
- If the dock is transitioning (about to refresh with 3 new blocks), this is not evaluated as a game-over state.
- On game over: input is disabled, a game-over overlay is shown with final score and high score, and a restart action is available.

---

## 4. Interaction Requirements

### 4.1 Drag and Drop

- Players pick up a block from the dock via touch or mouse and drag it over the board.
- While dragging, the board should indicate (via preview/highlight) whether the current hover position is a valid placement.
- Releasing over a valid position places the block; releasing over an invalid position or outside the board returns the block to the dock.
- Touch interactions require a short activation delay/distance threshold to distinguish an intentional drag from a scroll or tap — this must not feel laggy, but must reliably avoid accidental drags.

### 4.2 Accessibility Fallback

- Core interactions (picking a block, choosing a target cell, placing it) must be reachable without a pointer device — via keyboard focus and activation, at minimum, so the game isn't drag-only.
- This is listed as a requirement but its implementation scope should be confirmed with the team before v1 lock (see Section 9).

### 4.3 Settings

- Theme: dark/light toggle, persisted.
- Audio: on/off toggle, persisted, covering placement sound, line-clear sound, and game-over sound at minimum.

---

## 5. Persistence Requirements

- High score, theme preference, and audio preference persist across sessions via `localStorage`.
- The app must degrade gracefully if `localStorage` is unavailable or throws (private browsing mode, quota exceeded, storage disabled): the game remains fully playable, simply without persistence for that session, and this must never crash the app or block a write path.
- Corrupted or unparseable stored data falls back to default values rather than propagating an error.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Smooth interaction (no visible jank) during drag on mid-tier mobile hardware; re-renders should be scoped to changed cells/blocks, not the whole board |
| Reliability | Game state transitions must be deterministic — the same sequence of actions from the same starting state always produces the same result |
| Error handling | An application-level error boundary must prevent a single component failure from producing a blank/broken screen |
| Browser support | Latest two versions of Safari (iOS), Chrome (Android), and Chrome/Firefox/Safari (desktop) |
| Offline capability | No functionality may depend on a network request after initial page load |
| Viewport handling | Layout must account for mobile browser chrome (address bar show/hide) without causing scroll-jump or layout shift |

---

## 7. Success Metrics

Since this is a v1 front-end-only build with no backend telemetry specified, success is evaluated qualitatively pending an analytics decision:

- Game is playable start-to-finish (place → clear → score → game over → restart) with no state bugs.
- No crashes across the supported browser matrix.
- Session feels "instant" — no perceptible load delay before the board is interactive.

*(If analytics are added in a later version, recommended metrics would include session length, average score, and restart rate — flagged here as a v2 consideration, not a v1 requirement.)*

---

## 8. Assumptions

- Single-player only; no concept of opponents or shared state.
- English-only or locale-agnostic UI text for v1 (no i18n requirement stated).
- No monetization in v1.
- Portrait orientation is the primary supported layout; landscape behavior is not specified and defaults to whatever the responsive layout naturally produces.

---

## 9. Open Questions

These need a decision before implementation locks in scope:

1. **Dock fairness:** should block generation actively avoid producing a dock of 3 blocks that's immediately unplaceable, or is that an acceptable (if rare) way for a run to end?
2. **Difficulty curve:** should larger/harder-to-place blocks become more frequent as score increases, or does block weighting stay flat for the whole session?
3. **Combo reset condition:** does the combo multiplier reset the moment a placement doesn't clear a line, or is there tolerance (e.g. resets only after N consecutive non-clearing placements)?
4. **Accessibility scope:** is full keyboard-operable placement a hard v1 requirement, or a stretch goal that can ship in a fast-follow?
5. **Analytics:** is there any intent to add usage analytics in v1, or is that explicitly deferred?

---

## 10. Appendix: Glossary

- **Polyomino** — a shape made of connected unit squares (the block pieces used in this game).
- **Dock** — the tray holding the 3 currently-available blocks to place.
- **Combo streak** — count of consecutive placements that each cleared at least one line.
- **Line clear** — the event of a full row or column being emptied after a placement.