import { PlayerColor } from '../types/game';

export interface GridCoord {
  x: number;
  y: number;
}

// 52 Main Path Cell Coordinates (Clockwise starting at Red's entry point (1, 6))
export const MAIN_PATH: GridCoord[] = [
  /* 0 - Red Start */ { x: 1, y: 6 },
  /* 1 */ { x: 2, y: 6 },
  /* 2 */ { x: 3, y: 6 },
  /* 3 */ { x: 4, y: 6 },
  /* 4 */ { x: 5, y: 6 },
  /* 5 */ { x: 6, y: 5 },
  /* 6 */ { x: 6, y: 4 },
  /* 7 */ { x: 6, y: 3 },
  /* 8 - Safe Star */ { x: 6, y: 2 },
  /* 9 */ { x: 6, y: 1 },
  /* 10 */ { x: 6, y: 0 },
  /* 11 */ { x: 7, y: 0 },
  /* 12 */ { x: 8, y: 0 },
  /* 13 - Green Start */ { x: 8, y: 1 },
  /* 14 */ { x: 8, y: 2 },
  /* 15 */ { x: 8, y: 3 },
  /* 16 */ { x: 8, y: 4 },
  /* 17 */ { x: 8, y: 5 },
  /* 18 */ { x: 9, y: 6 },
  /* 19 */ { x: 10, y: 6 },
  /* 20 */ { x: 11, y: 6 },
  /* 21 - Safe Star */ { x: 12, y: 6 },
  /* 22 */ { x: 13, y: 6 },
  /* 23 */ { x: 14, y: 6 },
  /* 24 */ { x: 14, y: 7 },
  /* 25 */ { x: 14, y: 8 },
  /* 26 - Yellow Start */ { x: 13, y: 8 },
  /* 27 */ { x: 12, y: 8 },
  /* 28 */ { x: 11, y: 8 },
  /* 29 */ { x: 10, y: 8 },
  /* 30 */ { x: 9, y: 8 },
  /* 31 */ { x: 8, y: 9 },
  /* 32 */ { x: 8, y: 10 },
  /* 33 */ { x: 8, y: 11 },
  /* 34 - Safe Star */ { x: 8, y: 12 },
  /* 35 */ { x: 8, y: 13 },
  /* 36 */ { x: 8, y: 14 },
  /* 37 */ { x: 7, y: 14 },
  /* 38 */ { x: 6, y: 14 },
  /* 39 - Blue Start */ { x: 6, y: 13 },
  /* 40 */ { x: 6, y: 12 },
  /* 41 */ { x: 6, y: 11 },
  /* 42 */ { x: 6, y: 10 },
  /* 43 */ { x: 6, y: 9 },
  /* 44 */ { x: 5, y: 8 },
  /* 45 */ { x: 4, y: 8 },
  /* 46 */ { x: 3, y: 8 },
  /* 47 - Safe Star */ { x: 2, y: 8 },
  /* 48 */ { x: 1, y: 8 },
  /* 49 */ { x: 0, y: 8 },
  /* 50 */ { x: 0, y: 7 },
  /* 51 */ { x: 0, y: 6 }
];

// Color start offsets on MAIN_PATH
export const COLOR_START_INDICES: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

// Safe Indices on MAIN_PATH (cannot be captured)
export const SAFE_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// 5 Home Stretch cells + 1 Center Finish cell for each color
export const HOME_STRETCH: Record<PlayerColor, GridCoord[]> = {
  red: [
    { x: 1, y: 7 },
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
    { x: 6, y: 7 } // Final Home
  ],
  green: [
    { x: 7, y: 1 },
    { x: 7, y: 2 },
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    { x: 7, y: 5 },
    { x: 7, y: 6 } // Final Home
  ],
  yellow: [
    { x: 13, y: 7 },
    { x: 12, y: 7 },
    { x: 11, y: 7 },
    { x: 10, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 7 } // Final Home
  ],
  blue: [
    { x: 7, y: 13 },
    { x: 7, y: 12 },
    { x: 7, y: 11 },
    { x: 7, y: 10 },
    { x: 7, y: 9 },
    { x: 7, y: 8 } // Final Home
  ]
};

// Home Yard Token Positions (when stepIndex === -1)
export const YARD_POSITIONS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { x: 1.8, y: 1.8 },
    { x: 3.8, y: 1.8 },
    { x: 1.8, y: 3.8 },
    { x: 3.8, y: 3.8 }
  ],
  green: [
    { x: 10.8, y: 1.8 },
    { x: 12.8, y: 1.8 },
    { x: 10.8, y: 3.8 },
    { x: 12.8, y: 3.8 }
  ],
  blue: [
    { x: 1.8, y: 10.8 },
    { x: 3.8, y: 10.8 },
    { x: 1.8, y: 12.8 },
    { x: 3.8, y: 12.8 }
  ],
  yellow: [
    { x: 10.8, y: 10.8 },
    { x: 12.8, y: 10.8 },
    { x: 10.8, y: 12.8 },
    { x: 12.8, y: 12.8 }
  ]
};

// Return the (x, y) board coordinate for a token
export function getTokenCoordinate(color: PlayerColor, tokenId: number, stepIndex: number): GridCoord {
  if (stepIndex === -1) {
    return YARD_POSITIONS[color][tokenId];
  }
  if (stepIndex >= 0 && stepIndex <= 50) {
    const globalIdx = (COLOR_START_INDICES[color] + stepIndex) % 52;
    return MAIN_PATH[globalIdx];
  }
  if (stepIndex >= 51 && stepIndex <= 56) {
    const homeIndex = stepIndex - 51;
    return HOME_STRETCH[color][homeIndex];
  }
  // Default to final home
  return HOME_STRETCH[color][5];
}

// Convert board coordinate (0..15) into percentage for absolute positioning
export function toPercent(coord: number): string {
  return `${(coord / 15) * 100}%`;
}
