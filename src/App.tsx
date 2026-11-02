/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  GameMode,
  GameStats,
  GameSettings,
  GameView,
  Player,
  PlayerColor,
  PlayerId,
  SavedGameState,
  ThemeType
} from './types/game';
import {
  COLOR_START_INDICES,
  SAFE_INDICES
} from './utils/ludoBoardConstants';
import {
  loadGameState,
  saveGameState,
  clearSavedGameState,
  loadGameStats,
  recordMatchWin,
  loadSettings,
  saveSettings
} from './utils/storage';
import { sound } from './utils/audio';

import { TopBar } from './components/TopBar';
import { PlayerCard } from './components/PlayerCard';
import { LudoBoard } from './components/LudoBoard';
import { TitleScreen } from './components/TitleScreen';
import { MatchSetup } from './components/MatchSetup';
import { PauseModal } from './components/PauseModal';
import { VictoryModal } from './components/VictoryModal';
import { StatsModal } from './components/StatsModal';
import { RulesModal } from './components/RulesModal';
import { VSComputerModal } from './components/VSComputerModal';

export default function App() {
  // Navigation / View State
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [isPaused, setIsPaused] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showVSComputerModal, setShowVSComputerModal] = useState(false);
  const [showDevOverlay, setShowDevOverlay] = useState(false);

  // Match State
  const [mode, setMode] = useState<GameMode>('classic');
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [movableTokenIds, setMovableTokenIds] = useState<number[]>([]);
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [knockEffect, setKnockEffect] = useState<{ color: PlayerColor; text: string } | null>(null);

  // Start match against Computer bots
  const handleStartVSComputer = (configuredPlayers: Player[]) => {
    setShowVSComputerModal(false);
    handleStartConfiguredMatch(configuredPlayers);
  };

  // Settings & Persistent Stats
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<GameStats>(loadGameStats);

  // Bot timeout tracker to prevent stuck timers
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize offline service worker and check for saved game
  useEffect(() => {
    // Register Service Worker for 100% offline caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    sound.enabled = settings.soundEnabled;
    const saved = loadGameState();
    if (saved && !saved.winner) {
      setHasSavedGame(true);
    }
  }, [settings.soundEnabled]);

  // Clean up bot timers when unmounting or navigating
  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, []);

  // Update sound engine settings
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
    if (updated.soundEnabled !== undefined) {
      sound.enabled = updated.soundEnabled;
    }
  };

  // Start new configured match
  const handleStartConfiguredMatch = (configuredPlayers: Player[]) => {
    setPlayers(configuredPlayers);
    setActivePlayerIndex(0);
    setDiceValue(null);
    setHasRolled(false);
    setIsRolling(false);
    setMovableTokenIds([]);
    setConsecutiveSixes(0);
    setWinner(null);
    setIsPaused(false);
    setCurrentView('playing');

    // Save initial state
    saveGameState({
      mode,
      players: configuredPlayers,
      activePlayerIndex: 0,
      diceValue: null,
      hasRolled: false,
      consecutiveSixes: 0,
      extraTurn: false,
      winner: null,
      matchStartedAt: Date.now()
    });
    setHasSavedGame(true);
  };

  // Resume saved match
  const handleResumeGame = () => {
    const saved = loadGameState();
    if (saved && saved.players.length > 0) {
      setMode(saved.mode);
      setPlayers(saved.players);
      setActivePlayerIndex(saved.activePlayerIndex);
      setDiceValue(saved.diceValue);
      setHasRolled(saved.hasRolled);
      setConsecutiveSixes(saved.consecutiveSixes || 0);
      setWinner(null);
      setIsPaused(false);
      setCurrentView('playing');
    }
  };

  // Active Player helper
  const activePlayer = players[activePlayerIndex];

  // Calculate movable tokens for a given player and rolled dice value
  const getMovableTokens = (player: Player, roll: number): number[] => {
    const valid: number[] = [];

    player.tokens.forEach((t) => {
      // In Yard: can only exit if rolled 6
      if (t.stepIndex === -1) {
        if (roll === 6) valid.push(t.id);
      }
      // On Main Path (0..50)
      else if (t.stepIndex >= 0 && t.stepIndex <= 50) {
        // Safe to advance (takes steps along path and into home stretch)
        valid.push(t.id);
      }
      // On Home Stretch (51..55)
      else if (t.stepIndex >= 51 && t.stepIndex < 56) {
        // Can only advance if does not overshoot 56
        if (t.stepIndex + roll <= 56) {
          valid.push(t.id);
        }
      }
      // Finished (56) cannot move
    });

    return valid;
  };

  // Roll Dice Action
  const handleRollDice = () => {
    if (isRolling || hasRolled || isMoving || !activePlayer || winner) return;

    setIsRolling(true);
    sound.playDiceRoll();

    setTimeout(() => {
      let rollResult: number;

      // Secret Dice System:
      // Works ONLY if player has unlocked it via the 3-second avatar hold!
      if (activePlayer.secretUnlocked && activePlayer.pendingDiceNumber !== null) {
        rollResult = activePlayer.pendingDiceNumber;
        // Clear pending number for one-time use rule
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, pendingDiceNumber: null } : p
          )
        );
      } else {
        // Normal random dice 1 to 6
        rollResult = Math.floor(Math.random() * 6) + 1;
      }

      setDiceValue(rollResult);
      setIsRolling(false);
      setHasRolled(true);

      // Play chime on 6
      if (rollResult === 6) {
        sound.playSixRoll();
      }

      // Check consecutive 6s tournament penalty (3 consecutive sixes cancels turn)
      if (rollResult === 6) {
        const nextSixes = consecutiveSixes + 1;
        setConsecutiveSixes(nextSixes);
        if (nextSixes >= 3) {
          // Pass turn immediately
          setConsecutiveSixes(0);
          setTimeout(() => advanceTurn(false), 900);
          return;
        }
      } else {
        setConsecutiveSixes(0);
      }

      // Find which tokens can move
      const movable = getMovableTokens(activePlayer, rollResult);
      setMovableTokenIds(movable);

      // If no valid moves, automatically advance to next player after brief delay
      if (movable.length === 0) {
        setTimeout(() => advanceTurn(false), 900);
      }
    }, 450);
  };

  // Move Token Action
  const handleSelectToken = (tokenId: number) => {
    if (!hasRolled || diceValue === null || isMoving || !movableTokenIds.includes(tokenId))
      return;

    executeMoveToken(tokenId, diceValue);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Step-by-Step Traversal with Melodic Audio Hops & Dramatic Knockout Sound
  const executeMoveToken = async (tokenId: number, roll: number) => {
    if (isMoving) return;
    setIsMoving(true);
    setMovableTokenIds([]);

    let extraTurnGranted = roll === 6;

    const currentP = players[activePlayerIndex];
    const initialToken = currentP.tokens.find((t) => t.id === tokenId);
    if (!initialToken) {
      setIsMoving(false);
      return;
    }

    if (initialToken.stepIndex === -1) {
      // Exiting home yard to start square (0)
      sound.playTokenExit();
      setPlayers((prev) =>
        prev.map((p, pIdx) =>
          pIdx === activePlayerIndex
            ? {
                ...p,
                tokens: p.tokens.map((t) =>
                  t.id === tokenId ? { ...t, stepIndex: 0 } : t
                )
              }
            : p
        )
      );
      await sleep(280);
    } else {
      // Step-by-step movement along path: hop cell by cell!
      const startStep = initialToken.stepIndex;
      const targetStep = Math.min(56, startStep + roll);

      for (let curr = startStep + 1; curr <= targetStep; curr++) {
        setPlayers((prev) =>
          prev.map((p, pIdx) =>
            pIdx === activePlayerIndex
              ? {
                  ...p,
                  tokens: p.tokens.map((t) =>
                    t.id === tokenId ? { ...t, stepIndex: curr } : t
                  )
                }
              : p
          )
        );

        // Ascending melodic marimba hop note for each square crossed
        sound.playStepHop(curr - startStep, roll);
        await sleep(140);
      }

      if (targetStep === 56) {
        // Reached final home center!
        sound.playSafeZone();
        extraTurnGranted = true;
        await sleep(220);
      } else if (targetStep <= 50) {
        // Check for opponent capture on outer path
        const globalCell = (COLOR_START_INDICES[currentP.color] + targetStep) % 52;

        if (!SAFE_INDICES.has(globalCell)) {
          let opponentCapturedColor: PlayerColor | null = null;

          setPlayers((prev) => {
            let captured = false;
            const next = prev.map((opp, oppIdx) => {
              if (oppIdx === activePlayerIndex) return opp;

              const nextOppTokens = opp.tokens.map((ot) => {
                if (ot.stepIndex >= 0 && ot.stepIndex <= 50) {
                  const oppGlobalCell =
                    (COLOR_START_INDICES[opp.color] + ot.stepIndex) % 52;
                  if (oppGlobalCell === globalCell) {
                    captured = true;
                    opponentCapturedColor = opp.color;
                    return { ...ot, stepIndex: -1 };
                  }
                }
                return ot;
              });

              return { ...opp, tokens: nextOppTokens };
            });

            if (captured) {
              extraTurnGranted = true;
            }
            return next;
          });

          if (opponentCapturedColor) {
            // Powerful impact capture sound + screen vibration + visual feedback!
            sound.playCapture();
            setKnockEffect({
              color: opponentCapturedColor,
              text: 'KNOCKOUT! 💥'
            });
            await sleep(650);
            setKnockEffect(null);
          }
        }
      }
    }

    // Check Victory Condition
    let isWon = false;
    setPlayers((freshPlayers) => {
      const activeP = freshPlayers[activePlayerIndex];
      const hasWon = activeP.tokens.every((t) => t.stepIndex === 56);
      if (hasWon) {
        isWon = true;
        setWinner(activeP);
        sound.playVictory();
        clearSavedGameState();
        setHasSavedGame(false);

        const allIds = freshPlayers.map((p) => p.id);
        const updatedStats = recordMatchWin(activeP.id, allIds);
        setStats(updatedStats);
      } else {
        saveGameState({
          mode,
          players: freshPlayers,
          activePlayerIndex,
          diceValue,
          hasRolled,
          consecutiveSixes,
          extraTurn: extraTurnGranted,
          winner: null,
          matchStartedAt: Date.now()
        });
      }
      return freshPlayers;
    });

    setIsMoving(false);

    if (!isWon) {
      setTimeout(() => {
        advanceTurn(extraTurnGranted);
      }, 350);
    }
  };

  // Advance turn to next player or give bonus roll
  const advanceTurn = (extraTurn: boolean) => {
    setHasRolled(false);
    setMovableTokenIds([]);

    if (extraTurn) {
      // Active player rolls again
      setDiceValue(null);
    } else {
      // Pass turn clockwise
      const nextIndex = (activePlayerIndex + 1) % players.length;
      setActivePlayerIndex(nextIndex);
      setDiceValue(null);
      setConsecutiveSixes(0);
    }
  };

  // Bot Turn Automation (Realistic pass-and-play AI)
  useEffect(() => {
    if (currentView !== 'playing' || isPaused || winner || !activePlayer || isMoving) return;

    if (activePlayer.isBot) {
      if (!hasRolled && !isRolling) {
        // Bot thinks and rolls
        botTimerRef.current = setTimeout(() => {
          handleRollDice();
        }, 750);
      } else if (hasRolled && movableTokenIds.length > 0 && diceValue !== null) {
        // Bot selects the best move
        botTimerRef.current = setTimeout(() => {
          // AI Heuristics:
          // 1. Move token that can capture opponent
          // 2. Move token into final home (56)
          // 3. Move token out of yard on 6
          // 4. Move token closest to home
          let chosenId = movableTokenIds[0];

          for (const tid of movableTokenIds) {
            const token = activePlayer.tokens.find((t) => t.id === tid)!;

            // Priority: Finish home
            if (token.stepIndex + diceValue === 56) {
              chosenId = tid;
              break;
            }

            // Priority: Capture opponent
            if (token.stepIndex >= 0 && token.stepIndex + diceValue <= 50) {
              const targetGlobal =
                (COLOR_START_INDICES[activePlayer.color] +
                  token.stepIndex +
                  diceValue) %
                52;

              if (!SAFE_INDICES.has(targetGlobal)) {
                const canKnock = players.some(
                  (opp, oppIdx) =>
                    oppIdx !== activePlayerIndex &&
                    opp.tokens.some((ot) => {
                      if (ot.stepIndex >= 0 && ot.stepIndex <= 50) {
                        return (
                          (COLOR_START_INDICES[opp.color] + ot.stepIndex) %
                            52 ===
                          targetGlobal
                        );
                      }
                      return false;
                    })
                );
                if (canKnock) {
                  chosenId = tid;
                  break;
                }
              }
            }

            // Priority: Exit yard on 6
            if (token.stepIndex === -1 && diceValue === 6) {
              chosenId = tid;
            }
          }

          executeMoveToken(chosenId, diceValue);
        }, 850);
      }
    }
  }, [
    currentView,
    activePlayerIndex,
    hasRolled,
    isRolling,
    movableTokenIds,
    diceValue,
    isPaused,
    winner,
    isMoving
  ]);

  // Secret Touch Zone Tap Handler
  const handleSecretZoneTap = (playerId: PlayerId, zoneNumber: number) => {
    // Strictly ignored before 3-second emoji avatar long-press!
    const targetPlayer = players.find((p) => p.id === playerId);
    if (!targetPlayer || !targetPlayer.secretUnlocked) {
      return;
    }

    sound.playSecretTap();
    if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            pendingDiceNumber: zoneNumber,
            lastZoneSelected: zoneNumber
          };
        }
        return p;
      })
    );
  };

  // Secret unlock: triggered ONLY when holding the player's emoji logo for 3 seconds
  const handleSecretUnlocked = (playerId: PlayerId) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, secretUnlocked: true } : p
      )
    );
  };

  // Restart match from current configuration
  const handleRestartMatch = () => {
    const resetPlayers = players.map((p) => ({
      ...p,
      tokens: [
        { id: 0, stepIndex: -1 },
        { id: 1, stepIndex: -1 },
        { id: 2, stepIndex: -1 },
        { id: 3, stepIndex: -1 }
      ],
      pendingDiceNumber: null,
      secretUnlocked: false,
      lastZoneSelected: null
    }));

    handleStartConfiguredMatch(resetPlayers);
  };

  return (
    <div className="w-full min-h-screen bg-ludo-pattern text-white flex flex-col items-center justify-between relative overflow-hidden select-none">
      {/* Ambient background decoration shapes */}
      <div className="ambient-squircle w-48 h-48 -top-10 -left-10 rotate-12" />
      <div className="ambient-squircle w-56 h-56 -bottom-12 -right-12 -rotate-12" />
      <div className="ambient-squircle w-32 h-32 top-1/2 left-2 rotate-45" />

      {/* Main View Switcher */}
      {currentView === 'menu' && (
        <TitleScreen
          hasSavedGame={hasSavedGame}
          theme={settings.theme}
          onStartNewGame={() => setCurrentView('setup')}
          onOpenVSComputer={() => setShowVSComputerModal(true)}
          onResumeGame={handleResumeGame}
          onOpenStats={() => setShowStatsModal(true)}
          onOpenThemes={() => setIsPaused(true)}
          onOpenRules={() => setShowRulesModal(true)}
        />
      )}

      {currentView === 'setup' && (
        <MatchSetup
          mode={mode}
          onBack={() => setCurrentView('menu')}
          onStartMatch={handleStartConfiguredMatch}
        />
      )}

      {currentView === 'playing' && (
        <div className="w-full max-w-[460px] mx-auto min-h-screen flex flex-col justify-between py-2 px-1 relative z-10">
          {/* Top Bar HUD */}
          <TopBar
            soundEnabled={settings.soundEnabled}
            onToggleSound={() =>
              handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
            }
            onPause={() => setIsPaused(true)}
            onOpenRules={() => setShowRulesModal(true)}
          />

          {/* Top Player Cards (Red on top-left, Green on top-right) */}
          <div className="w-full flex items-center justify-between px-3 mt-1 mb-2">
            {/* Red Player (P1) */}
            {players.find((p) => p.color === 'red') ? (
              <PlayerCard
                player={players.find((p) => p.color === 'red')!}
                isActive={activePlayer?.color === 'red'}
                canRoll={
                  activePlayer?.color === 'red' &&
                  !hasRolled &&
                  !isRolling &&
                  !isMoving &&
                  !activePlayer.isBot
                }
                isRolling={activePlayer?.color === 'red' && isRolling}
                diceValue={
                  activePlayer?.color === 'red' ? diceValue : null
                }
                mode={mode}
                alignRight={false}
                onRoll={handleRollDice}
                onSecretUnlocked={handleSecretUnlocked}
              />
            ) : (
              <div className="w-24" />
            )}

            {/* Green Player (P2) */}
            {players.find((p) => p.color === 'green') ? (
              <PlayerCard
                player={players.find((p) => p.color === 'green')!}
                isActive={activePlayer?.color === 'green'}
                canRoll={
                  activePlayer?.color === 'green' &&
                  !hasRolled &&
                  !isRolling &&
                  !isMoving &&
                  !activePlayer.isBot
                }
                isRolling={activePlayer?.color === 'green' && isRolling}
                diceValue={
                  activePlayer?.color === 'green' ? diceValue : null
                }
                mode={mode}
                alignRight={true}
                onRoll={handleRollDice}
                onSecretUnlocked={handleSecretUnlocked}
              />
            ) : (
              <div className="w-24" />
            )}
          </div>

          {/* Ludo Board Viewport with Dramatic Knockout Effect */}
          <div className="w-full my-auto flex items-center justify-center relative">
            {knockEffect && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="bg-red-600/95 border-2 border-amber-300 text-white font-black text-xl px-6 py-2.5 rounded-2xl shadow-2xl animate-bounce tracking-wider flex items-center gap-2">
                  <span>💥</span>
                  <span>KNOCKOUT!</span>
                </div>
              </div>
            )}
            <LudoBoard
              players={players}
              activePlayer={activePlayer}
              movableTokenIds={movableTokenIds}
              theme={settings.theme}
              showSecretZoneHints={showDevOverlay}
              onHideDevOverlay={() => setShowDevOverlay(false)}
              onSelectToken={handleSelectToken}
              onSecretZoneTap={handleSecretZoneTap}
            />
          </div>

          {/* Bottom Player Cards (Blue on bottom-left, Yellow on bottom-right) */}
          <div className="w-full flex items-center justify-between px-3 mt-2 mb-3">
            {/* Blue Player (P3) */}
            {players.find((p) => p.color === 'blue') ? (
              <PlayerCard
                player={players.find((p) => p.color === 'blue')!}
                isActive={activePlayer?.color === 'blue'}
                canRoll={
                  activePlayer?.color === 'blue' &&
                  !hasRolled &&
                  !isRolling &&
                  !isMoving &&
                  !activePlayer.isBot
                }
                isRolling={activePlayer?.color === 'blue' && isRolling}
                diceValue={
                  activePlayer?.color === 'blue' ? diceValue : null
                }
                mode={mode}
                alignRight={false}
                onRoll={handleRollDice}
                onSecretUnlocked={handleSecretUnlocked}
              />
            ) : (
              <div className="w-24" />
            )}

            {/* Yellow Player (P4) */}
            {players.find((p) => p.color === 'yellow') ? (
              <PlayerCard
                player={players.find((p) => p.color === 'yellow')!}
                isActive={activePlayer?.color === 'yellow'}
                canRoll={
                  activePlayer?.color === 'yellow' &&
                  !hasRolled &&
                  !isRolling &&
                  !isMoving &&
                  !activePlayer.isBot
                }
                isRolling={activePlayer?.color === 'yellow' && isRolling}
                diceValue={
                  activePlayer?.color === 'yellow' ? diceValue : null
                }
                mode={mode}
                alignRight={true}
                onRoll={handleRollDice}
                onSecretUnlocked={handleSecretUnlocked}
              />
            ) : (
              <div className="w-24" />
            )}
          </div>

          {/* Active Turn Status Banner */}
          <div className="w-full text-center pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-blue-900/50 text-xs font-semibold text-blue-200 shadow">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  activePlayer?.color === 'red'
                    ? 'bg-red-500'
                    : activePlayer?.color === 'green'
                    ? 'bg-emerald-500'
                    : activePlayer?.color === 'blue'
                    ? 'bg-blue-500'
                    : 'bg-amber-400'
                }`}
              />
              <span>
                {activePlayer ? (
                  <>
                    <strong className="text-white">{activePlayer.name}'s</strong> Turn
                    {isRolling
                      ? ' · Rolling...'
                      : hasRolled
                      ? movableTokenIds.length > 0
                        ? ' · Tap token to move'
                        : ' · No valid moves'
                      : activePlayer.isBot
                      ? ' · Thinking...'
                      : ' · Tap dice to roll'}
                  </>
                ) : (
                  'Ready'
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VS Computer Setup Modal */}
      {showVSComputerModal && (
        <VSComputerModal
          onClose={() => setShowVSComputerModal(false)}
          onStartVSComputer={handleStartVSComputer}
        />
      )}

      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          settings={settings}
          showDevOverlay={showDevOverlay}
          onToggleDevOverlay={(val) => setShowDevOverlay(val)}
          onUpdateSettings={handleUpdateSettings}
          onResume={() => setIsPaused(false)}
          onRestart={() => {
            setIsPaused(false);
            handleRestartMatch();
          }}
          onExitToMenu={() => {
            setIsPaused(false);
            setCurrentView('menu');
          }}
        />
      )}

      {/* Victory Celebration Modal */}
      {winner && (
        <VictoryModal
          winner={winner}
          onPlayAgain={handleRestartMatch}
          onExitToMenu={() => {
            setWinner(null);
            setCurrentView('menu');
          }}
        />
      )}

      {/* Statistics Modal */}
      {showStatsModal && (
        <StatsModal
          stats={stats}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <RulesModal onClose={() => setShowRulesModal(false)} />
      )}
    </div>
  );
}
