import React, { useState } from 'react';
import { Player } from '../types/game';
import { Sparkles, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface SecretCheatBarProps {
  humanPlayer: Player | undefined;
  onSelectNumber: (num: number) => void;
}

export const SecretCheatBar: React.FC<SecretCheatBarProps> = ({
  humanPlayer,
  onSelectNumber
}) => {
  const [collapsed, setCollapsed] = useState(false);

  if (!humanPlayer) return null;

  const currentPending = humanPlayer.pendingDiceNumber;

  const handlePick = (num: number) => {
    sound.playSecretTap();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
    onSelectNumber(num);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-3 mb-1 z-30">
      <div className="bg-[#06102B]/95 border border-amber-400/50 rounded-2xl p-2 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between px-1 mb-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Secret Control (সিক্রেট ডাইস):</span>
            {currentPending !== null ? (
              <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded text-[10px] flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> Next: {currentPending}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">Tap 1-6 below</span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1"
          >
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="grid grid-cols-6 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => handlePick(num)}
                className={`py-1.5 rounded-xl text-xs font-black transition active:scale-95 border ${
                  currentPending === num
                    ? 'bg-gradient-to-t from-amber-500 to-yellow-400 text-slate-950 border-white shadow-md'
                    : 'bg-black/50 text-white border-blue-900/60 hover:border-amber-400/50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
