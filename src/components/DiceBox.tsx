import React from 'react';
import { PlayerColor } from '../types/game';

interface DiceBoxProps {
  value: number | null;
  isRolling: boolean;
  isActiveTurn: boolean;
  canRoll: boolean;
  color: PlayerColor;
  onRoll: () => void;
}

export const DiceBox: React.FC<DiceBoxProps> = ({
  value,
  isRolling,
  isActiveTurn,
  canRoll,
  color,
  onRoll
}) => {
  // Render dice pips according to standard dice numbers 1 to 6
  const renderPips = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-sm" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 self-start" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 self-start" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 self-center" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5 relative">
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>
            <div className="flex justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full flex flex-col justify-between p-1.5">
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            </div>
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            </div>
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={canRoll ? onRoll : undefined}
      disabled={!canRoll && !isRolling}
      aria-label="Roll Dice"
      className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center select-none shadow-md
        ${
          isActiveTurn && canRoll
            ? 'bg-white border-amber-400 cursor-pointer scale-105 shadow-amber-400/50 shadow-lg animate-pulse'
            : value !== null
            ? 'bg-white border-slate-300'
            : 'bg-white/10 border-white/20'
        }
        ${isRolling ? 'dice-rolling bg-amber-50' : ''}
      `}
    >
      {isRolling ? (
        <span className="text-xl font-bold text-amber-600">🎲</span>
      ) : value !== null ? (
        renderPips(value)
      ) : (
        <span className="text-xs text-white/40 font-mono">DICE</span>
      )}
    </button>
  );
};
