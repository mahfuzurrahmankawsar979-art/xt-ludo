# XT LUDO — Offline Android Ludo Game with Secret Dice Engine

A faithful, modern, and completely offline Android Ludo game built to the exact specifications and visual identity of the reference design, featuring 2–4 local players or AI bots, authentic token paths and capture mechanics, local persistence, statistics, theme customization, and an integrated consent-based Secret 6-Zone Dice Control System.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design choices were confirmed during Phase 1 clarification:
> - **Secret Dice Touch Zones**: Configured as hidden invisible touch areas around the perimeter of each player's home base (Zone 1 to 6 mapped exactly to the user's annotated reference screenshot), with subtle optional haptic feedback on Android.
> - **Opponent AI Flexibility**: Full pass-and-play local multiplayer supporting 2, 3, or 4 players, with toggleable offline AI bots for any player slot.
> - **Installation & Standalone APK**: Delivered as a 100% offline Progressive Web App (PWA) with Service Worker asset caching, standalone display mode, in-app install prompt, and an integrated APK building/packaging guide modal.

---

## 1. Overview & Core Concept

**XT LUDO** is an offline, zero-dependency, high-performance Ludo game engineered specifically for mobile viewports and Android standalone usage. It features:
- **Zero Internet Requirement**: Runs purely locally with Web Audio API procedural sound generation, zero external font/image network dependencies, and local state persistence.
- **Strict Adherence to Reference Screenshot**: Dark royal blue geometric background, golden board trim, rounded pill pause and sound buttons, player status cards with emoji avatars, real-time completion percentages, dice trays, and star-adorned safe cells.
- **Tactical Secret Dice Control System**: In Custom Dice Mode, each player has six invisible perimeter zones around their home base corresponding to numbers 1–6. Long-pressing the player's name (3 seconds) unlocks secret ID selection; tapping a zone stages a single-use pending number executed on their next roll before clearing.
- **Full Classic Rules Engine**: Authentic 52-cell outer track, color-matched home paths, safe cells (entry cells and star cells), token knocking/capture with turn rewards, bonus rolls on 6, and multi-token stacking.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Home / Title Screen**:
   - XT LUDO gold-embossed brand lockup over ambient dark blue patterned background.
   - Quick action buttons: **Play Now**, **Resume Game** (enabled if a match is saved), **Game Mode** (Classic / Custom Dice), **Statistics**, **Themes**, **Rules**, and **Install App / APK Guide**.
2. **Match Setup Screen**:
   - Player count selection: **2 Players**, **3 Players**, **4 Players**.
   - Player slot configuration: Toggle Human vs. Bot; edit Player Name (P1 Red, P2 Green, P3 Blue, P4 Yellow).
   - Mode verification: Classic (random dice) vs. Custom Dice Mode (shows badge indicating special mode is active).
3. **Active Board View**:
   - **Header Bar**: Top-left rounded Pause button; Center title `"XT LUDO"` with mode subtitle; Top-right Sound mute toggle.
   - **Player Cards**: Four corner status pods showing avatar emoji, player name, progress percentage (0%–100%), and active-turn golden glow.
   - **Ludo Board**:
     - Top-Left: Red Base; Top-Right: Green Base; Bottom-Left: Blue Base; Bottom-Right: Yellow Base.
     - 4 Tokens per base with 3D pin-drop icon styling, smooth jump animations, and pulse indicators when valid to move.
     - 6-Zone touch detection zones wrapped seamlessly around each base border.
   - **Turn Cycle**: Active player taps the rolling dice; dice animates with tumbling 3D pip rotations; valid tokens pulse; tapping a token moves it step-by-step along the path; knockouts trigger capture sound and return piece to base.
4. **Victory & End-Game Screen**:
   - Celebratory confetti and victory fanfare.
   - Winner announcement, match duration, capture stats, and rematch CTA.

### Visual Identity & Theme Tokens

- **Aesthetic Direction**: High-gloss mobile arcade board game with premium gold borders, deep space navy contrast, and vibrant jewel-tone player quadrants.
- **Color Palettes**:
  - **Classic Navy (Reference)**: Canvas `#06102B`, Board Outer Rim `#E5A93C` & `#D4881E`, Track `#FFFFFF`, Red `#E53935`, Green `#2E7D32`, Blue `#1E88E5`, Yellow `#FDD835`.
  - **Modern Cyber**: Deep Slate `#0B1120`, Neon Red `#FF3366`, Neon Green `#00E676`, Cyan Blue `#00B0FF`, Amber Gold `#FFD600`.
  - **Wooden Classic**: Warm polished mahogany background `#2B1810`, engraved oak board `#DFBA84`, classic rich lacquer player tokens.
