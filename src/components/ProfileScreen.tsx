import React, { useState } from 'react';
import { UserKitchenProfile, UserIdentity, CookingSkill, HealthPriority } from '../types';
import { IDENTITIES_DATA } from '../data/initialProfile';

interface ProfileScreenProps {
  userProfile: UserKitchenProfile;
  onUpdateProfile: (updated: Partial<UserKitchenProfile>) => void;
  onOpenIdentityModal: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenIdentityModal
}) => {
  const [activeSection, setActiveSection] = useState<
    'cookingProfile' | 'preferences' | 'equipment' | 'healthGoals' | 'account'
  >('cookingProfile');

  const [savedBanner, setSavedBanner] = useState(false);

  const triggerSaveNotification = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleIdentityChange = (newIdentity: UserIdentity) => {
    const info = IDENTITIES_DATA.find(i => i.id === newIdentity);
    onUpdateProfile({
      identity: newIdentity,
      typicalBudgetRM: info?.defaultBudget || userProfile.typicalBudgetRM
    });
    triggerSaveNotification();
  };

  const handleToggleEquipment = (tool: string) => {
    const exists = userProfile.equipment.includes(tool);
    const updated = exists 
      ? userProfile.equipment.filter(t => t !== tool)
      : [...userProfile.equipment, tool];
    onUpdateProfile({ equipment: updated });
    triggerSaveNotification();
  };

  const allAvailableTools = [
    'Stove', 'Frying pan', 'Rice cooker', 'Air fryer',
    'Pot', 'Knife', 'Blender', 'Microwave', 'Oven', 'Wok'
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#183B2B] tracking-tight mb-1">
            Kitchen Profile & Settings
          </h1>
          <p className="text-sm text-[#1C2520]/75">
            SavorAI remembers your equipment, cooking skill, and tastes across every recommendation.
          </p>
        </div>

        {savedBanner && (
          <div className="px-4 py-2 rounded-xl bg-[#EAF2EC] border border-[#183B2B]/20 text-[#183B2B] text-xs font-semibold animate-fadeIn">
            ✓ Preferences updated & synced to recommendation engine!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#183B2B]/8 shadow-xs space-y-6">
          {/* User Card */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#183B2B]/8">
            <div className="w-16 h-16 rounded-2xl bg-[#183B2B] text-white flex items-center justify-center font-bold text-2xl shadow-xs">
              {userProfile.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#183B2B]">{userProfile.name}</h2>
              <p className="text-xs font-semibold text-[#E86C38]">
                {userProfile.identity} · {userProfile.cookingSkill} cook
              </p>
              <span className="text-[11px] text-[#1C2520]/60 block mt-0.5">
                Profile active · Kuala Lumpur
              </span>
            </div>
          </div>

          {/* Settings Section Navigation Tabs */}
          <nav className="space-y-1">
            {[
              { id: 'cookingProfile', label: 'Cooking profile' },
              { id: 'equipment', label: 'Kitchen equipment' },
              { id: 'preferences', label: 'Food preferences' },
              { id: 'healthGoals', label: 'Health goals' },
              { id: 'account', label: 'Account settings' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                  activeSection === section.id
                    ? 'bg-[#EAF2EC] text-[#183B2B] font-bold shadow-xs'
                    : 'text-[#1C2520]/75 hover:bg-[#F2EFE8]'
                }`}
              >
                <span>{section.label}</span>
                {activeSection === section.id && <span className="text-xs text-[#183B2B]">→</span>}
              </button>
            ))}
          </nav>

          {/* Quick Identity Switcher Callout */}
          <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8">
            <span className="text-xs font-bold text-[#183B2B] block mb-1">
              Active Persona: {userProfile.identity}
            </span>
            <p className="text-[11px] text-[#1C2520]/70 leading-relaxed mb-3">
              Want to see how recommendations change for a Fitness athlete or Family?
            </p>
            <button
              onClick={onOpenIdentityModal}
              className="w-full py-2 rounded-xl bg-white border border-[#183B2B]/15 hover:bg-[#EAF2EC] text-[#183B2B] text-xs font-semibold transition-colors cursor-pointer"
            >
              Choose different identity
            </button>
          </div>
        </div>

        {/* Main Settings Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-[#183B2B]/8 shadow-xs">
          {/* SECTION 1: Cooking Profile */}
          {activeSection === 'cookingProfile' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-[#183B2B] mb-1">Cooking Profile</h3>
                <p className="text-xs text-[#1C2520]/65">
                  These core parameters determine which meals rank highest on your dashboard.
                </p>
              </div>

              {/* Identity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1C2520]">Identity Persona</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {IDENTITIES_DATA.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleIdentityChange(item.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        userProfile.identity === item.id
                          ? 'border-[#183B2B] bg-[#EAF2EC] font-bold text-[#183B2B]'
                          : 'border-[#183B2B]/10 hover:border-[#183B2B]/30 text-[#1C2520]'
                      }`}
                    >
                      <span className="block">{item.title}</span>
                      <span className="text-[10px] text-[#1C2520]/60 font-normal">{item.highlightKey}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typical Budget */}
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#1C2520]">Typical Meal Budget</span>
                  <span className="font-bold text-[#183B2B]">RM{userProfile.typicalBudgetRM} per meal</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="35"
                  value={userProfile.typicalBudgetRM}
                  onChange={(e) => {
                    onUpdateProfile({ typicalBudgetRM: Number(e.target.value) });
                    triggerSaveNotification();
                  }}
                  className="w-full h-1.5 bg-[#EAF2EC] rounded-lg appearance-none cursor-pointer accent-[#183B2B]"
                />
              </div>

              {/* Cooking Skill */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1C2520]">Cooking Skill</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Beginner', 'Intermediate', 'Confident'] as CookingSkill[]).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        onUpdateProfile({ cookingSkill: skill });
                        triggerSaveNotification();
                      }}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        userProfile.cookingSkill === skill
                          ? 'bg-[#183B2B] text-white border-[#183B2B]'
                          : 'bg-[#FBF9F5] text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Household Size */}
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C2520] block">Household Servings</span>
                  <span className="text-[11px] text-[#1C2520]/60">Default serving multiplier for ingredient math</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onUpdateProfile({ householdSize: Math.max(1, userProfile.householdSize - 1) });
                      triggerSaveNotification();
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-[#183B2B]/15 text-[#183B2B] font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-[#183B2B] w-6 text-center">{userProfile.householdSize}</span>
                  <button
                    onClick={() => {
                      onUpdateProfile({ householdSize: Math.min(6, userProfile.householdSize + 1) });
                      triggerSaveNotification();
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-[#183B2B]/15 text-[#183B2B] font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* AI Cooking Voice */}
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C2520] block">AI Cooking Voice</span>
                  <span className="text-[11px] text-[#1C2520]/60">Spoken audio guidance during cooking mode</span>
                </div>
                <select
                  value={userProfile.aiVoicePersona}
                  onChange={(e) => {
                    onUpdateProfile({ aiVoicePersona: e.target.value as any });
                    triggerSaveNotification();
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#183B2B]/15 bg-white text-xs font-semibold text-[#183B2B] cursor-pointer"
                >
                  <option value="Warm Chef">Warm Chef (Friendly & reassuring)</option>
                  <option value="Crisp Guide">Crisp Guide (Concise & exact)</option>
                  <option value="Gentle Coach">Gentle Coach (Patient for beginners)</option>
                </select>
              </div>
            </div>
          )}

          {/* SECTION 2: Kitchen Equipment */}
          {activeSection === 'equipment' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-[#183B2B] mb-1">Kitchen Equipment Inventory</h3>
                <p className="text-xs text-[#1C2520]/65">
                  Click tools to toggle what you own. SavorAI never suggests recipes requiring tools you don't possess.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAvailableTools.map((tool) => {
                  const isOwned = userProfile.equipment.includes(tool);
                  return (
                    <button
                      key={tool}
                      onClick={() => handleToggleEquipment(tool)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isOwned
                          ? 'border-[#183B2B] bg-[#EAF2EC] text-[#183B2B] font-bold shadow-xs'
                          : 'border-[#183B2B]/10 bg-[#FBF9F5] text-[#1C2520]/60 hover:border-[#183B2B]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{tool}</span>
                        <span>{isOwned ? '✓' : '+'}</span>
                      </div>
                      <span className="text-[11px] text-[#1C2520]/60">
                        {isOwned ? 'In your kitchen' : 'Not owned'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: Food Preferences */}
          {activeSection === 'preferences' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-[#183B2B] mb-1">Food Preferences & Cuisines</h3>
                <p className="text-xs text-[#1C2520]/65">
                  Your taste profiles and dietary requirements.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C2520] block mb-2">Favorite Cuisines</label>
                <div className="flex flex-wrap gap-2">
                  {['Malaysian', 'Japanese', 'Chinese', 'Korean', 'Western', 'Italian'].map((cuisine) => {
                    const isSelected = userProfile.favoriteCuisines.includes(cuisine);
                    return (
                      <button
                        key={cuisine}
                        onClick={() => {
                          const updated = isSelected
                            ? userProfile.favoriteCuisines.filter(c => c !== cuisine)
                            : [...userProfile.favoriteCuisines, cuisine];
                          onUpdateProfile({ favoriteCuisines: updated });
                          triggerSaveNotification();
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#183B2B] text-white border-[#183B2B]'
                            : 'bg-[#FBF9F5] text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                        }`}
                      >
                        {isSelected ? `✓ ${cuisine}` : `+ ${cuisine}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C2520] block mb-2">Dietary Focus & Avoided Ingredients</label>
                <div className="flex flex-wrap gap-2">
                  {['Pork-free', 'Beef-free', 'Shellfish-free', 'Dairy-free', 'Peanut-free', 'Halal-friendly'].map((diet) => {
                    const isAvoided = userProfile.foodsToAvoid.includes(diet);
                    return (
                      <button
                        key={diet}
                        onClick={() => {
                          const updated = isAvoided
                            ? userProfile.foodsToAvoid.filter(d => d !== diet)
                            : [...userProfile.foodsToAvoid, diet];
                          onUpdateProfile({ foodsToAvoid: updated });
                          triggerSaveNotification();
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          isAvoided
                            ? 'bg-[#E86C38] text-white border-[#E86C38]'
                            : 'bg-[#FBF9F5] text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                        }`}
                      >
                        {isAvoided ? `✓ ${diet}` : `+ ${diet}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Health Goals */}
          {activeSection === 'healthGoals' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-[#183B2B] mb-1">Health & Nutrition Targets</h3>
                <p className="text-xs text-[#1C2520]/65">
                  Calories remain the primary metric, balanced with protein and dietary fibre.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#1C2520]">Daily Calorie Target</span>
                  <span className="font-bold text-[#183B2B]">{userProfile.dailyCalorieTarget} kcal</span>
                </div>
                <input
                  type="range"
                  min="1400"
                  max="2800"
                  step="50"
                  value={userProfile.dailyCalorieTarget}
                  onChange={(e) => {
                    onUpdateProfile({ dailyCalorieTarget: Number(e.target.value) });
                    triggerSaveNotification();
                  }}
                  className="w-full h-1.5 bg-[#EAF2EC] rounded-lg appearance-none cursor-pointer accent-[#183B2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8">
                  <span className="text-xs text-[#1C2520]/60 block mb-1">Protein Target</span>
                  <span className="text-xl font-bold text-[#1C2520]">{userProfile.dailyProteinTarget}g / day</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8">
                  <span className="text-xs text-[#1C2520]/60 block mb-1">Fibre Target</span>
                  <span className="text-xl font-bold text-[#1C2520]">{userProfile.dailyFibreTarget}g / day</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Account Settings */}
          {activeSection === 'account' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-[#183B2B] mb-1">Account & Preferences</h3>
                <p className="text-xs text-[#1C2520]/65">SavorAI Prototype v1.0 · Desktop Web</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1C2520] block">Default Currency</span>
                  <span className="text-[11px] text-[#1C2520]/60">Malaysian Ringgit (RM)</span>
                </div>
                <span className="text-xs font-bold text-[#183B2B] bg-[#EAF2EC] px-3 py-1 rounded-lg">MYR (RM)</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1C2520] block">Local Storage Memory</span>
                  <span className="text-[11px] text-[#1C2520]/60">Kitchen inventory and onboarding preferences</span>
                </div>
                <span className="text-xs font-bold text-[#10B981]">Saved in Browser</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
