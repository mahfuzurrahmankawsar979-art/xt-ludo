import React from 'react';
import { GameStats, PlayerId } from '../types/game';
import { X, Trophy, Swords, Percent } from 'lucide-react';

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const playerColors: Record<PlayerId, { name: string; color: string; border: string }> = {
    P1: { name: 'Player 1 (Red)', color: 'text-red-400', border: 'border-red-500/40' },
    P2: { name: 'Player 2 (Green)', color: 'text-emerald-400', border: 'border-emerald-500/40' },
    P3: { name: 'Player 3 (Blue)', color: 'text-blue-400', border: 'border-blue-500/40' },
    P4: { name: 'Player 4 (Yellow)', color: 'text-amber-400', border: 'border-amber-500/40' }
  };

  const winRate =
    stats.totalMatches > 0
      ? Math.round((stats.totalWins / stats.totalMatches) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#08153A] border-2 border-amber-400 rounded-3xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center pb-4 border-b border-blue-900/60">
          <h2 className="text-2xl font-black text-amber-300 font-['Outfit'] tracking-wider">
            STATISTICS
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Offline Match Records
          </p>
        </div>

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="p-3 rounded-2xl bg-[#06102B] border border-blue-900 flex flex-col items-center">
            <Swords className="w-5 h-5 text-blue-400 mb-1" />
            <span className="text-[11px] text-slate-400 font-medium">Total Matches</span>
            <span className="text-xl font-black text-white font-mono tabular-nums">
              {stats.totalMatches}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#06102B] border border-blue-900 flex flex-col items-center">
            <Trophy className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[11px] text-slate-400 font-medium">Completed Wins</span>
            <span className="text-xl font-black text-amber-400 font-mono tabular-nums">
              {stats.totalWins}
            </span>
          </div>
        </div>

        {/* Player-wise Breakdown */}
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
            Player ID Breakdown
          </span>

          {(['P1', 'P2', 'P3', 'P4'] as PlayerId[]).map((pid) => {
            const meta = playerColors[pid];
            const wins = stats.playerWins[pid] || 0;
            const matches = stats.playerMatches[pid] || 0;
            const rate = matches > 0 ? Math.round((wins / matches) * 100) : 0;

            return (
              <div
                key={pid}
                className={`flex items-center justify-between p-2.5 rounded-xl bg-black/40 border ${meta.border}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black font-mono px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-400/30">
                    {pid}
                  </span>
                  <span className={`text-xs font-bold ${meta.color}`}>
                    {meta.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-300">
                    <strong className="text-amber-400">{wins}</strong>W / {matches}M
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-200">
                    {rate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-2xl bg-[#0D245E] hover:bg-[#123180] text-blue-100 font-bold text-xs tracking-wider border border-blue-700/60 transition"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
