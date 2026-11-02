import React, { useEffect, useState } from 'react';
import { X, Smartphone, Download, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';

interface APKGuideModalProps {
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const APKGuideModal: React.FC<APKGuideModalProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install on Android: Tap the 3 dots in Chrome and select "Add to Home screen" or "Install App".');
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm max-h-[90vh] flex flex-col bg-[#08153A] border-2 border-amber-400 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit']">
                ANDROID APP & APK GUIDE
              </h2>
              <p className="text-[11px] text-blue-200">Install XT LUDO Directly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-200">
          {/* Method 1: 1-Tap Offline Android Install */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-300 text-xs">
                Method 1: Direct Android Install (PWA)
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                RECOMMENDED
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mb-3 leading-normal">
              Install XT LUDO directly to your Android Home Screen with its own app icon, standalone full-screen window, and 100% offline cache!
            </p>

            {isInstalled ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold py-2">
                <CheckCircle2 className="w-4 h-4" /> Already Installed on this Device
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs tracking-wider shadow border border-yellow-200 flex items-center justify-center gap-2 active:scale-98 transition"
              >
                <Download className="w-4 h-4" />
                INSTALL APP ON PHONE
              </button>
            )}
          </div>

          {/* Chrome Manual Steps */}
          <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-2">
            <span className="font-bold text-white text-xs block">
              How to install in Chrome / Samsung Browser:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
              <li>Open this game in Chrome on your Android phone.</li>
              <li>Tap the <strong>three dots (⋮)</strong> menu in the top right.</li>
              <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              <li>XT LUDO will appear on your phone alongside other native apps!</li>
            </ol>
          </div>

          {/* Method 2: Package into Standalone APK */}
          <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-2">
            <span className="font-bold text-amber-400 text-xs block">
              Method 2: Export as Signed Android APK
            </span>
            <p className="text-[11px] text-slate-300">
              This app includes a complete Android Web App Manifest (<code className="text-amber-300 font-mono">manifest.json</code>) and Service Worker (<code className="text-amber-300 font-mono">sw.js</code>).
            </p>
            <p className="text-[11px] text-slate-300">
              To build a signed <code className="text-amber-300 font-mono">.apk</code> file for Google Play or direct sideloading:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
              <li>Copy your live App URL below.</li>
              <li>Visit <strong className="text-white">PWABuilder.com</strong> on your computer.</li>
              <li>Paste the URL and click <strong>"Build My PWA"</strong> → <strong>Android APK</strong>.</li>
              <li>Download the compiled APK and install directly on any Android device!</li>
            </ol>

            <button
              onClick={handleCopyUrl}
              className="mt-2 w-full py-2 px-3 rounded-xl bg-blue-900/50 hover:bg-blue-900 text-blue-200 text-[11px] font-mono flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'URL Copied!' : 'Copy App URL for PWABuilder'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-blue-900/60 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#0D245E] hover:bg-[#123180] text-blue-100 font-bold text-xs"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
