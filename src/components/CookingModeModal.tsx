import React, { useState, useEffect } from 'react';
import { Recipe, CookingStep } from '../types';

interface CookingModeModalProps {
  recipe: Recipe;
  onExit: () => void;
  isHealthierMode: boolean;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  onExit,
  isHealthierMode
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  
  // Timer state
  const currentStep = recipe.steps[currentStepIndex] || recipe.steps[0];
  const initialSeconds = (currentStep.timerMinutes || 3) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Reset timer when changing steps
  useEffect(() => {
    setIsTimerRunning(false);
    setSecondsRemaining((currentStep.timerMinutes || 3) * 60);
  }, [currentStepIndex, currentStep.timerMinutes]);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100);

  // Render animated demonstration graphics depending on visualType
  const renderDemonstrationGraphic = (step: CookingStep) => {
    switch (step.visualType) {
      case 'prep':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1C2520] to-[#121A16] rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.08),transparent_70%)]" />
            
            {/* Wooden Cutting Board */}
            <div className="relative w-72 h-48 bg-[#9A6233] rounded-2xl shadow-2xl border-4 border-[#7A4B22] flex items-center justify-center p-4">
              <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#B47C49]/40 rounded-xl pointer-events-none" />
              
              {/* Prep items */}
              <div className="flex gap-4 items-center">
                {/* Chicken pieces */}
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-8 bg-[#E69363] rounded-lg shadow-sm border border-[#D97706]/40" />
                  <div className="w-10 h-7 bg-[#E69363] rounded-lg shadow-sm border border-[#D97706]/40" />
                </div>
                {/* Garlic cloves & ginger */}
                <div className="flex flex-col gap-1.5 items-center">
                  <div className="w-5 h-6 bg-[#FEF08A] rounded-full shadow-xs" />
                  <div className="w-6 h-4 bg-[#FEF08A] rounded-full shadow-xs" />
                  <div className="w-8 h-3 bg-[#FDE68A] rounded-sm transform rotate-12" />
                </div>
              </div>

              {/* Chef Knife in Motion */}
              <div className="absolute -top-6 -right-2 transform -rotate-12 transition-transform duration-500 ease-in-out hover:rotate-0">
                <div className="w-40 h-10 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-400 rounded-r-3xl shadow-lg border border-slate-300 relative">
                  <div className="absolute top-0 bottom-0 left-0 w-8 bg-[#332219] rounded-l-md border-r-2 border-[#1E130D]" />
                  <div className="absolute top-1/2 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 transform -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs uppercase tracking-wider text-[#A7F3D0] font-semibold">Active Prep Demonstration</span>
              <p className="text-xs text-white/60 mt-1">Keep cuts uniform for even heat distribution</p>
            </div>
          </div>
        );

      case 'sear':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#2B1B17] to-[#160E0B] rounded-3xl overflow-hidden">
            {/* Heat glow */}
            <div className="absolute bottom-10 w-72 h-36 bg-[#E86C38]/20 blur-3xl rounded-full" />
            
            {/* Hot Sizzling Skillet */}
            <div className="relative w-64 h-64 rounded-full bg-[#1A1A1A] border-8 border-[#2D2D2D] shadow-2xl flex items-center justify-center">
              {/* Pan inner base */}
              <div className="w-48 h-48 rounded-full bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden">
                {/* Sizzle oil sheen */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.25),transparent_60%)] animate-pulse-gentle" />
                
                {/* Searing chicken cutlets with golden char */}
                <div className="relative grid grid-cols-2 gap-3 p-4">
                  <div className="w-14 h-11 bg-gradient-to-br from-[#B45309] to-[#78350F] rounded-xl shadow-md border border-[#F59E0B]/30 animate-simmer">
                    <div className="w-full h-1 bg-[#D97706] mt-2 rounded" />
                  </div>
                  <div className="w-13 h-10 bg-gradient-to-br from-[#B45309] to-[#78350F] rounded-xl shadow-md border border-[#F59E0B]/30 animate-simmer" style={{ animationDelay: '0.4s' }}>
                    <div className="w-full h-1 bg-[#D97706] mt-1.5 rounded" />
                  </div>
                  <div className="w-14 h-11 bg-gradient-to-br from-[#92400E] to-[#78350F] rounded-xl shadow-md border border-[#F59E0B]/30 animate-simmer" style={{ animationDelay: '0.8s' }}>
                    <div className="w-full h-1 bg-[#D97706] mt-2 rounded" />
                  </div>
                </div>

                {/* Steam plumes */}
                <div className="absolute top-2 w-full flex justify-center space-x-3 pointer-events-none">
                  <div className="w-2 h-10 bg-white/40 rounded-full blur-xs animate-steam-1" />
                  <div className="w-2 h-12 bg-white/50 rounded-full blur-xs animate-steam-2" />
                  <div className="w-1.5 h-8 bg-white/30 rounded-full blur-xs animate-steam-3" />
                </div>
              </div>

              {/* Pan Handle */}
              <div className="absolute -left-16 w-16 h-6 bg-[#333333] rounded-l-xl border-t border-b border-[#444444]" />
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs uppercase tracking-wider text-[#FDBA74] font-semibold flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E86C38] animate-ping" />
                Searing in Progress · Medium-High Heat
              </span>
              <p className="text-xs text-white/60 mt-1">Listen for steady, rhythmic sizzle without burnt smoke</p>
            </div>
          </div>
        );

      case 'simmer':
      case 'sauce':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1C2520] to-[#0F1713] rounded-3xl overflow-hidden">
            {/* Simmering pan */}
            <div className="relative w-64 h-64 rounded-full bg-[#183B2B] border-8 border-[#214D38] shadow-2xl flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#78350F] to-[#451A03] flex items-center justify-center relative overflow-hidden">
                {/* Bubbling liquid effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(245,158,11,0.3),transparent_70%)] animate-pulse-gentle" />
                
                {/* Simmer bubbles */}
                <div className="absolute top-8 left-12 w-4 h-4 rounded-full bg-[#F59E0B]/60 animate-ping" />
                <div className="absolute bottom-10 right-14 w-3 h-3 rounded-full bg-[#F59E0B]/50 animate-ping" style={{ animationDelay: '0.7s' }} />
                <div className="absolute top-16 right-10 w-2.5 h-2.5 rounded-full bg-[#FEF3C7]/70 animate-ping" style={{ animationDelay: '1.2s' }} />

                {/* Glazed items absorbing reduction */}
                <div className="w-24 h-16 bg-[#92400E] rounded-2xl border border-[#F59E0B]/40 flex items-center justify-center text-xs font-semibold text-[#FEF3C7]">
                  Glaze Coating
                </div>

                {/* Steam waves */}
                <div className="absolute top-1 w-full flex justify-center space-x-2 pointer-events-none">
                  <div className="w-2 h-14 bg-white/40 rounded-full blur-xs animate-steam-1" />
                  <div className="w-2.5 h-16 bg-white/50 rounded-full blur-xs animate-steam-2" />
                  <div className="w-2 h-12 bg-white/30 rounded-full blur-xs animate-steam-3" />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs uppercase tracking-wider text-[#A7F3D0] font-semibold">
                Glossy Sauce Reduction
              </span>
              <p className="text-xs text-white/60 mt-1">Glaze should coat the back of a spoon when lifted</p>
            </div>
          </div>
        );

      case 'plate':
      default:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#183B2B] to-[#0E241A] rounded-3xl overflow-hidden">
            {/* Finished Ceramic Plate */}
            <div className="relative w-64 h-64 rounded-full bg-[#F8FAFC] border-8 border-[#E2E8F0] shadow-2xl flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-[#183B2B] flex items-center justify-center text-center p-4 relative overflow-hidden">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#92400E] via-[#78350F] to-[#451A03] flex flex-col items-center justify-center shadow-inner">
                  <span className="text-2xl">✨</span>
                  <span className="text-xs font-bold text-white mt-1">Ready to Plate</span>
                  <span className="text-[10px] text-white/80">Warm & Fragrant</span>
                </div>

                {/* Steam */}
                <div className="absolute top-0 w-full flex justify-center space-x-2 pointer-events-none">
                  <div className="w-2 h-14 bg-white/40 rounded-full blur-xs animate-steam-1" />
                  <div className="w-2.5 h-16 bg-white/50 rounded-full blur-xs animate-steam-2" />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs uppercase tracking-wider text-[#A7F3D0] font-semibold">
                Final Presentation & Garnish
              </span>
              <p className="text-xs text-white/60 mt-1">Serve immediately while piping hot</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1713] text-white flex flex-col overflow-hidden">
      {/* Top Distraction-Free Bar */}
      <header className="px-6 py-4 border-b border-white/10 bg-[#16221B]/95 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>Exit Cooking</span>
          </button>

          <div>
            <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <span>{recipe.name}</span>
              {isHealthierMode && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  Healthier Swap
                </span>
              )}
            </h2>
            <span className="text-xs text-white/60">
              Step {currentStepIndex + 1} of {recipe.steps.length} · {currentStep.title}
            </span>
          </div>
        </div>

        {/* Progress bar in center */}
        <div className="hidden md:flex flex-col items-center w-64">
          <div className="flex justify-between w-full text-[11px] text-white/70 mb-1">
            <span>Overall Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#10B981] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* AI Voice Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAiVoiceEnabled(!aiVoiceEnabled)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              aiVoiceEnabled
                ? 'bg-[#10B981]/20 text-[#A7F3D0] border-[#10B981]/40'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {aiVoiceEnabled ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </>
              ) : (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </>
              )}
            </svg>
            <span>{aiVoiceEnabled ? 'AI Voice ON' : 'AI Voice OFF'}</span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Split: Visual Demonstration Left + ALWAYS VISIBLE Instructions Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Animated Cooking Demonstration Area */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-[#121A16] border-r border-white/5">
          <div className="flex-1 flex items-center justify-center">
            {renderDemonstrationGraphic(currentStep)}
          </div>

          {/* AI Voice Speech Prompt Simulation when active */}
          {aiVoiceEnabled && (
            <div className="mt-4 p-3.5 rounded-2xl bg-[#1A2620] border border-[#10B981]/20 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#A7F3D0] uppercase tracking-wider block">
                  AI Kitchen Voice (Warm Chef)
                </span>
                <p className="text-xs text-white/80 leading-relaxed italic mt-0.5">
                  "{currentStep.instruction.split('.')[0]}. Remember: {currentStep.whatToLookFor}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Written Step Instructions (MUST ALWAYS REMAIN VISIBLE!) */}
        <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#16221B]">
          <div className="space-y-6">
            {/* Step Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg bg-[#10B981]/20 text-[#A7F3D0] text-xs font-bold uppercase tracking-wider">
                  Step {currentStep.stepNumber} of {recipe.steps.length}
                </span>
                <span className="text-xs text-white/50">·</span>
                <span className="text-xs text-white/70">Estimated {currentStep.timerMinutes} mins</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {currentStep.title}
              </h1>
            </div>

            {/* Instruction Body - Clear & High Legibility */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xs uppercase font-bold tracking-wider text-white/50 mb-2">Instruction</h3>
              <p className="text-base md:text-lg text-white/95 leading-relaxed font-normal">
                {currentStep.instruction}
              </p>
            </div>

            {/* "What to look for" Sensory Guidance */}
            <div className="p-5 rounded-2xl bg-[#1C2C23] border border-[#10B981]/30">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A7F3D0] uppercase tracking-wider mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>What to look for:</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                {currentStep.whatToLookFor}
              </p>
            </div>

            {/* Chef Tip if available */}
            {currentStep.tip && (
              <div className="flex items-start gap-2.5 text-xs text-white/75 bg-white/5 p-3.5 rounded-xl border border-white/5">
                <span className="text-[#F59E0B] font-bold">Chef Tip:</span>
                <span>{currentStep.tip}</span>
              </div>
            )}

            {/* Interactive Cooking Timer */}
            <div className="p-5 rounded-2xl bg-[#111A15] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-white/60 block">Suggested Step Timer</span>
                <span className="text-3xl font-black tracking-tight text-white tabular-nums">
                  {formatTime(secondsRemaining)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isTimerRunning
                      ? 'bg-[#E86C38] text-white hover:bg-[#D45924]'
                      : 'bg-[#10B981] text-[#0F1713] hover:bg-[#059669]'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                      </svg>
                      <span>Pause Timer</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <span>Start Timer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setSecondsRemaining((currentStep.timerMinutes || 3) * 60);
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/70 transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Previous / Next Step */}
          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                currentStepIndex === 0
                  ? 'text-white/20 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span>Previous Step</span>
            </button>

            {currentStepIndex < recipe.steps.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#10B981] hover:bg-[#059669] text-[#0F1713] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Next Step</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={onExit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#E86C38] hover:bg-[#D45924] text-white active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Complete & Enjoy Meal 🎉</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
