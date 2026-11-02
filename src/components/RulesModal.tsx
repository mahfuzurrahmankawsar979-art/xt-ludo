import React from 'react';
import { X, Dices } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm max-h-[90vh] flex flex-col bg-[#08153A] border-2 border-amber-400 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-900/50 border border-blue-600 flex items-center justify-center text-amber-300">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300 font-['Outfit']">
                GAME RULES
              </h2>
              <p className="text-[11px] text-blue-200">XT LUDO Official Rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Standard Ludo Rules Only */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-200 leading-relaxed font-sans">
          <div className="flex gap-2.5">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow">
              1
            </span>
            <div>
              <h5 className="font-bold text-white text-xs">Entering the Board (গুটি বের করা)</h5>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Rolling a <strong>6</strong> on the dice releases one token from your home yard to the starting square.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs shadow">
              2
            </span>
            <div>
              <h5 className="font-bold text-white text-xs">Bonus Turns (অতিরিক্ত চাল)</h5>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Rolling a <strong>6</strong>, capturing an opponent's token, or successfully moving a token into the final center grants you an immediate extra dice roll.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow">
              3
            </span>
            <div>
              <h5 className="font-bold text-white text-xs">Safe Zones & Stars (নিরাপদ ঘর)</h5>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Cells marked with a <strong>Star (☆)</strong> and player start squares are Safe Zones. Tokens stationed here cannot be captured.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow">
              4
            </span>
            <div>
              <h5 className="font-bold text-white text-xs">Token Knock / Capture (গুটি কাটা)</h5>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Landing on an opponent's token on an unsafe cell knocks it back to their home yard and awards you a bonus turn.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow">
              5
            </span>
            <div>
              <h5 className="font-bold text-white text-xs">Winning the Game (বিজয় নির্ধারণ)</h5>
              <p className="text-slate-300 text-[11px] mt-0.5">
                The first player to safely navigate all <strong>4 tokens</strong> through their color track into the center triangle is crowned Champion!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="p-3 border-t border-blue-900/60 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#0D245E] hover:bg-[#123180] text-blue-100 font-bold text-xs"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
