import React, { useState } from 'react';
import { Player, PlayerColor, PlayerId } from '../types/game';
import { Bot, X, Play } from 'lucide-react';

interface VSComputerModalProps {
  onClose: () => void;
  onStartVSComputer: (configuredPlayers: Player[]) => void;
}

export const VSComputerModal: React.FC<VSComputerModalProps> = ({
  onClose,
  onStartVSComputer
}) => {
  const [matchType, setMatchType] = useState<'2p' | '4p'>('2p');
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('red');

  const colors: { color: PlayerColor; name: string; bg: string; pid: PlayerId }[] = [
    { color: 'red', name: 'Red', bg: 'bg-red-600', pid: 'P1' },
    { color: 'green', name: 'Green', bg: 'bg-emerald-600', pid: 'P2' },
    { color: 'blue', name: 'Blue', bg: 'bg-blue-600', pid: 'P3' },
    { color: 'yellow', name: 'Yellow', bg: 'bg-amber-400 text-slate-950', pid: 'P4' }
  ];

  const handleStart = () => {
    let activeColors: PlayerColor[];
    if (matchType === '2p') {
      if (selectedColor === 'red') activeColors = ['red', 'yellow'];
      else if (selectedColor === 'yellow') activeColors = ['red', 'yellow'];
      else if (selectedColor === 'green') activeColors = ['green', 'blue'];
      else activeColors = ['green', 'blue'];
    } else {
      activeColors = ['red', 'green', 'blue', 'yellow'];
    }

    const colorToId: Record<PlayerColor, PlayerId> = {
      red: 'P1',
      green: 'P2',
      blue: 'P3',
      yellow: 'P4'
    };

    const configuredPlayers: Player[] = activeColors.map((c) => {
      const isHuman = c === selectedColor;
      return {
        id: colorToId[c],
        name: isHuman ? 'You' : `Computer (${c.toUpperCase()})`,
        color: c,
        isBot: !isHuman,
        avatarEmoji: isHuman ? '👑' : '🤖',
        tokens: [
          { id: 0, stepIndex: -1 },
          { id: 1, stepIndex: -1 },
          { id: 2, stepIndex: -1 },
          { id: 3, stepIndex: -1 }
        ],
        pendingDiceNumber: null,
        secretUnlocked: false,
        lastZoneSelected: null
      };
    });

    onStartVSComputer(configuredPlayers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#08153A] border-2 border-amber-400 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit']">
                PLAY VS COMPUTER
              </h2>
              <p className="text-[11px] text-blue-200">Select Mode & Player</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Match Type Selection */}
        <div className="mt-4">
          <label className="text-xs font-bold text-blue-200 uppercase tracking-wider block mb-2">
            Game Mode
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setMatchType('2p')}
              className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1 transition ${
                matchType === '2p'
                  ? 'bg-amber-400 text-slate-950 border-yellow-200 shadow-md scale-102'
                  : 'bg-black/30 border-blue-900 text-slate-300 hover:bg-[#0c1f54]'
              }`}
            >
              <span className="text-sm font-black">2 Players</span>
              <span className="text-[10px] opacity-80">You vs Computer</span>
            </button>

            <button
              onClick={() => setMatchType('4p')}
              className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1 transition ${
                matchType === '4p'
                  ? 'bg-amber-400 text-slate-950 border-yellow-200 shadow-md scale-102'
                  : 'bg-black/30 border-blue-900 text-slate-300 hover:bg-[#0c1f54]'
              }`}
            >
              <span className="text-sm font-black">4 Players</span>
              <span className="text-[10px] opacity-80">You vs 3 Computers</span>
            </button>
          </div>
        </div>

        {/* Choose Color */}
        <div className="mt-4">
          <label className="text-xs font-bold text-blue-200 uppercase tracking-wider block mb-2">
            Your Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((c) => (
              <button
                key={c.color}
                onClick={() => setSelectedColor(c.color)}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition ${
                  selectedColor === c.color
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-[#08153A] scale-105'
                    : 'opacity-70 hover:opacity-100'
                } ${c.bg} text-white border-white/30`}
              >
                <span className="text-lg">👑</span>
                <span className="text-[10px] truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStart}
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm tracking-wider shadow-lg border-2 border-yellow-200 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          START MATCH
        </button>
      </div>
    </div>
  );
};
