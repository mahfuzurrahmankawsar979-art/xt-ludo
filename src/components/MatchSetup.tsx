import React, { useState } from 'react';
import { GameMode, Player, PlayerColor, PlayerId } from '../types/game';
import { ArrowLeft, Play, User, Bot, Sparkles } from 'lucide-react';

interface MatchSetupProps {
  mode: GameMode;
  onBack: () => void;
  onStartMatch: (configuredPlayers: Player[]) => void;
}

interface PlayerConfig {
  id: PlayerId;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  avatarEmoji: string;
}

export const MatchSetup: React.FC<MatchSetupProps> = ({
  mode,
  onBack,
  onStartMatch
}) => {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(4);

  const [configs, setConfigs] = useState<Record<PlayerId, PlayerConfig>>({
    P1: { id: 'P1', name: 'Player 1', color: 'red', isBot: false, avatarEmoji: '😀' },
    P2: { id: 'P2', name: 'Player 2', color: 'green', isBot: false, avatarEmoji: '😎' },
    P3: { id: 'P3', name: 'Player 3', color: 'blue', isBot: false, avatarEmoji: '🥳' },
    P4: { id: 'P4', name: 'Player 4', color: 'yellow', isBot: false, avatarEmoji: '😍' }
  });

  const handleNameChange = (id: PlayerId, newName: string) => {
    setConfigs((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: newName }
    }));
  };

  const handleToggleBot = (id: PlayerId) => {
    setConfigs((prev) => ({
      ...prev,
      [id]: { ...prev[id], isBot: !prev[id].isBot }
    }));
  };

  const handleStart = () => {
    // Determine which players participate based on player count
    // In Ludo:
    // 2 Players: Red (P1) vs Yellow (P4) (opposite corners for best board balance)
    // 3 Players: Red (P1), Green (P2), Yellow (P4)
    // 4 Players: Red (P1), Green (P2), Blue (P3), Yellow (P4)
    let activeIds: PlayerId[] = [];
    if (playerCount === 2) {
      activeIds = ['P1', 'P4'];
    } else if (playerCount === 3) {
      activeIds = ['P1', 'P2', 'P4'];
    } else {
      activeIds = ['P1', 'P2', 'P3', 'P4'];
    }

    const initialPlayers: Player[] = activeIds.map((pid) => {
      const cfg = configs[pid];
      return {
        id: cfg.id,
        name: cfg.name.trim() || `Player ${cfg.id.slice(1)}`,
        color: cfg.color,
        isBot: cfg.isBot,
        avatarEmoji: cfg.avatarEmoji,
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

    onStartMatch(initialPlayers);
  };

  const colorMeta: Record<PlayerColor, { name: string; border: string; bg: string }> = {
    red: { name: 'Red', border: 'border-red-500', bg: 'bg-red-500/10' },
    green: { name: 'Green', border: 'border-emerald-500', bg: 'bg-emerald-500/10' },
    blue: { name: 'Blue', border: 'border-blue-500', bg: 'bg-blue-500/10' },
    yellow: { name: 'Yellow', border: 'border-amber-400', bg: 'bg-amber-400/10' }
  };

  const activeIds =
    playerCount === 2
      ? (['P1', 'P4'] as PlayerId[])
      : playerCount === 3
      ? (['P1', 'P2', 'P4'] as PlayerId[])
      : (['P1', 'P2', 'P3', 'P4'] as PlayerId[]);

  return (
    <div className="w-full min-h-screen max-w-[460px] mx-auto flex flex-col justify-between px-4 py-6 z-10 relative">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/60">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#0d2259] border border-blue-800 flex items-center justify-center text-white active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black text-white font-['Outfit']">NEW MATCH</h2>
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-300 font-semibold">
              {mode === 'custom' ? (
                <>
                  <Sparkles className="w-3 h-3" /> Custom Dice Mode Active
                </>
              ) : (
                'Classic Random Dice'
              )}
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Player Count Buttons */}
        <div className="mt-5">
          <label className="text-xs font-bold text-blue-200 uppercase tracking-wider block mb-2">
            Select Number of Players
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {([2, 3, 4] as const).map((cnt) => (
              <button
                key={cnt}
                onClick={() => setPlayerCount(cnt)}
                className={`py-3 rounded-2xl font-black text-sm tracking-wide transition-all ${
                  playerCount === cnt
                    ? 'bg-amber-400 text-slate-950 border-2 border-yellow-200 shadow-lg shadow-amber-500/20 scale-102'
                    : 'bg-[#0A1A40] text-slate-300 border border-blue-900/60 hover:bg-[#0e245a]'
                }`}
              >
                {cnt} PLAYERS
              </button>
            ))}
          </div>
        </div>

        {/* Player Configuration List */}
        <div className="mt-6 flex flex-col gap-3">
          <label className="text-xs font-bold text-blue-200 uppercase tracking-wider block">
            Player Details & Opponents
          </label>

          {activeIds.map((pid) => {
            const cfg = configs[pid];
            const meta = colorMeta[cfg.color];

            return (
              <div
                key={pid}
                className={`flex items-center justify-between p-3 rounded-2xl border ${meta.border} ${meta.bg} backdrop-blur-sm`}
              >
                {/* Emoji + ID badge */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#06102B] border border-white/20 flex items-center justify-center text-xl shadow">
                    {cfg.avatarEmoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-400/30">
                        {cfg.id}
                      </span>
                      <span className="text-xs font-bold text-white capitalize">
                        {meta.name}
                      </span>
                    </div>
                    {/* Name Input */}
                    <input
                      type="text"
                      maxLength={14}
                      value={cfg.name}
                      onChange={(e) => handleNameChange(pid, e.target.value)}
                      placeholder={`Player ${pid.slice(1)}`}
                      className="mt-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-medium focus:outline-none focus:border-amber-400 w-32"
                    />
                  </div>
                </div>

                {/* Bot vs Human toggle */}
                <button
                  onClick={() => handleToggleBot(pid)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    cfg.isBot
                      ? 'bg-purple-600/80 border-purple-400 text-white shadow-sm'
                      : 'bg-emerald-600/80 border-emerald-400 text-white shadow-sm'
                  }`}
                >
                  {cfg.isBot ? (
                    <>
                      <Bot className="w-3.5 h-3.5" /> BOT
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5" /> HUMAN
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <div className="mt-8">
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-lg tracking-wider shadow-xl shadow-amber-500/25 border-2 border-yellow-200 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          START GAME
        </button>
      </div>
    </div>
  );
};
