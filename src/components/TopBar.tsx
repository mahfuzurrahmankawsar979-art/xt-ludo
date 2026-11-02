import React from 'react';
import { Pause, Volume2, VolumeX } from 'lucide-react';

interface TopBarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  onOpenRules: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  soundEnabled,
  onToggleSound,
  onPause,
  onOpenRules
}) => {
  return (
    <div className="w-full max-w-[460px] mx-auto flex items-center justify-between px-3 pt-3 pb-2 z-20">
      {/* Pause Button */}
      <button
        onClick={onPause}
        aria-label="Pause Game"
        className="w-11 h-11 rounded-2xl bg-[#0d2259] border-2 border-[#E5A93C] flex items-center justify-center text-amber-300 shadow-lg active:scale-95 transition-transform"
      >
        <Pause className="w-5 h-5 fill-amber-300 text-amber-300" />
      </button>

      {/* Clean Title */}
      <div className="text-center cursor-pointer" onClick={onOpenRules}>
        <h1 className="text-2xl font-black tracking-wider text-white font-['Outfit'] drop-shadow-md">
          LUDO
        </h1>
        <p className="text-[11px] font-semibold text-blue-200">
          Classic
        </p>
      </div>

      {/* Sound Toggle Button */}
      <button
        onClick={onToggleSound}
        aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        className="w-11 h-11 rounded-2xl bg-[#0d2259] border-2 border-[#E5A93C] flex items-center justify-center text-amber-300 shadow-lg active:scale-95 transition-transform"
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5 text-slate-400" />
        )}
      </button>
    </div>
  );
};
