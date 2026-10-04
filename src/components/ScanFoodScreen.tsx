import React, { useState } from 'react';
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title & Subtitle Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#183B2B] tracking-tight mb-2">
          Scan your food
        </h1>
        <p className="text-base text-[#1C2520]/75">
          Take a photo and get an estimated calorie and nutrition breakdown.
        </p>
      </div>

      {/* Two-Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Camera Area (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#183B2B]/8 shadow-xs">
            {/* Viewfinder Camera Simulation */}
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#1C2520] to-[#121A16] border-2 border-dashed border-[#183B2B]/30 flex flex-col items-center justify-center p-6 overflow-hidden">
              {/* Corner Viewfinder brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/60 rounded-tl" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/60 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/60 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/60 rounded-br" />

              {/* Scanning visual indicator */}
              {isAnalyzing ? (
                <div className="flex flex-col items-center text-center animate-pulse">
                  <div className="w-12 h-12 rounded-full border-2 border-[#10B981] border-t-transparent animate-spin mb-3" />
                  <span className="text-sm font-bold text-white">Analyzing food components...</span>
                  <span className="text-xs text-white/60 mt-1">Recognizing portions & cooking style</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#EAF2EC]/10 border border-white/20 flex items-center justify-center text-white mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white block mb-1">
                    Point camera or upload a dish photo
                  </span>
                  <p className="text-xs text-white/70 max-w-xs">
                    Works for home-cooked meals, hawker stalls, and restaurant plates.
                  </p>
                </div>
              )}

              {/* Current detected label badge */}
              <div className="absolute bottom-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-white font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="truncate max-w-[240px]">{selectedScan.mealName}</span>
              </div>
            </div>

            {/* Buttons: Take Photo / Upload Image */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={() => handleSelectPreset(PRESET_MEALS[0])}
                className="py-3 px-4 rounded-xl bg-[#183B2B] hover:bg-[#132E22] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Take Photo</span>
              </button>

              <button 
                onClick={() => handleSelectPreset(PRESET_MEALS[1])}
                className="py-3 px-4 rounded-xl bg-[#F2EFE8] hover:bg-[#EAF2EC] text-[#183B2B] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Upload Image</span>
              </button>
            </div>

            {/* Mandatory Note per brief: "Photo-based nutrition is an estimate. You can correct portions before saving." */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#FFF8F5] border border-[#E86C38]/20 flex items-start gap-2.5">
              <span className="text-[#E86C38] font-bold text-xs mt-0.5">ℹ</span>
              <p className="text-xs text-[#1C2520]/80 leading-relaxed font-medium">
                Photo-based nutrition is an estimate. You can correct portions before saving.
              </p>
            </div>
          </div>

          {/* Quick preset selector to test realistic recognition scenarios */}
          <div className="bg-white rounded-3xl p-5 border border-[#183B2B]/8 shadow-xs">
            <span className="text-xs font-bold text-[#183B2B] block mb-2.5">
              Try sample detected dishes:
            </span>
            <div className="space-y-2">
              {PRESET_MEALS.map((preset) => (
                <button
                  key={preset.mealName}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                    selectedScan.mealName === preset.mealName
                      ? 'bg-[#EAF2EC] border-[#183B2B] font-bold text-[#183B2B]'
                      : 'bg-[#FBF9F5] border-[#183B2B]/10 hover:border-[#183B2B]/30 text-[#1C2520]'
                  }`}
                >
                  <span className="truncate">{preset.mealName}</span>
                  <span className="text-[#183B2B] font-semibold shrink-0 ml-2">≈ {preset.totalCalories} kcal</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Preview (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 md:p-8 border border-[#183B2B]/8 shadow-xs space-y-6">
          {/* Detected Meal Name */}
          <div className="pb-4 border-b border-[#183B2B]/8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#183B2B] block mb-1">
              Detected Meal Analysis
            </span>
            <h2 className="text-2xl font-extrabold text-[#183B2B] tracking-tight">
              {selectedScan.mealName}
            </h2>
          </div>

          {/* Calories Most Visually Prominent Value */}
          <div className="p-6 rounded-3xl bg-[#183B2B] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs text-white/70 font-medium block mb-1">Estimated Energy</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-black tracking-tight tabular-nums">
                  ≈ {currentTotalCalories}
                </span>
                <span className="text-sm font-semibold text-white/80">kcal</span>
              </div>
              <span className="text-[11px] text-[#A7F3D0] mt-1 block">
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
              <h3 className="font-bold text-sm text-[#183B2B]">Detected Components</h3>
              <button
                onClick={() => setIsAdjusting(!isAdjusting)}
                className="text-xs font-semibold text-[#E86C38] hover:underline cursor-pointer"
              >
                {isAdjusting ? 'Done Adjusting' : 'Adjust Portions'}
              </button>
            </div>

            <div className="space-y-2.5">
              {itemsBreakdown.map((item, idx) => (
                <div
                  key={item.name}
                  className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/6 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <span className="font-bold text-[#1C2520] block">{item.name}</span>
                    <span className="text-[#1C2520]/60 text-[11px]">{item.portion}</span>
                  </div>

                  {/* Interactive portion adjuster controls */}
                  {isAdjusting ? (
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-[#183B2B]/15">
                      <button
                        onClick={() => handleAdjustPortion(idx, -0.5)}
                        className="w-6 h-6 rounded-lg bg-[#F2EFE8] flex items-center justify-center text-[#183B2B] font-bold cursor-pointer hover:bg-[#EAF2EC]"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#183B2B] w-8 text-center">{item.amount}</span>
                      <button
                        onClick={() => handleAdjustPortion(idx, 0.5)}
                        className="w-6 h-6 rounded-lg bg-[#F2EFE8] flex items-center justify-center text-[#183B2B] font-bold cursor-pointer hover:bg-[#EAF2EC]"
                      >
                        +
                      </button>
                    </div>
                  ) : null}

                  <div className="text-right">
                    <span className="font-bold text-[#183B2B] tabular-nums block">
                      {item.calories} kcal
                    </span>
                    <span className="text-[10px] text-[#1C2520]/50">
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
              className="w-full py-3.5 rounded-2xl bg-[#183B2B] hover:bg-[#132E22] active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
