import React from 'react';
import { Player, PlayerColor, ThemeType } from '../types/game';
import {
  MAIN_PATH,
  COLOR_START_INDICES,
  HOME_STRETCH,
  YARD_POSITIONS
} from '../utils/ludoBoardConstants';
import { ALL_BOARD_SECRET_ZONES } from '../utils/secretZones';
import { Star, ArrowDown, ArrowUp, ArrowRight, ArrowLeft, EyeOff } from 'lucide-react';

interface LudoBoardProps {
  players: Player[];
  activePlayer: Player;
  movableTokenIds: number[];
  theme: ThemeType;
  showSecretZoneHints: boolean;
  onHideDevOverlay?: () => void;
  onSelectToken: (tokenId: number) => void;
  onSecretZoneTap: (playerId: Player['id'], zoneNumber: number) => void;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  activePlayer,
  movableTokenIds,
  theme,
  showSecretZoneHints,
  onHideDevOverlay,
  onSelectToken,
  onSecretZoneTap
}) => {
  // Theme styling adjustments
  const getThemeBoardClass = () => {
    switch (theme) {
      case 'modern':
        return 'bg-[#0f172a] shadow-2xl shadow-cyan-950/80 border-4 border-cyan-500/80 rounded-3xl';
      case 'wooden':
        return 'bg-[#d7b274] shadow-2xl shadow-amber-950 border-8 border-[#5c2c16] rounded-3xl';
      case 'classic':
      default:
        return 'bg-[#F2B705] gold-board-border rounded-3xl';
    }
  };

  // Helper to find all tokens currently on a particular board cell
  const getTokensAtCell = (x: number, y: number) => {
    const tokensHere: { player: Player; tokenId: number; isMovable: boolean }[] = [];

    players.forEach((p) => {
      p.tokens.forEach((t) => {
        let tx = -1;
        let ty = -1;

        if (t.stepIndex === -1) {
          const yard = YARD_POSITIONS[p.color][t.id];
          tx = yard.x;
          ty = yard.y;
        } else if (t.stepIndex >= 0 && t.stepIndex <= 50) {
          const globalIdx = (COLOR_START_INDICES[p.color] + t.stepIndex) % 52;
          const coord = MAIN_PATH[globalIdx];
          tx = coord.x;
          ty = coord.y;
        } else if (t.stepIndex >= 51 && t.stepIndex <= 56) {
          const coord = HOME_STRETCH[p.color][t.stepIndex - 51];
          tx = coord.x;
          ty = coord.y;
        }

        if (Math.abs(tx - x) < 0.35 && Math.abs(ty - y) < 0.35) {
          const isMovable = p.id === activePlayer.id && movableTokenIds.includes(t.id);
          tokensHere.push({ player: p, tokenId: t.id, isMovable });
        }
      });
    });

    return tokensHere;
  };

  // Render a 3D Teardrop Jewel Pawn matching the reference screenshot
  const renderPawn = (color: PlayerColor, isMovable: boolean, count?: number) => {
    return (
      <div
        className={`relative flex items-center justify-center transition-all select-none ${
          isMovable
            ? 'token-bounce cursor-pointer z-40 scale-115 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]'
            : 'z-20 hover:scale-105'
        }`}
        style={{ width: '32px', height: '36px' }}
      >
        {/* Pulsing selection aura when movable */}
        {isMovable && (
          <span className="absolute -inset-1 rounded-full border-2 border-amber-400 animate-ping opacity-75 pointer-events-none" />
        )}

        <svg
          viewBox="0 0 36 44"
          className="w-full h-full overflow-visible drop-shadow-[0_5px_7px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Metallic chrome gradient for pin body */}
            <linearGradient id={`chromeGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="28%" stopColor="#F8FAFC" />
              <stop offset="65%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Base Ring Gradient */}
            <linearGradient id={`baseGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="45%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Jewel Gradients for Red, Green, Blue, Yellow with rich radial glow */}
            <radialGradient id={`jewel-${color}`} cx="32%" cy="28%" r="68%">
              {color === 'red' && (
                <>
                  <stop offset="0%" stopColor="#FFA4A4" />
                  <stop offset="30%" stopColor="#EF4444" />
                  <stop offset="70%" stopColor="#B91C1C" />
                  <stop offset="100%" stopColor="#581010" />
                </>
              )}
              {color === 'green' && (
                <>
                  <stop offset="0%" stopColor="#A7F3D0" />
                  <stop offset="30%" stopColor="#10B981" />
                  <stop offset="70%" stopColor="#047857" />
                  <stop offset="100%" stopColor="#023924" />
                </>
              )}
              {color === 'blue' && (
                <>
                  <stop offset="0%" stopColor="#BAE6FD" />
                  <stop offset="30%" stopColor="#38BDF8" />
                  <stop offset="70%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#083B5A" />
                </>
              )}
              {color === 'yellow' && (
                <>
                  <stop offset="0%" stopColor="#FEF9C3" />
                  <stop offset="30%" stopColor="#FACC15" />
                  <stop offset="70%" stopColor="#CA8A04" />
                  <stop offset="100%" stopColor="#5E3804" />
                </>
              )}
            </radialGradient>
          </defs>

          {/* Board Ground Contact Shadow */}
          <ellipse cx="18" cy="40.5" rx="10" ry="3.2" fill="rgba(0,0,0,0.38)" />

          {/* Pedestal Base Collar Ring */}
          <ellipse cx="18" cy="38" rx="8.5" ry="2.9" fill={`url(#baseGrad-${color})`} stroke="#CBD5E1" strokeWidth="0.9" />
          <ellipse cx="18" cy="37" rx="6.8" ry="2" fill={`url(#chromeGrad-${color})`} opacity="0.9" />

          {/* 3D Teardrop Pointer Body */}
          <path
            d="M18 2 C8.5 2 2 8.5 2 17.5 C2 25 12.5 34 18 39 C23.5 34 34 25 34 17.5 C34 8.5 27.5 2 18 2 Z"
            fill={`url(#chromeGrad-${color})`}
            stroke="#334155"
            strokeWidth="1.2"
          />

          {/* Subtle Inner Highlight Contour */}
          <path
            d="M18 3.5 C9.5 3.5 3.8 9.5 3.8 17.5 C3.8 24 13 32.5 18 37 C23 32.5 32.2 24 32.2 17.5 C32.2 9.5 26.5 3.5 18 3.5 Z"
            fill="none"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="0.8"
          />

          {/* Chrome Inner Bezel Ring */}
          <circle cx="18" cy="17" r="11" fill="#1E293B" stroke="#E2E8F0" strokeWidth="1" />

          {/* Vibrant Glowing Jewel Sphere */}
          <circle cx="18" cy="17" r="9.3" fill={`url(#jewel-${color})`} />

          {/* Curved Crescent Glass Reflection */}
          <ellipse
            cx="14.8"
            cy="12.8"
            rx="4.6"
            ry="2.2"
            fill="#FFFFFF"
            opacity="0.88"
            transform="rotate(-28 14.8 12.8)"
          />

          {/* Sparkling Pinpoint Specular Dot */}
          <circle cx="13" cy="11.2" r="1" fill="#FFFFFF" opacity="0.95" />

          {/* Bottom Ambient Occlusion on Jewel Sphere */}
          <ellipse cx="20" cy="22" rx="4.5" ry="1.8" fill="rgba(0,0,0,0.3)" />
        </svg>

        {/* Counter Badge if multiple pawns share the square */}
        {count && count > 1 && (
          <span className="absolute -top-1.5 -right-1.5 bg-slate-950 text-amber-300 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-400 shadow-md">
            {count}
          </span>
        )}
      </div>
    );
  };

  // Render 6x6 Home Yard for each player
  const renderHomeYard = (playerColor: PlayerColor) => {
    const colorStyles: Record<
      PlayerColor,
      { bg: string; ring: string; yardBg: string }
    > = {
      red: { bg: 'bg-[#DC2626]', ring: 'border-red-400', yardBg: 'bg-white' },
      green: { bg: 'bg-[#16A34A]', ring: 'border-emerald-400', yardBg: 'bg-white' },
      blue: { bg: 'bg-[#2563EB]', ring: 'border-blue-400', yardBg: 'bg-white' },
      yellow: { bg: 'bg-[#EAB308]', ring: 'border-amber-400', yardBg: 'bg-white' }
    };

    const style = colorStyles[playerColor];
    const playerObj = players.find((p) => p.color === playerColor);

    return (
      <div className={`relative w-full h-full p-2.5 ${style.bg} flex items-center justify-center select-none`}>
        <div className={`w-full h-full ${style.yardBg} rounded-2xl shadow-inner grid grid-cols-2 grid-rows-2 p-3 gap-3 border-2 border-slate-200/50`}>
          {[0, 1, 2, 3].map((slotIdx) => {
            const token = playerObj?.tokens.find((t) => t.id === slotIdx);
            const inYard = token ? token.stepIndex === -1 : false;
            const isMovable =
              playerObj?.id === activePlayer.id &&
              inYard &&
              movableTokenIds.includes(slotIdx);

            return (
              <div
                key={slotIdx}
                onClick={
                  isMovable && playerObj
                    ? () => onSelectToken(slotIdx)
                    : undefined
                }
                className={`rounded-full border-4 ${style.ring} bg-slate-50 flex items-center justify-center relative shadow-inner ${
                  isMovable ? 'cursor-pointer' : ''
                }`}
              >
                {inYard && renderPawn(playerColor, isMovable)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render individual 15x15 track cell
  const renderCell = (x: number, y: number) => {
    const isRedStart = x === 1 && y === 6;
    const isGreenStart = x === 8 && y === 1;
    const isYellowStart = x === 13 && y === 8;
    const isBlueStart = x === 6 && y === 13;

    const isRedHomeStretch = y === 7 && x >= 1 && x <= 5;
    const isGreenHomeStretch = x === 7 && y >= 1 && y <= 5;
    const isYellowHomeStretch = y === 7 && x >= 9 && x <= 13;
    const isBlueHomeStretch = x === 7 && y >= 9 && y <= 13;

    const isStarCell =
      (x === 6 && y === 2) ||
      (x === 12 && y === 6) ||
      (x === 8 && y === 12) ||
      (x === 2 && y === 8);

    const isRedArrow = x === 0 && y === 7;
    const isGreenArrow = x === 7 && y === 0;
    const isYellowArrow = x === 14 && y === 7;
    const isBlueArrow = x === 7 && y === 14;

    const tokensOnCell = getTokensAtCell(x, y);

    let cellBg = 'bg-white';
    if (isRedStart || isRedHomeStretch) cellBg = 'bg-[#DC2626]';
    if (isGreenStart || isGreenHomeStretch) cellBg = 'bg-[#16A34A]';
    if (isYellowStart || isYellowHomeStretch) cellBg = 'bg-[#EAB308]';
    if (isBlueStart || isBlueHomeStretch) cellBg = 'bg-[#2563EB]';

    return (
      <div
        key={`cell-${x}-${y}`}
        style={{
          gridColumnStart: x + 1,
          gridRowStart: y + 1
        }}
        className={`w-full h-full border-[0.5px] border-slate-300 relative flex items-center justify-center ${cellBg}`}
      >
        {isStarCell && (
          <Star className="w-4 h-4 text-slate-400 stroke-[1.5] fill-transparent pointer-events-none" />
        )}
        {isGreenArrow && (
          <ArrowDown className="w-4 h-4 text-emerald-600 font-bold stroke-[3]" />
        )}
        {isRedArrow && (
          <ArrowRight className="w-4 h-4 text-red-600 font-bold stroke-[3]" />
        )}
        {isYellowArrow && (
          <ArrowLeft className="w-4 h-4 text-amber-500 font-bold stroke-[3]" />
        )}
        {isBlueArrow && (
          <ArrowUp className="w-4 h-4 text-blue-600 font-bold stroke-[3]" />
        )}

        {tokensOnCell.length > 0 && (
          <div
            onClick={
              tokensOnCell.some((t) => t.isMovable)
                ? () => {
                    const movable = tokensOnCell.find((t) => t.isMovable);
                    if (movable) onSelectToken(movable.tokenId);
                  }
                : undefined
            }
            className={`w-full h-full flex items-center justify-center ${
              tokensOnCell.some((t) => t.isMovable) ? 'cursor-pointer' : ''
            }`}
          >
            {renderPawn(
              tokensOnCell[0].player.color,
              tokensOnCell.some((t) => t.isMovable),
              tokensOnCell.length
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[430px] aspect-square mx-auto p-2 select-none relative">
      {/* Optional Top Dismiss Bar for PIN 6607 Calibration Mode */}
      {showSecretZoneHints && onHideDevOverlay && (
        <div
          onClick={onHideDevOverlay}
          className="absolute -top-6 inset-x-4 bg-amber-400 text-slate-950 font-black text-[10px] py-1 px-3 rounded-full flex items-center justify-between shadow-lg cursor-pointer z-50 animate-bounce"
        >
          <span>PIN 6607 Calibration Overlay Active</span>
          <span className="flex items-center gap-1 font-semibold underline">
            <EyeOff className="w-3 h-3" /> Hide
          </span>
        </div>
      )}

      {/* Board Outer Container */}
      <div
        className={`w-full h-full p-2.5 relative overflow-hidden transition-all duration-300 ${getThemeBoardClass()}`}
      >
        {/* Main 15x15 Grid with relative positioning for board-level secret touch targets */}
        <div className="w-full h-full grid grid-cols-15 grid-rows-15 bg-white rounded-2xl overflow-hidden shadow-inner relative border border-slate-300">
          {/* Top-Left: Red Yard (6x6) */}
          <div className="col-start-1 col-end-7 row-start-1 row-end-7">
            {renderHomeYard('red')}
          </div>

          {/* Top-Right: Green Yard (6x6) */}
          <div className="col-start-10 col-end-16 row-start-1 row-end-7">
            {renderHomeYard('green')}
          </div>

          {/* Bottom-Left: Blue Yard (6x6) */}
          <div className="col-start-1 col-end-7 row-start-10 row-end-16">
            {renderHomeYard('blue')}
          </div>

          {/* Bottom-Right: Yellow Yard (6x6) */}
          <div className="col-start-10 col-end-16 row-start-10 row-end-16">
            {renderHomeYard('yellow')}
          </div>

          {/* Top Arm (Columns 7,8,9, Rows 1-6) */}
          {Array.from({ length: 6 }).map((_, r) =>
            [6, 7, 8].map((c) => renderCell(c, r))
          )}

          {/* Bottom Arm (Columns 7,8,9, Rows 10-15) */}
          {Array.from({ length: 6 }).map((_, r) =>
            [6, 7, 8].map((c) => renderCell(c, r + 9))
          )}

          {/* Left Arm (Columns 1-6, Rows 7,8,9) */}
          {Array.from({ length: 6 }).map((_, c) =>
            [6, 7, 8].map((r) => renderCell(c, r))
          )}

          {/* Right Arm (Columns 10-15, Rows 7,8,9) */}
          {Array.from({ length: 6 }).map((_, c) =>
            [6, 7, 8].map((r) => renderCell(c + 9, r))
          )}

          {/* Center 3x3 Finish Area with 4 Triangles */}
          <div className="col-start-7 col-end-10 row-start-7 row-end-10 relative overflow-hidden border border-slate-300">
            <div
              className="absolute inset-0 bg-[#DC2626]"
              style={{ clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)' }}
            />
            <div
              className="absolute inset-0 bg-[#16A34A]"
              style={{ clipPath: 'polygon(0% 0%, 50% 50%, 100% 0%)' }}
            />
            <div
              className="absolute inset-0 bg-[#EAB308]"
              style={{ clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)' }}
            />
            <div
              className="absolute inset-0 bg-[#2563EB]"
              style={{ clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)' }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-amber-400 shadow-md flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {players.map((p) => {
                const finishedCount = p.tokens.filter(
                  (t) => t.stepIndex === 56
                ).length;
                if (finishedCount === 0) return null;
                return (
                  <span
                    key={`center-${p.id}`}
                    className="absolute text-[10px] font-black text-white px-1 rounded-full shadow"
                    style={{
                      top:
                        p.color === 'green'
                          ? '12%'
                          : p.color === 'blue'
                          ? '68%'
                          : '40%',
                      left:
                        p.color === 'red'
                          ? '12%'
                          : p.color === 'yellow'
                          ? '68%'
                          : '40%'
                    }}
                  >
                    🏆{finishedCount}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ============================================================== */}
          {/* ALL 24 SECRET TOUCH ZONES MOUNTED DIRECTLY ON THE 15x15 BOARD  */}
          {/* Exact 1-to-1 matching with handwritten numbers in screenshot   */}
          {/* ============================================================== */}
          {ALL_BOARD_SECRET_ZONES.map((zone) => {
            return (
              <div
                key={`${zone.playerId}-${zone.zoneNumber}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSecretZoneTap(zone.playerId, zone.zoneNumber);
                }}
                style={{
                  position: 'absolute',
                  left: zone.left,
                  top: zone.top,
                  transform: 'translate(-50%, -50%)',
                  width: '11.5%',
                  height: '11.5%'
                }}
                className={`z-40 cursor-pointer select-none rounded-xl flex items-center justify-center transition-all ${
                  showSecretZoneHints
                    ? 'bg-amber-300/40 border-2 border-slate-900 shadow-lg'
                    : 'bg-transparent active:bg-amber-400/20'
                }`}
                title={`Zone ${zone.zoneNumber} (${zone.color})`}
              >
                {/* When password 6607 is entered, display handwritten style number */}
                {showSecretZoneHints && (
                  <span
                    className="text-2xl font-black text-slate-950 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]"
                    style={{
                      fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
                    }}
                  >
                    {zone.zoneNumber}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
