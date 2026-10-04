import React, { useState } from 'react';
import { UserKitchenProfile, UserIdentity, CookingSkill, HealthPriority } from '../types';
import { IDENTITIES_DATA } from '../data/initialProfile';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserKitchenProfile;
  onComplete: (updatedProfile: UserKitchenProfile) => void;
  initialStep?: number;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onComplete,
  initialStep = 1
}) => {
  const [step, setStep] = useState(initialStep);

  // Form states initialized with current profile
  const [selectedIdentity, setSelectedIdentity] = useState<UserIdentity>(userProfile.identity);
  const [budget, setBudget] = useState<number>(userProfile.typicalBudgetRM);
  const [cookingSkill, setCookingSkill] = useState<CookingSkill>(userProfile.cookingSkill);
  const [equipment, setEquipment] = useState<string[]>(userProfile.equipment);
  const [cuisines, setCuisines] = useState<string[]>(userProfile.favoriteCuisines);
  const [avoidFoods, setAvoidFoods] = useState<string[]>(userProfile.foodsToAvoid);
  const [healthPriority, setHealthPriority] = useState<HealthPriority>(userProfile.healthPriority);

  if (!isOpen) return null;

  const handleToggleEquipment = (tool: string) => {
    if (equipment.includes(tool)) {
      if (equipment.length > 1) {
        setEquipment(equipment.filter(t => t !== tool));
      }
    } else {
      setEquipment([...equipment, tool]);
    }
  };

  const handleToggleCuisine = (c: string) => {
    if (cuisines.includes(c)) {
      if (cuisines.length > 1) {
        setCuisines(cuisines.filter(item => item !== c));
      }
    } else {
      setCuisines([...cuisines, c]);
    }
  };

  const handleFinish = () => {
    onComplete({
      ...userProfile,
      identity: selectedIdentity,
      typicalBudgetRM: budget,
      cookingSkill,
      equipment,
      favoriteCuisines: cuisines,
      foodsToAvoid: avoidFoods,
      healthPriority
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#FBF9F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#183B2B]/10 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Onboarding Header with Progress Indicator */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#183B2B]/8 bg-white/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#183B2B]">SavorAI Setup</span>
            <span className="text-xs text-[#1C2520]/50">·</span>
            <span className="text-xs text-[#1C2520]/75 font-semibold">
              Step {step} of 3
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-32 bg-[#EAF2EC] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#183B2B] h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <button
            onClick={onClose}
            className="text-xs text-[#1C2520]/60 hover:text-[#183B2B] font-semibold cursor-pointer"
          >
            Skip for now
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {/* STEP 1: ONBOARDING WELCOME */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-xl mx-auto space-y-3 pt-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF2EC] text-[#183B2B] flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                  🍳
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#183B2B] tracking-tight">
                  Your kitchen, understood.
                </h1>
                <p className="text-sm md:text-base text-[#1C2520]/80 leading-relaxed">
                  SavorAI learns your budget, tools, tastes and health goals — then helps you decide what to cook.
                </p>
              </div>

              {/* Benefits Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                {[
                  {
                    title: 'Cook with what you already have',
                    desc: 'Input pantry staples and get meals tailored to your ingredients without extra grocery runs.'
                  },
                  {
                    title: 'Stay within your budget',
                    desc: 'Accurate Ringgit (RM) cost estimates per plate, keeping home cooking affordable.'
                  },
                  {
                    title: 'Get step-by-step guidance',
                    desc: 'Distraction-free cooking view with visual doneness cues, live timers, and optional AI voice.'
                  },
                  {
                    title: 'Estimate calories from food photos',
                    desc: 'Snap a dish photo for instant portion breakdowns with sensible calorie approximations.'
                  }
                ].map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-[#183B2B]/8 shadow-xs flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#EAF2EC] text-[#183B2B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#183B2B] mb-0.5">{b.title}</h4>
                      <p className="text-[11px] text-[#1C2520]/70 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-2xl bg-[#183B2B] hover:bg-[#132E22] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Start setup →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE IDENTITY */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-[#183B2B] tracking-tight mb-1">
                  Which best describes you?
                </h2>
                <p className="text-xs text-[#1C2520]/70">
                  Your identity changes how SavorAI recommends meals, portions, and budget rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {IDENTITIES_DATA.map((card) => {
                  const isSelected = selectedIdentity === card.id;
                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        setSelectedIdentity(card.id);
                        setBudget(card.defaultBudget);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#183B2B] bg-[#EAF2EC] shadow-sm ring-1 ring-[#183B2B]'
                          : 'border-[#183B2B]/10 bg-white hover:border-[#183B2B]/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-[#183B2B]">{card.title}</span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#183B2B] text-white text-[11px] flex items-center justify-center">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[#E86C38] block mb-2">
                          {card.tagline}
                        </span>
                        <p className="text-xs text-[#1C2520]/75 leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#183B2B]/10 text-[11px] text-[#183B2B] font-medium">
                        Focus: {card.recommendationFocus}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#183B2B]/8">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-[#1C2520]/70 hover:bg-[#F2EFE8] rounded-xl cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#183B2B] text-white text-xs font-bold hover:bg-[#132E22] transition-colors cursor-pointer"
                >
                  Next: Personal Setup →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PERSONAL SETUP */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-[#183B2B] tracking-tight mb-1">
                  Personal Setup
                </h2>
                <p className="text-xs text-[#1C2520]/70">
                  Calibrate your budget, tools, and health priorities. Calories remain the primary nutrition metric.
                </p>
              </div>

              {/* Typical Cooking Budget */}
              <div className="p-4 rounded-2xl bg-white border border-[#183B2B]/8">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold text-[#1C2520]">Typical Meal Budget</span>
                  <span className="font-bold text-[#183B2B]">RM{budget} / meal</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="35"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#EAF2EC] rounded-lg appearance-none cursor-pointer accent-[#183B2B]"
                />
              </div>

              {/* Cooking Skill */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1C2520]">Cooking Skill</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Confident'] as CookingSkill[]).map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => setCookingSkill(sk)}
                      className={`py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                        cookingSkill === sk
                          ? 'bg-[#183B2B] text-white border-[#183B2B]'
                          : 'bg-white text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                      }`}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kitchen Equipment */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1C2520]">Kitchen Equipment You Own</label>
                <div className="flex flex-wrap gap-2">
                  {['Stove', 'Frying pan', 'Rice cooker', 'Air fryer', 'Pot', 'Knife', 'Blender', 'Microwave'].map((tool) => {
                    const isSelected = equipment.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => handleToggleEquipment(tool)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer ${
                          isSelected
                            ? 'bg-[#183B2B] text-white border-[#183B2B]'
                            : 'bg-white text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                        }`}
                      >
                        {isSelected ? `✓ ${tool}` : `+ ${tool}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Favorite Cuisines */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1C2520]">Favourite Cuisines</label>
                <div className="flex flex-wrap gap-2">
                  {['Malaysian', 'Japanese', 'Chinese', 'Korean', 'Western', 'Italian'].map((c) => {
                    const isSelected = cuisines.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleToggleCuisine(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer ${
                          isSelected
                            ? 'bg-[#EAF2EC] text-[#183B2B] font-bold border-[#183B2B]'
                            : 'bg-white text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                        }`}
                      >
                        {isSelected ? `✓ ${c}` : `+ ${c}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* What should SavorAI prioritise? */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#183B2B]">What should SavorAI prioritise?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Balanced meals',
                    'Lower calorie',
                    'Higher protein',
                    'Lower sugar',
                    'Higher fibre'
                  ].map((p) => {
                    const isSelected = healthPriority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setHealthPriority(p as HealthPriority)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#183B2B] text-white border-[#183B2B]'
                            : 'bg-white text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#183B2B]/8">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-[#1C2520]/70 hover:bg-[#F2EFE8] rounded-xl cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-xl bg-[#E86C38] hover:bg-[#D45924] text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Complete Setup & Open Kitchen →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
