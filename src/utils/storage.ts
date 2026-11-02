import { GameSettings, GameStats, PlayerId, SavedGameState } from '../types/game';

const STORAGE_KEY_SAVE = 'xt_ludo_saved_game_v1';
const STORAGE_KEY_STATS = 'xt_ludo_stats_v1';
const STORAGE_KEY_SETTINGS = 'xt_ludo_settings_v1';

const DEFAULT_STATS: GameStats = {
  totalMatches: 0,
  totalWins: 0,
  playerWins: {
    P1: 0,
    P2: 0,
    P3: 0,
    P4: 0
  },
  playerMatches: {
    P1: 0,
    P2: 0,
    P3: 0,
    P4: 0
  }
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  theme: 'classic',
  showSecretZoneHints: false
};

export function saveGameState(state: SavedGameState): void {
  try {
    localStorage.setItem(STORAGE_KEY_SAVE, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save game state', err);
  }
}

export function loadGameState(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVE);
    if (!raw) return null;
    return JSON.parse(raw) as SavedGameState;
  } catch {
    return null;
  }
}

export function clearSavedGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SAVE);
  } catch {}
}

export function loadGameStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function recordMatchWin(winnerId: PlayerId, participatingPlayerIds: PlayerId[]): GameStats {
  const stats = loadGameStats();
  stats.totalMatches += 1;
  stats.totalWins += 1;

  stats.playerWins[winnerId] = (stats.playerWins[winnerId] || 0) + 1;

  participatingPlayerIds.forEach((pid) => {
    stats.playerMatches[pid] = (stats.playerMatches[pid] || 0) + 1;
  });

  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch {}

  return stats;
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {}
}
