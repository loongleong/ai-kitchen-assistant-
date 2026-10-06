import React, { useState } from 'react';
import { DishIllustration } from './DishIllustration';
import { Camera } from 'lucide-react';
import { DesignHeading } from './DesignUI';
import { FoodScanResult, UserKitchenProfile } from '../types';

interface ScanFoodScreenProps {
  userProfile: UserKitchenProfile;
  onSaveToDailyLog: (calories: number, protein: number) => void;
}

const PRESET_MEALS: FoodScanResult[] = [
  {
    mealName: 'Chicken chop with fries and salad',
    imageAlt: 'Grilled chicken chop plate with french fries, garden salad and pepper sauce',
    totalCalories: 855,
    protein: 42,
    carbs: 74,
    fat: 36,
    disclaimer: 'Photo-based nutrition is an estimate. You can correct portions before saving.',
    items: [
      { name: 'Grilled Chicken Chop', portion: '180g (1 chop)', calories: 380, unit: 'g', amount: 180, factor: 2.11 },
      { name: 'Crispy French Fries', portion: '120g portion', calories: 290, unit: 'g', amount: 120, factor: 2.41 },
      { name: 'Garden Salad with Vinaigrette', portion: '80g', calories: 45, unit: 'g', amount: 80, factor: 0.56 },
      { name: 'Black Pepper Gravy Sauce', portion: '2 tbsp (30ml)', calories: 140, unit: 'tbsp', amount: 2, factor: 70 }
    ]
  },
  {
    mealName: 'Malaysian Nasi Lemak with Egg & Sambal',
    imageAlt: 'Fragrant coconut rice with hard-boiled egg, spicy sambal, peanuts and anchovies',
    totalCalories: 640,
    protein: 20,
    carbs: 78,
    fat: 28,
    disclaimer: 'Photo-based nutrition is an estimate. You can correct portions before saving.',
    items: [
      { name: 'Santan Coconut Rice', portion: '1.5 cups (220g)', calories: 360, unit: 'cup', amount: 1.5, factor: 240 },
      { name: 'Sambal Tumis', portion: '2 tbsp (35g)', calories: 110, unit: 'tbsp', amount: 2, factor: 55 },
      { name: 'Hard Boiled Egg', portion: '1 whole (50g)', calories: 75, unit: 'egg', amount: 1, factor: 75 },
      { name: 'Fried Ikan Bilis & Peanuts', portion: '25g', calories: 95, unit: 'g', amount: 25, factor: 3.8 }
    ]
  },
  {
    mealName: 'Teriyaki Chicken Donburi with Broccoli',
    imageAlt: 'Teriyaki chicken rice bowl with steamed broccoli and sesame seeds',
    totalCalories: 560,
    protein: 38,
    carbs: 64,
    fat: 16,
    disclaimer: 'Photo-based nutrition is an estimate. You can correct portions before saving.',
    items: [
      { name: 'Glazed Teriyaki Chicken', portion: '160g', calories: 280, unit: 'g', amount: 160, factor: 1.75 },
      { name: 'Steamed White Rice', portion: '1.5 cups (200g)', calories: 210, unit: 'cup', amount: 1.5, factor: 140 },
      { name: 'Steamed Broccoli Florets', portion: '80g', calories: 28, unit: 'g', amount: 80, factor: 0.35 },
      { name: 'Teriyaki Pan Glaze & Sesame', portion: '1.5 tbsp', calories: 42, unit: 'tbsp', amount: 1.5, factor: 28 }
    ]
  }
];

