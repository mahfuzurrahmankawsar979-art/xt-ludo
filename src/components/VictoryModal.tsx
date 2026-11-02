import React, { useEffect } from 'react';
import { Player } from '../types/game';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  winner: Player;
  onPlayAgain: () => void;
  onExitToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  onPlayAgain,
  onExitToMenu
}) => {
  useEffect(() => {
    // Fire festive fireworks confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FF3366', '#00E676', '#1E88E5']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FF3366', '#00E676', '#1E88E5']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const colorBg: Record<string, string> = {
    red: 'from-red-600 to-rose-700',
    green: 'from-emerald-600 to-green-700',
    blue: 'from-blue-600 to-indigo-700',
    yellow: 'from-amber-500 to-yellow-600'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#06102B] border-3 border-amber-400 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
        {/* Glow backdrop */}
        <div className="absolute top-0 inset-x-0 h-32 bg-amber-500/20 blur-2xl pointer-events-none" />

        {/* Golden Trophy */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-100 flex items-center justify-center shadow-xl shadow-amber-500/40 border-2 border-white mb-3">
          <Trophy className="w-10 h-10 text-amber-900 fill-amber-900" />
        </div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-300 to-yellow-600 font-['Outfit'] tracking-wider">
          VICTORY!
        </h2>
        <p className="text-xs text-blue-200 font-semibold tracking-wider mt-0.5">
          CHAMPION OF XT LUDO
        </p>

        {/* Winner Card */}
        <div
          className={`mt-4 w-full py-3 px-4 rounded-2xl bg-gradient-to-r ${
            colorBg[winner.color]
          } text-white shadow-lg border border-white/30 flex items-center justify-center gap-3`}
        >
          <span className="text-3xl drop-shadow">{winner.avatarEmoji}</span>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-black/50 text-amber-300">
                {winner.id}
              </span>
              <span className="text-base font-black truncate max-w-[140px]">
                {winner.name}
              </span>
            </div>
            <p className="text-[11px] text-white/80 font-medium">
              Finished all 4 tokens first!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-6 flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm tracking-wider shadow-lg border-2 border-yellow-200 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            PLAY AGAIN
          </button>

          <button
            onClick={onExitToMenu}
            className="w-full py-3 rounded-2xl bg-[#0D245E] hover:bg-[#123180] text-blue-100 font-bold text-xs tracking-wide border border-blue-700/60 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-400" />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
