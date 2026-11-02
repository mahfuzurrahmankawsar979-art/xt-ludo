import React from 'react';
import { ThemeType } from '../types/game';
import { Play, RotateCcw, BarChart3, Palette, BookOpen } from 'lucide-react';

interface TitleScreenProps {
  hasSavedGame: boolean;
  theme: ThemeType;
  onStartNewGame: () => void;
  onOpenVSComputer: () => void;
  onResumeGame: () => void;
  onOpenStats: () => void;
  onOpenThemes: () => void;
  onOpenRules: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  hasSavedGame,
  theme,
  onStartNewGame,
  onOpenVSComputer,
  onResumeGame,
  onOpenStats,
  onOpenThemes,
  onOpenRules,
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between px-4 py-8 z-10 relative">
      {/* Brand Header */}
      <div className="flex flex-col items-center mt-6">
        {/* Logo Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-1 shadow-2xl shadow-amber-500/30 flex items-center justify-center border-2 border-yellow-200">
          <div className="w-full h-full bg-[#06102B] rounded-2xl flex items-center justify-center relative overflow-hidden">
            <span className="text-3xl">🎲</span>
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-3 text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-600 drop-shadow-lg font-['Outfit']">
          XT LUDO
        </h1>
        <p className="text-xs text-blue-200 font-medium tracking-wider mt-0.5">
          OFFLINE MULTIPLAYER BOARD GAME
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="w-full max-w-xs flex flex-col gap-3 my-4">
        {/* Play vs Computer */}
        <button
          onClick={onOpenVSComputer}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-black text-base tracking-wider shadow-xl shadow-purple-600/30 border-2 border-purple-300 active:scale-98 transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-xl">🤖</span>
          PLAY VS COMPUTER
        </button>

        {/* Local Pass & Play */}
        <button
          onClick={onStartNewGame}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm tracking-wider shadow-lg shadow-amber-500/20 border-2 border-yellow-200 active:scale-98 transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          PASS & PLAY (স্থানীয় খেলা)
        </button>

        {/* Resume Game */}
        {hasSavedGame && (
          <button
            onClick={onResumeGame}
            className="w-full py-3 rounded-2xl bg-[#0E2A66] hover:bg-[#123680] text-amber-300 font-bold text-xs tracking-wide border-2 border-[#E5A93C] shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            RESUME SAVED MATCH
          </button>
        )}


        {/* Grid of secondary actions (clean, no secret references) */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          <button
            onClick={onOpenStats}
            className="py-3 px-2 rounded-xl bg-[#08153A] border border-blue-800/80 hover:bg-[#0c1f54] text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Statistics</span>
          </button>
          <button
            onClick={onOpenThemes}
            className="py-3 px-2 rounded-xl bg-[#08153A] border border-blue-800/80 hover:bg-[#0c1f54] text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Themes</span>
          </button>
          <button
            onClick={onOpenRules}
            className="py-3 px-2 rounded-xl bg-[#08153A] border border-blue-800/80 hover:bg-[#0c1f54] text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Rules</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-blue-300/60 pb-2">
        <p>100% Offline · No Internet Required</p>
        <p className="mt-0.5">XT LUDO Android Edition v1.0</p>
      </div>
    </div>
  );
};