export const ScanFoodScreen: React.FC<ScanFoodScreenProps> = ({
  userProfile,
  onSaveToDailyLog
}) => {
  const [selectedScan, setSelectedScan] = useState<FoodScanResult>(PRESET_MEALS[0]);
  const [itemsBreakdown, setItemsBreakdown] = useState(PRESET_MEALS[0].items);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Recalculate total calories & macros dynamically based on adjusted items
  const currentTotalCalories = Math.round(
    itemsBreakdown.reduce((sum, item) => sum + item.calories, 0)
  );
  const currentProtein = Math.round(selectedScan.protein * (currentTotalCalories / selectedScan.totalCalories));
  const currentCarbs = Math.round(selectedScan.carbs * (currentTotalCalories / selectedScan.totalCalories));
  const currentFat = Math.round(selectedScan.fat * (currentTotalCalories / selectedScan.totalCalories));

  const handleSelectPreset = (preset: FoodScanResult) => {
    setIsAnalyzing(true);
    setSavedSuccess(false);
    setTimeout(() => {
      setSelectedScan(preset);
      setItemsBreakdown(preset.items);
      setIsAnalyzing(false);
    }, 450);
  };

  const handleAdjustPortion = (index: number, delta: number) => {
    setItemsBreakdown((prev) => {
      const copy = [...prev];
      const target = { ...copy[index] };
      const newAmount = Math.max(0.5, target.amount + delta);
      target.amount = Math.round(newAmount * 10) / 10;
      target.calories = Math.round(target.amount * target.factor);
      target.portion = `${target.amount} ${target.unit}`;
      copy[index] = target;
      return copy;
    });
  };

  const handleSave = () => {
    onSaveToDailyLog(currentTotalCalories, currentProtein);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="premium-page design-support scan-screen max-w-7xl mx-auto px-6 py-8">
      {/* Title & Subtitle Header */}
      <DesignHeading eyebrow="A CLOSER LOOK AT YOUR PLATE" title="Food, in a little more detail." description="Explore sample plate estimates. Adjust the portions and keep a daily food log."/>
      {/* Two-Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Camera Area (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="premium-surface rounded-3xl p-6 md:p-8 border premium-border shadow-xs">
            <div className="premium-scan-viewfinder aspect-[4/3]">
              <DishIllustration dishId={selectedScan.mealName === PRESET_MEALS[0].mealName ? 'scan-chicken-chop' : selectedScan.mealName === PRESET_MEALS[1].mealName ? 'scan-nasi-lemak' : 'scan-teriyaki'} className="w-full h-full" showSteam={false} />
              <div className="premium-scan-intro"><span><Camera size={14} aria-hidden="true" /></span><span>Sample dish preview</span></div>
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-[#183B2B]/70 px-4 py-3 backdrop-blur-md text-white text-xs">{selectedScan.mealName}</div>
              {isAnalyzing && <div className="premium-scan-analysis"><div className="w-9 h-9 rounded-full border-2 border-white/40 border-t-white animate-spin mb-4" /><span className="text-sm text-white">Loading sample plate…</span><span className="text-xs text-white/60 mt-2">Preparing the sample portion breakdown</span></div>}
            </div>

            {/* Buttons: Take Photo / Upload Image */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={() => handleSelectPreset(PRESET_MEALS[0])}
                className="py-3 px-4 rounded-xl premium-solid premium-hover-solid text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Preview chicken plate</span>
              </button>

              <button 
                onClick={() => handleSelectPreset(PRESET_MEALS[1])}
                className="py-3 px-4 rounded-xl premium-inset premium-hover-surface premium-ink text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Preview nasi lemak</span>
              </button>
            </div>

            {/* Mandatory Note per brief: "Photo-based nutrition is an estimate. You can correct portions before saving." */}
            <div className="mt-5 p-3.5 rounded-2xl premium-warm border border-[#E86C38]/20 flex items-start gap-2.5">
              <span className="premium-accent font-bold text-xs mt-0.5">ℹ</span>
              <p className="text-xs premium-muted leading-relaxed font-medium">
                Photo-based nutrition is an estimate. You can correct portions before saving.
              </p>
            </div>
          </div>

          {/* Quick preset selector to test realistic recognition scenarios */}
          <div className="premium-surface rounded-3xl p-5 border premium-border shadow-xs">
            <span className="text-xs font-bold premium-ink block mb-2.5">
              Explore sample dishes:
            </span>
            <div className="space-y-2">
              {PRESET_MEALS.map((preset) => (
                <button
                  key={preset.mealName}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                    selectedScan.mealName === preset.mealName
                      ? 'premium-tint premium-border font-bold premium-ink'
                      : 'premium-inset premium-border premium-hover-border premium-ink'
                  }`}
                >
                  <span className="truncate">{preset.mealName}</span>
                  <span className="premium-ink font-semibold shrink-0 ml-2">≈ {preset.totalCalories} kcal</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Preview (6 cols) */}
        <div className="lg:col-span-6 premium-surface rounded-3xl p-6 md:p-8 border premium-border shadow-xs space-y-6">
          {/* Detected Meal Name */}
          <div className="pb-4 border-b premium-border">
            <span className="text-[11px] font-bold uppercase tracking-wider premium-ink block mb-1">
              SAMPLE PLATE ANALYSIS
            </span>
            <h2 className="text-2xl font-extrabold premium-ink tracking-tight">
              {selectedScan.mealName}
            </h2>
          </div>

          {/* Calories Most Visually Prominent Value */}
          <div className="premium-scan-energy premium-hud p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs text-white/70 font-medium block mb-1">Estimated Energy</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-black tracking-tight tabular-nums">
                  ≈ {currentTotalCalories}
                </span>
                <span className="text-sm font-semibold text-white/80">kcal</span>
              </div>
              <span className="text-[11px] premium-positive mt-1 block">
                Adjusted for current portion estimates
              </span>
            </div>

            {/* Secondary Nutrition: Protein, Carbs, Fat */}
            <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-white/15 pt-3 md:pt-0 md:pl-6 text-center">
              <div>
                <span className="text-[10px] text-white/60 block">Protein</span>
                <span className="text-base font-bold text-white tabular-nums">{currentProtein}g</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block">Carbs</span>
                <span className="text-base font-bold text-white tabular-nums">{currentCarbs}g</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block">Fat</span>
                <span className="text-base font-bold text-white tabular-nums">{currentFat}g</span>
              </div>
            </div>
          </div>

          {/* Food Breakdown with "Adjust portions" */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm premium-ink">Plate components</h3>
              <button
                onClick={() => setIsAdjusting(!isAdjusting)}
                className="text-xs font-semibold premium-accent hover:underline cursor-pointer"
              >
                {isAdjusting ? 'Done Adjusting' : 'Adjust Portions'}
              </button>
            </div>

            <div className="premium-scan-components space-y-2.5">
              {itemsBreakdown.map((item, idx) => (
                <div
                  key={item.name}
                  className="p-3.5 rounded-2xl premium-inset border premium-border flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <span className="font-bold premium-ink block">{item.name}</span>
                    <span className="premium-muted text-[11px]">{item.portion}</span>
                  </div>

                  {/* Interactive portion adjuster controls */}
                  {isAdjusting ? (
                    <div className="flex items-center gap-2 premium-surface px-2 py-1 rounded-xl border premium-border">
                      <button
                        aria-label={'Reduce '+item.name+' portion'}
                        onClick={() => handleAdjustPortion(idx, -0.5)}
                        className="w-6 h-6 rounded-lg premium-inset flex items-center justify-center premium-ink font-bold cursor-pointer premium-hover-surface"
                      >
                        -
                      </button>
                      <span className="font-bold premium-ink w-8 text-center">{item.amount}</span>
                      <button
                        aria-label={'Increase '+item.name+' portion'}
                        onClick={() => handleAdjustPortion(idx, 0.5)}
                        className="w-6 h-6 rounded-lg premium-inset flex items-center justify-center premium-ink font-bold cursor-pointer premium-hover-surface"
                      >
                        +
                      </button>
                    </div>
                  ) : null}

                  <div className="text-right">
                    <span className="font-bold premium-ink tabular-nums block">
                      {item.calories} kcal
                    </span>
                    <span className="text-[10px] premium-faint">
                      {Math.round((item.calories / currentTotalCalories) * 100)}% of plate
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action: Save to Daily Log */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl premium-solid premium-hover-solid active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              <span>{savedSuccess ? 'Logged into Daily Snapshot! ✓' : 'Save to Daily Food Log'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
