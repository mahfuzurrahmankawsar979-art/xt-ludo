/**
 * XT LUDO Game Types & Definitions
 */

export type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';
export type PlayerId = 'P1' | 'P2' | 'P3' | 'P4';
export type GameMode = 'classic' | 'custom';
export type ThemeType = 'classic' | 'modern' | 'wooden';

export type GameView = 'menu' | 'setup' | 'playing' | 'stats' | 'rules' | 'apk_guide';

export interface Token {
  id: number; // 0, 1, 2, 3
  // stepIndex:
  // -1: in base / home yard
  // 0..50: on main path (relative to player start: 0 = start cell, 50 = last cell before home stretch)
  // 51..55: on home stretch
  // 56: inside final home (completed)
  stepIndex: number;
}

export interface Player {
  id: PlayerId;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  avatarEmoji: string;
  tokens: Token[];
  pendingDiceNumber: number | null; // For Secret 6-Zone Custom Mode
  secretUnlocked: boolean; // Unlocked via 3-second long press on player card
  lastZoneSelected: number | null; // 1 to 6
}

export interface GameStats {
  totalMatches: number;
  totalWins: number;
  playerWins: Record<PlayerId, number>;
  playerMatches: Record<PlayerId, number>;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: ThemeType;
  showSecretZoneHints: boolean; // Optional visual guide for secret zones
  botSpeed?: 'normal' | 'fast';
  quickSecretBar?: boolean; // Sneaky quick secret dice selector bar in VS Computer mode
}

export interface SavedGameState {
  mode: GameMode;
  players: Player[];
  activePlayerIndex: number;
  diceValue: number | null;
  hasRolled: boolean;
  consecutiveSixes: number;
  extraTurn: boolean;
  winner: PlayerId | null;
  matchStartedAt: number;
}
