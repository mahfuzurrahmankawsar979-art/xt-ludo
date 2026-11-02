import React, { useState } from 'react';
import { GameSettings, ThemeType } from '../types/game';
import { Play, RotateCcw, Home, Volume2, VolumeX, Vibrate, Sliders, Check, Lock, X } from 'lucide-react';

interface PauseModalProps {
  settings: GameSettings;
  showDevOverlay: boolean;
  onToggleDevOverlay: (active: boolean) => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResume: () => void;
  onRestart: () => void;
  onExitToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  settings,
  showDevOverlay,
  onToggleDevOverlay,
  onUpdateSettings,
  onResume,
  onRestart,
  onExitToMenu,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  const themes: { id: ThemeType; name: string; previewColor: string }[] = [
    { id: 'classic', name: 'Classic Gold', previewColor: 'bg-[#F2B705]' },
    { id: 'modern', name: 'Modern Cyber', previewColor: 'bg-cyan-500' },
    { id: 'wooden', name: 'Royal Wooden', previewColor: 'bg-[#8B5A2B]' }
  ];

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '6607') {
      setPinSuccess(true);
      setPinError(false);
      onToggleDevOverlay(!showDevOverlay);
      setTimeout(() => {
        setShowPinModal(false);
        setPinInput('');
        setPinSuccess(false);
      }, 700);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-sm bg-[#08153A] border-2 border-amber-400 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center pb-4 border-b border-blue-900/60">
            <h2 className="text-2xl font-black text-amber-300 font-['Outfit'] tracking-wider">
              GAME PAUSED
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              XT LUDO — Classic Edition
            </p>
          </div>

          {/* Action Controls */}
          <div className="my-5 flex flex-col gap-2.5">
            {/* Resume Button */}
            <button
              onClick={onResume}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm tracking-wide shadow-md border border-yellow-200 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              RESUME GAME
            </button>

            {/* Restart Button */}
            <button
              onClick={onRestart}
              className="w-full py-3 rounded-2xl bg-[#0D245E] hover:bg-[#123180] text-blue-100 font-bold text-xs tracking-wide border border-blue-700/60 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              RESTART MATCH
            </button>

            {/* Main Menu Button */}
            <button
              onClick={onExitToMenu}
              className="w-full py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold text-xs tracking-wide border border-slate-700 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-slate-400" />
              MAIN MENU
            </button>
          </div>

          {/* Settings & Themes */}
          <div className="pt-4 border-t border-blue-900/60 flex flex-col gap-3">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Match Settings & Themes
            </span>

            {/* Theme selector */}
            <div className="grid grid-cols-3 gap-2">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => onUpdateSettings({ theme: th.id })}
                  className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 border transition ${
                    settings.theme === th.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'bg-black/30 border-blue-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${th.previewColor} border border-white/40 shadow-sm`} />
                  <span className="truncate w-full text-center">{th.name}</span>
                </button>
              ))}
            </div>

            {/* Toggles row */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              {/* Sound toggle */}
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                  settings.soundEnabled
                    ? 'bg-blue-900/40 border-blue-500 text-blue-200'
                    : 'bg-black/30 border-slate-700 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                  <span>Sound</span>
                </div>
                <span className="text-[10px] font-bold uppercase">{settings.soundEnabled ? 'ON' : 'OFF'}</span>
              </button>

              {/* Vibration toggle */}
              <button
                onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                  settings.vibrationEnabled
                    ? 'bg-blue-900/40 border-blue-500 text-blue-200'
                    : 'bg-black/30 border-slate-700 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Vibrate className="w-4 h-4 text-emerald-400" />
                  <span>Vibrate</span>
                </div>
                <span className="text-[10px] font-bold uppercase">{settings.vibrationEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Discreet Calibration Option (Password Protected with 6607) */}
            <button
              onClick={() => {
                setPinError(false);
                setPinSuccess(false);
                setShowPinModal(true);
              }}
              className="mt-1 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border bg-black/30 border-blue-900/60 text-slate-400 hover:text-slate-200 transition"
            >
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Screen Touch Calibration</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {showDevOverlay ? 'CALIBRATED' : 'DEFAULT'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* PIN Security Dialog (Requires 6607) */}
      {showPinModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xs bg-[#06102B] border-2 border-amber-400 rounded-2xl p-5 shadow-2xl relative">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Calibration PIN Security
              </h3>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Enter 4-digit calibration key to verify screen touch zone coordinates:
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN"
                autoFocus
                className="w-full text-center text-lg tracking-widest font-mono bg-black/60 border border-blue-900 rounded-xl py-2 text-amber-300 focus:outline-none focus:border-amber-400"
              />

              {pinError && (
                <p className="text-[11px] text-red-400 text-center font-medium">
                  Invalid PIN. Access denied.
                </p>
              )}

              {pinSuccess && (
                <p className="text-[11px] text-emerald-400 text-center font-bold flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Alignment View Activated!
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs tracking-wider transition active:scale-98"
              >
                VERIFY PIN
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
