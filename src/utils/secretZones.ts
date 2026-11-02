import { PlayerColor, PlayerId } from '../types/game';

export interface BoardSecretZone {
  playerId: PlayerId;
  color: PlayerColor;
  zoneNumber: number; // 1 to 6
  left: string; // percentage string relative to entire board container
  top: string;
  label: string;
}

/**
 * Exact board-relative coordinates for all 6 Secret Zones per player quadrant.
 * Matched 1-to-1 with the handwritten numbers in the reference screenshot.
 *
 * BLUE (Bottom-Left Quadrant, 0% to 40% X, 60% to 100% Y):
 * 1: Top Edge Center (between top tokens) -> left: 20%, top: 59.5%
 * 2: Left Edge, upper level -> left: 3.5%, top: 72%
 * 3: Right Edge, upper level -> left: 36.5%, top: 72%
 * 4: Left Edge, lower level -> left: 3.5%, top: 85.5%
 * 5: Right Edge, lower level -> left: 36.5%, top: 85.5%
 * 6: Bottom Edge Center -> left: 20%, top: 97%
 *
 * YELLOW (Bottom-Right Quadrant, 60% to 100% X, 60% to 100% Y):
 * 1: Top Edge Center -> left: 80%, top: 59.5%
 * 2: Left Edge, upper level -> left: 63.5%, top: 72%
 * 3: Right Edge, upper level -> left: 96.5%, top: 72%
 * 4: Left Edge, lower level -> left: 63.5%, top: 85.5%
 * 5: Right Edge, lower level -> left: 96.5%, top: 85.5%
 * 6: Bottom Edge Center -> left: 80%, top: 97%
 *
 * RED (Top-Left Quadrant, 0% to 40% X, 0% to 40% Y):
 * 1: Bottom Edge Center (above red track) -> left: 20%, top: 40%
 * 2: Right Edge, lower level -> left: 36.5%, top: 26%
 * 3: Left Edge, lower level -> left: 3.5%, top: 26%
 * 4: Right Edge, upper level -> left: 36.5%, top: 12.5%
 * 5: Left Edge, upper level -> left: 3.5%, top: 12.5%
 * 6: Top Edge Center -> left: 20%, top: 3.5%
 *
 * GREEN (Top-Right Quadrant, 60% to 100% X, 0% to 40% Y):
 * 1: Bottom Edge Center (above track/star) -> left: 80%, top: 40%
 * 2: Right Edge, lower level -> left: 96.5%, top: 26%
 * 3: Left Edge, lower level -> left: 63.5%, top: 26%
 * 4: Right Edge, upper level -> left: 96.5%, top: 12.5%
 * 5: Left Edge, upper level -> left: 63.5%, top: 12.5%
 * 6: Top Edge Center -> left: 80%, top: 3.5%
 */
export const ALL_BOARD_SECRET_ZONES: BoardSecretZone[] = [
  // --- BLUE (P3) ---
  { playerId: 'P3', color: 'blue', zoneNumber: 1, left: '20%', top: '59.5%', label: 'Top Center' },
  { playerId: 'P3', color: 'blue', zoneNumber: 2, left: '3.5%', top: '72%', label: 'Upper Left' },
  { playerId: 'P3', color: 'blue', zoneNumber: 3, left: '36.5%', top: '72%', label: 'Upper Right' },
  { playerId: 'P3', color: 'blue', zoneNumber: 4, left: '3.5%', top: '85.5%', label: 'Lower Left' },
  { playerId: 'P3', color: 'blue', zoneNumber: 5, left: '36.5%', top: '85.5%', label: 'Lower Right' },
  { playerId: 'P3', color: 'blue', zoneNumber: 6, left: '20%', top: '97%', label: 'Bottom Center' },

  // --- YELLOW (P4) ---
  { playerId: 'P4', color: 'yellow', zoneNumber: 1, left: '80%', top: '59.5%', label: 'Top Center' },
  { playerId: 'P4', color: 'yellow', zoneNumber: 2, left: '63.5%', top: '72%', label: 'Upper Left' },
  { playerId: 'P4', color: 'yellow', zoneNumber: 3, left: '96.5%', top: '72%', label: 'Upper Right' },
  { playerId: 'P4', color: 'yellow', zoneNumber: 4, left: '63.5%', top: '85.5%', label: 'Lower Left' },
  { playerId: 'P4', color: 'yellow', zoneNumber: 5, left: '96.5%', top: '85.5%', label: 'Lower Right' },
  { playerId: 'P4', color: 'yellow', zoneNumber: 6, left: '80%', top: '97%', label: 'Bottom Center' },

  // --- RED (P1) ---
  { playerId: 'P1', color: 'red', zoneNumber: 1, left: '20%', top: '40%', label: 'Bottom Center' },
  { playerId: 'P1', color: 'red', zoneNumber: 2, left: '36.5%', top: '26%', label: 'Lower Right' },
  { playerId: 'P1', color: 'red', zoneNumber: 3, left: '3.5%', top: '26%', label: 'Lower Left' },
  { playerId: 'P1', color: 'red', zoneNumber: 4, left: '36.5%', top: '12.5%', label: 'Upper Right' },
  { playerId: 'P1', color: 'red', zoneNumber: 5, left: '3.5%', top: '12.5%', label: 'Upper Left' },
  { playerId: 'P1', color: 'red', zoneNumber: 6, left: '20%', top: '3.5%', label: 'Top Center' },

  // --- GREEN (P2) ---
  { playerId: 'P2', color: 'green', zoneNumber: 1, left: '80%', top: '40%', label: 'Bottom Center' },
  { playerId: 'P2', color: 'green', zoneNumber: 2, left: '96.5%', top: '26%', label: 'Lower Right' },
  { playerId: 'P2', color: 'green', zoneNumber: 3, left: '63.5%', top: '26%', label: 'Lower Left' },
  { playerId: 'P2', color: 'green', zoneNumber: 4, left: '96.5%', top: '12.5%', label: 'Upper Right' },
  { playerId: 'P2', color: 'green', zoneNumber: 5, left: '63.5%', top: '12.5%', label: 'Upper Left' },
  { playerId: 'P2', color: 'green', zoneNumber: 6, left: '80%', top: '3.5%', label: 'Top Center' }
];
