import React, { useRef, useState } from 'react';
import { Player, GameMode } from '../types/game';
import { DiceBox } from './DiceBox';
import { sound } from '../utils/audio';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  canRoll: boolean;
  isRolling: boolean;
  diceValue: number | null;
  mode: GameMode;
  alignRight?: boolean;
  onRoll: () => void;
  onSecretUnlocked: (playerId: Player['id']) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isActive,
  canRoll,
  isRolling,
  diceValue,
  mode,
  alignRight = false,
  onRoll,
  onSecretUnlocked
}) => {
  const [longPressProgress, setLongPressProgress] = useState(0);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate completion percentage:
  // Each finished token = 25%. If all 4 finished = 100%.
  // Also add partial progress for tokens moving on the path
  const calculateProgress = () => {
    let totalSteps = 0;
    player.tokens.forEach((t) => {
      if (t.stepIndex === 56) {
        totalSteps += 57;
      } else if (t.stepIndex >= 0) {
        totalSteps += t.stepIndex + 1;
      }
    });
    const maxPossible = 57 * 4;
    return Math.min(100, Math.round((totalSteps / maxPossible) * 100));
  };

  const progressPercent = calculateProgress();

  // Long-press detection on emoji avatar for 3-second secret unlock
  const handleAvatarPressStart = (e: React.SyntheticEvent) => {
    // Prevent default context menus on mobile long-press
    setLongPressProgress(0);
    const startTime = Date.now();

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / 3000) * 100));
      setLongPressProgress(pct);
    }, 40);

    pressTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setLongPressProgress(0);
      onSecretUnlocked(player.id);
      sound.playSecretTap();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
    }, 3000);
  };

  const handleAvatarPressEnd = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setLongPressProgress(0);
  };

  // Avatar background colors
  const avatarBg: Record<string, string> = {
    red: 'bg-red-500',
    green: 'bg-emerald-600',
    blue: 'bg-blue-600',
    yellow: 'bg-amber-400'
  };

  return (
    <div className={`flex flex-col ${alignRight ? 'items-end' : 'items-start'} z-20`}>
      {/* Outer Pod Card */}
      <div
        className={`relative flex items-center gap-2.5 p-2 rounded-2xl transition-all duration-300 select-none
          ${alignRight ? 'flex-row-reverse' : 'flex-row'}
          ${
            isActive
              ? 'bg-[#0E2A66]/90 border-2 border-amber-400 glow-active-turn'
              : 'bg-[#0A1A40]/70 border border-blue-900/60 shadow-md'
          }
        `}
      >
        {/* Avatar Box (3-Second Long Press on this emoji unlocks secret controls) */}
        <div
          onMouseDown={handleAvatarPressStart}
          onMouseUp={handleAvatarPressEnd}
          onMouseLeave={handleAvatarPressEnd}
          onTouchStart={handleAvatarPressStart}
          onTouchEnd={handleAvatarPressEnd}
          onTouchCancel={handleAvatarPressEnd}
          title={player.name}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner relative overflow-hidden border border-white/20 select-none cursor-pointer active:scale-95 transition-transform ${
            avatarBg[player.color]
          } ${
            player.secretUnlocked
              ? 'ring-2 ring-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
              : ''
          }`}
        >
          <span>{player.avatarEmoji}</span>
          {player.isBot && (
            <span className="absolute bottom-0.5 right-0.5 text-[9px] font-black bg-black/60 text-white px-1 rounded pointer-events-none">
              BOT
            </span>
          )}

          {/* 3-Second Charge Progress Line across bottom of avatar */}
          {longPressProgress > 0 && (
            <div
              className="absolute inset-x-0 bottom-0 h-1.5 bg-amber-300 rounded-full transition-all pointer-events-none"
              style={{ width: `${longPressProgress}%` }}
            />
          )}

          {/* Discreet dot when unlocked */}
          {player.secretUnlocked && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_4px_#F59E0B] pointer-events-none" />
          )}
        </div>

        {/* Dice Box */}
        <DiceBox
          value={diceValue}
          isRolling={isRolling}
          isActiveTurn={isActive}
          canRoll={canRoll}
          color={player.color}
          onRoll={onRoll}
        />
      </div>

      {/* Name and Progress percentage */}
      <div
        className={`mt-1 flex items-center gap-1.5 text-xs font-bold ${
          alignRight ? 'flex-row-reverse text-right' : 'flex-row text-left'
        } ${isActive ? 'text-amber-300' : 'text-slate-300'}`}
      >
        <span className="truncate max-w-[85px]">{player.name}</span>
        <span className="font-mono text-amber-400 tabular-nums">
          {progressPercent}%
        </span>
      </div>
    </div>
  );
};