- **Typography**: Clean geometric typography (`Plus Jakarta Sans` / `Outfit`) with `font-mono tabular-nums` for percentages and timers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Procedural Web Audio vs. External Audio Files**
  - *Chosen Approach*: Synthesize all sound effects (dice rolling rattle, token clack, safe cell chime, capture punch, victory fanfare) via the native browser `AudioContext` oscillator and noise buffers.
  - *Why*: 100% offline reliability without HTTP asset load errors, zero latency, and zero broken audio links on any mobile device.
- **Decision 2: Seamless Invisible Secret Touch Zones**
  - *Chosen Approach*: Six absolute-positioned invisible touch targets surrounding each player's home base boundary, exactly matching the 1–6 positions in the user's annotated reference image. Red/Green bases have rotated mappings (Zone 1 at bottom edge; Zone 6 at top edge) while Blue/Yellow have Zone 1 at top edge and Zone 6 at bottom edge.
  - *Why*: Enables genuine stealth mode as requested by the user, while supporting long-press activation on player names.
- **Decision 3: Complete Mobile-First Aspect Ratio & Scaling**
  - *Chosen Approach*: The board and HUD are rendered inside an auto-scaling SVG/CSS grid container clamped to standard mobile dimensions (360px–480px width) centered on wider displays, with full touch and mouse support.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                GameState & Storage Orchestrator                  │  │
│  │     (Classic/Custom Mode, Save/Resume, Stats, Sound Engine)      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│         │                             │                        │       │
│  ┌──────▼────────┐           ┌────────▼────────┐       ┌───────▼─────┐ │
│  │  TitleScreen  │           │   MatchSetup    │       │ PauseModal  │ │
│  │  - Play       │           │   - 2/3/4 Play  │       │ Settings    │ │
│  │  - Resume     │           │   - Bot Toggles │       │ VictoryView │ │
│  │  - Stats/PWA  │           │   - Player Names│       │ APK Guide   │ │
│  └───────────────┘           └─────────────────┘       └─────────────┘ │
│                                       │                                │
│                              ┌────────▼────────┐                       │
│                              │    GameBoard    │                       │
│                              └─────────────────┘                       │
│                                       │                                │
│         ┌─────────────────────────────┼────────────────────────────┐   │
│         │                             │                            │   │
│  ┌──────▼─────────┐           ┌───────▼────────┐           ┌───────▼─┐ │
│  │ TopBar HUD     │           │ LudoGrid       │           │ DiceBox │ │
│  │ - Pause Button │           │ - 52 Outer     │           │ - Roll  │ │
│  │ - XT LUDO Logo │           │ - 4 Home Paths │           │   Anim  │ │
│  │ - Sound Toggle │           │ - Safe Stars   │           │ - Turn  │ │
│  │ - Player Cards │           │ - Secret Zones │           │   Glow  │ │
│  └────────────────┘           └────────────────┘           └─────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Entities

```typescript
type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';
type PlayerId = 'P1' | 'P2' | 'P3' | 'P4';

interface PlayerState {
  id: PlayerId;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  tokens: [number, number, number, number]; // -1 for home yard, 0..50 for main track, 51..56 for home path, 99 for finished
  pendingDiceNumber: number | null; // Set via secret zone in Custom Mode
  secretUnlocked: boolean;
  score: number;
  tokensFinished: number;
}

interface GameSession {
  mode: 'classic' | 'custom';
  players: PlayerState[];
  currentTurnIndex: number;
  diceValue: number | null;
  hasRolled: boolean;
  isRolling: boolean;
  extraTurn: boolean;
  consecutiveSixes: number;
  winner: PlayerState | null;
  historyLog: string[];
}
```

### Zone Mapping Verification (From Reference Screenshot)

- **Blue (P3) & Yellow (P4) Bases**:
  - Zone 1: Top Center edge
  - Zone 2: Upper Left edge
  - Zone 3: Upper Right edge
  - Zone 4: Lower Left edge
  - Zone 5: Lower Right edge
  - Zone 6: Bottom Center edge
- **Red (P1) & Green (P2) Bases (Rotated 180°)**:
  - Zone 1: Bottom Center edge
  - Zone 2: Lower Right edge (or Lower Left)
  - Zone 3: Lower Left edge (or Lower Right)
  - Zone 4: Upper Right edge
  - Zone 5: Upper Left edge
  - Zone 6: Top Center edge

Each tap on an active secret zone instantly stages the selected number into `pendingDiceNumber`, which overrides the next dice roll for that player when in Custom Mode, and clears immediately after single use.
