import { CuisineSelector } from './CuisineSelector';
import { EquipmentCatalogPanel } from './EquipmentCatalogPanel';
import { SCENE_EQUIPMENT } from '../data/equipmentCatalog';
import { toggleCuisinePreference } from '../data/cuisineCatalog';
import React, { useState, useEffect, useRef } from 'react';
import { ChefHat } from 'lucide-react';
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

  // Reopening setup reads the current profile, including tools/cuisines added in Profile.
  useEffect(() => {
    if (!isOpen) return;
    setStep(initialStep);
    setSelectedIdentity(userProfile.identity);
    setBudget(userProfile.typicalBudgetRM);
    setCookingSkill(userProfile.cookingSkill);
    setEquipment([...userProfile.equipment]);
    setCuisines([...userProfile.favoriteCuisines]);
    setAvoidFoods([...userProfile.foodsToAvoid]);
    setHealthPriority(userProfile.healthPriority);
  }, [isOpen, initialStep, userProfile]);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    dialog?.showModal();
    return ()=>{
      if(dialog?.open)dialog.close();
      if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
    };
  },[isOpen]);
  useEffect(()=>{
    if (!isOpen) return;
    bodyRef.current?.scrollTo({top:0,behavior:'instant'});
    dialogRef.current?.querySelector<HTMLHeadingElement>('h1,h2')?.focus({preventScroll:true});
  },[isOpen,step]);
  if (!isOpen) return null;

  const handleToggleEquipment = (tool:string) => setEquipment(current=>current.includes(tool) ? current.filter(item=>item !== tool) : [...current,tool]);
  const handleToggleCuisine = (cuisine:string) => setCuisines(current=>toggleCuisinePreference(current,cuisine));

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
    <dialog ref={dialogRef} className="setup-dialog savor-design" aria-label="SavorAI Setup" onCancel={onClose}>
      <div 
        className="relative premium-inset w-full max-w-3xl rounded-3xl shadow-2xl border premium-border overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Onboarding Header with Progress Indicator */}
        <div className="flex items-center justify-between px-6 py-4 border-b premium-border premium-soft">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold premium-ink">SavorAI Setup</span>
            <span className="text-xs premium-faint">·</span>
            <span className="text-xs premium-muted font-semibold">
              Step {step} of 3
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-32 premium-tint h-2 rounded-full overflow-hidden">
            <div 
              className="premium-solid h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <button
            onClick={onClose}
            className="text-xs premium-muted premium-hover-ink font-semibold cursor-pointer"
          >
            Skip for now
          </button>
        </div>

        {/* Modal Body */}
        <div ref={bodyRef} className="setup-body p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {/* STEP 1: ONBOARDING WELCOME */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-xl mx-auto space-y-3 pt-4">
                <div className="w-14 h-14 rounded-2xl premium-tint premium-ink flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                  <ChefHat size={30} aria-hidden="true"/>
                </div>
                <h1 tabIndex={-1} className="text-3xl md:text-4xl font-extrabold premium-ink tracking-tight">
                  Your kitchen, understood.
                </h1>
                <p className="text-sm md:text-base premium-muted leading-relaxed">
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
                    desc: 'Estimated meal costs in Ringgit (RM), with current recipe estimates marked as fallbacks.'
                  },
                  {
                    title: 'Get step-by-step guidance',
                    desc: 'Distraction-free cooking view with visual doneness cues, step timers, and text guidance.'
                  },
                  {
                    title: 'Understand your plate',
                    desc: 'Explore sample plates, adjust portion estimates, and keep your daily food log.'
                  }
                ].map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl premium-surface border premium-border shadow-xs flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full premium-tint premium-ink flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold premium-ink mb-0.5">{b.title}</h4>
                      <p className="text-[11px] premium-muted leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-2xl premium-solid premium-hover-solid text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
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
                <h2 tabIndex={-1} className="text-2xl font-bold premium-ink tracking-tight mb-1">
                  Which best describes you?
                </h2>
                <p className="text-xs premium-muted">
                  Your identity changes how SavorAI recommends meals, portions, and budget rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {IDENTITIES_DATA.map((card) => {
                  const isSelected = selectedIdentity === card.id;
                  return (
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      key={card.id}
                      onClick={() => {
                        setSelectedIdentity(card.id);
                        setBudget(card.defaultBudget);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'premium-border premium-tint shadow-sm ring-1 ring-[#183B2B]'
                          : 'premium-border premium-surface premium-hover-border'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm premium-ink">{card.title}</span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full premium-solid text-white text-[11px] flex items-center justify-center">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold premium-accent block mb-2">
                          {card.tagline}
                        </span>
                        <p className="text-xs premium-muted leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t premium-border text-[11px] premium-ink font-medium">
                        Focus: {card.recommendationFocus}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t premium-border">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold premium-muted premium-hover-surface rounded-xl cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl premium-solid text-white text-xs font-bold premium-hover-solid transition-colors cursor-pointer"
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
                <h2 tabIndex={-1} className="text-2xl font-bold premium-ink tracking-tight mb-1">
                  Personal Setup
                </h2>
                <p className="text-xs premium-muted">
                  Calibrate your budget, tools, and health priorities. Calories remain the primary nutrition metric.
                </p>
              </div>

              {/* Typical Cooking Budget */}
              <div className="p-4 rounded-2xl premium-surface border premium-border">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold premium-ink">Typical Meal Budget</span>
                  <span className="font-bold premium-ink">RM{budget} / meal</span>
                </div>
                <input
                  aria-label="Typical Meal Budget"
                  type="range"
                  min="8"
                  max="35"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-1.5 premium-tint rounded-lg appearance-none cursor-pointer accent-[#183B2B]"
                />
              </div>

              {/* Cooking Skill */}
              <div className="space-y-2">
                <label className="text-xs font-semibold premium-ink">Cooking Skill</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Confident'] as CookingSkill[]).map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => setCookingSkill(sk)}
                      className={`py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                        cookingSkill === sk
                          ? 'premium-solid text-white premium-border'
                          : 'premium-surface premium-ink premium-border premium-hover-border'
                      }`}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kitchen Equipment */}
              <div className="space-y-2">
                <label className="text-xs font-semibold premium-ink">Kitchen Equipment You Own</label>
                <div className="flex flex-wrap gap-2">
                  {SCENE_EQUIPMENT.map(({name:tool}) => {
                    const isSelected = equipment.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleToggleEquipment(tool)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer ${
                          isSelected
                            ? 'premium-solid text-white premium-border'
                            : 'premium-surface premium-ink premium-border premium-hover-border'
                        }`}
                      >
                        {isSelected ? `✓ ${tool}` : `+ ${tool}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <EquipmentCatalogPanel selected={equipment} onToggle={handleToggleEquipment} />
              <p className="catalog-selected">Selected: {equipment.join(', ') || 'No tools selected'}</p>

              {/* Favorite Cuisines */}
              <div className="space-y-2">
                <label className="text-xs font-semibold premium-ink">Favourite Cuisines</label>
                <CuisineSelector selected={cuisines} onSelect={handleToggleCuisine} />
              </div>

              {/* What should SavorAI prioritise? */}
              <div className="space-y-2">
                <label className="text-xs font-semibold premium-ink">What should SavorAI prioritise?</label>
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
                            ? 'premium-solid text-white premium-border'
                            : 'premium-surface premium-ink premium-border premium-hover-border'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t premium-border">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold premium-muted premium-hover-surface rounded-xl cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={handleFinish}
                  className="setup-complete px-6 py-2.5 rounded-xl bg-[#E86C38] hover:bg-[#D45924] text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Complete Setup & Open Kitchen →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};
