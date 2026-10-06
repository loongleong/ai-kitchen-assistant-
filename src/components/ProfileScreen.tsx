import { CuisineSelector } from './CuisineSelector';
import { EquipmentCatalogPanel } from './EquipmentCatalogPanel';
import { SCENE_EQUIPMENT } from '../data/equipmentCatalog';
import { toggleCuisinePreference } from '../data/cuisineCatalog';
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

  return (
    <div className="premium-page premium-profile-page design-support max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="premium-eyebrow"><span />Your kitchen, your way</p>
        <h1 className="text-3xl md:text-4xl font-extrabold premium-ink tracking-tight mb-1">
            Your kitchen, your way.
          </h1>
          <p className="text-sm premium-muted">
            SavorAI remembers your equipment, cooking skill, and tastes across every recommendation.
          </p>
        </div>

        {savedBanner && (
          <div className="px-4 py-2 rounded-xl premium-tint border premium-border premium-ink text-xs font-semibold animate-fadeIn">
            ✓ Preferences updated & synced to recommendation engine!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Sidebar (4 cols) */}
        <div className="premium-panel lg:col-span-4 rounded-3xl p-6 border premium-border shadow-xs space-y-6">
          {/* User Card */}
          <div className="flex items-center gap-4 pb-6 border-b premium-border">
            <div className="premium-profile-avatar w-16 h-16 rounded-2xl text-white flex items-center justify-center font-bold text-2xl shadow-xs">
              {userProfile.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold premium-ink">{userProfile.name}</h2>
              <p className="text-xs font-semibold premium-accent">
                {userProfile.identity} · {userProfile.cookingSkill} cook
              </p>
              <span className="text-[11px] premium-muted block mt-0.5">
                Profile active · Kuala Lumpur
              </span>
            </div>
          </div>

          {/* Settings Section Navigation Tabs */}
          <nav className="space-y-1" aria-label="Profile settings">
            {[
              { id: 'cookingProfile', label: 'Cooking profile' },
              { id: 'equipment', label: 'Kitchen equipment' },
              { id: 'preferences', label: 'Food preferences' },
              { id: 'healthGoals', label: 'Health goals' },
              { id: 'account', label: 'Account settings' }
            ].map((section) => (
              <button
                key={section.id}
                aria-pressed={activeSection === section.id}
                onClick={() => setActiveSection(section.id as typeof activeSection)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                  activeSection === section.id
                    ? 'premium-tint premium-ink font-bold shadow-xs'
                    : 'premium-muted premium-hover-surface'
                }`}
              >
                <span>{section.label}</span>
                {activeSection === section.id && <span className="text-xs premium-ink">→</span>}
              </button>
            ))}
          </nav>

          {/* Quick Identity Switcher Callout */}
          <div className="p-4 rounded-2xl premium-inset border premium-border">
            <span className="text-xs font-bold premium-ink block mb-1">
              Active Persona: {userProfile.identity}
            </span>
            <p className="text-[11px] premium-muted leading-relaxed mb-3">
              Want to see how recommendations change for a Fitness athlete or Family?
            </p>
            <button
              onClick={onOpenIdentityModal}
              className="w-full py-2 rounded-xl premium-surface border premium-border premium-hover-surface premium-ink text-xs font-semibold transition-colors cursor-pointer"
            >
              Choose different identity
            </button>
          </div>
        </div>

        {/* Main Settings Panel (8 cols) */}
        <div className="premium-panel lg:col-span-8 rounded-3xl p-6 md:p-8 border premium-border shadow-xs">
          {/* SECTION 1: Cooking Profile */}
          {activeSection === 'cookingProfile' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold premium-ink mb-1">Cooking Profile</h3>
                <p className="text-xs premium-muted">
                  These preferences help shape your meal recommendations.
                </p>
              </div>

              {/* Identity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold premium-ink">Identity Persona</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {IDENTITIES_DATA.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleIdentityChange(item.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        userProfile.identity === item.id
                          ? 'premium-border premium-tint font-bold premium-ink'
                          : 'premium-border premium-hover-border premium-ink'
                      }`}
                    >
                      <span className="block">{item.title}</span>
                      <span className="text-[10px] premium-muted font-normal">{item.highlightKey}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typical Budget */}
              <div className="p-4 rounded-2xl premium-inset border premium-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold premium-ink">Typical Meal Budget</span>
                  <span className="premium-profile-number font-bold premium-ink">RM{userProfile.typicalBudgetRM}<small> per meal</small></span>
                </div>
                <input
                  aria-label="Typical Meal Budget"
                  type="range"
                  min="8"
                  max="35"
                  value={userProfile.typicalBudgetRM}
                  onChange={(e) => {
                    onUpdateProfile({ typicalBudgetRM: Number(e.target.value) });
                    triggerSaveNotification();
                  }}
                  className="w-full h-1.5 premium-tint rounded-lg appearance-none cursor-pointer accent-[#183B2B]"
                />
              </div>

              {/* Cooking Skill */}
              <div className="space-y-2">
                <label className="text-xs font-semibold premium-ink">Cooking Skill</label>
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
                          ? 'premium-solid text-white premium-border'
                          : 'premium-inset premium-ink premium-border premium-hover-border'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Household Size */}
              <div className="p-4 rounded-2xl premium-inset border premium-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold premium-ink block">Household Servings</span>
                  <span className="text-[11px] premium-muted">Default serving multiplier for ingredient math</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Reduce household servings"
                    onClick={() => {
                      onUpdateProfile({ householdSize: Math.max(1, userProfile.householdSize - 1) });
                      triggerSaveNotification();
                    }}
                    className="w-7 h-7 rounded-lg premium-surface border premium-border premium-ink font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold premium-ink w-6 text-center">{userProfile.householdSize}</span>
                  <button
                    aria-label="Increase household servings"
                    onClick={() => {
                      onUpdateProfile({ householdSize: Math.min(6, userProfile.householdSize + 1) });
                      triggerSaveNotification();
                    }}
                    className="w-7 h-7 rounded-lg premium-surface border premium-border premium-ink font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* AI Cooking Voice */}
              <div className="p-4 rounded-2xl premium-inset border premium-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold premium-ink block">AI Cooking Voice</span>
                  <span className="text-[11px] premium-muted">Voice preference · audio playback is not connected</span>
                </div>
                <select
                  aria-label="AI Cooking Voice preference"
                  value={userProfile.aiVoicePersona}
                  onChange={(e) => {
                    onUpdateProfile({ aiVoicePersona: e.target.value as any });
                    triggerSaveNotification();
                  }}
                  className="px-3 py-1.5 rounded-xl border premium-border premium-surface text-xs font-semibold premium-ink cursor-pointer"
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
                <h3 className="text-xl font-bold premium-ink mb-1">Kitchen Equipment Inventory</h3>
                <p className="text-xs premium-muted">
                  Click tools to toggle what you own. Meal recommendations check cooking capabilities, including compatible tools.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SCENE_EQUIPMENT.map(({name:tool}) => {
                  const isOwned = userProfile.equipment.includes(tool);
                  return (
                    <button
                      key={tool}
                      aria-pressed={isOwned}
                      onClick={() => handleToggleEquipment(tool)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isOwned
                          ? 'premium-border premium-tint premium-ink font-bold shadow-xs'
                          : 'premium-border premium-inset premium-muted premium-hover-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{tool}</span>
                        <span>{isOwned ? '✓' : '+'}</span>
                      </div>
                      <span className="text-[11px] premium-muted">
                        {isOwned ? 'In your kitchen' : 'Not owned'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <EquipmentCatalogPanel selected={userProfile.equipment} onToggle={handleToggleEquipment} />
              <p className="catalog-selected">Selected: {userProfile.equipment.join(', ') || 'No tools selected'}</p>
            </div>
          )}

          {/* SECTION 3: Food Preferences */}
          {activeSection === 'preferences' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold premium-ink mb-1">Food Preferences & Cuisines</h3>
                <p className="text-xs premium-muted">
                  Your taste profiles and dietary requirements.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold premium-ink block mb-2">Favorite Cuisines</label>
                <CuisineSelector selected={userProfile.favoriteCuisines} onSelect={cuisine=>{onUpdateProfile({favoriteCuisines:toggleCuisinePreference(userProfile.favoriteCuisines,cuisine)});triggerSaveNotification();}} />
              </div>

              <div>
                <label className="text-xs font-semibold premium-ink block mb-2">Dietary Focus & Avoided Ingredients</label>
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
                            ? 'bg-[#E86C38] text-[#0E261C] border-[#E86C38]'
                            : 'premium-inset premium-ink premium-border premium-hover-border'
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
                <h3 className="text-xl font-bold premium-ink mb-1">Health & Nutrition Targets</h3>
                <p className="text-xs premium-muted">
                  Calories remain the primary metric, balanced with protein and dietary fibre.
                </p>
              </div>

              <div className="p-4 rounded-2xl premium-inset border premium-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold premium-ink">Daily Calorie Target</span>
                  <span className="premium-profile-number font-bold premium-ink">{userProfile.dailyCalorieTarget}<small> kcal</small></span>
                </div>
                <input
                  type="range"
                  min="1400"
                  aria-label="Daily Calorie Target"
                  max="2800"
                  step="50"
                  value={userProfile.dailyCalorieTarget}
                  onChange={(e) => {
                    onUpdateProfile({ dailyCalorieTarget: Number(e.target.value) });
                    triggerSaveNotification();
                  }}
                  className="w-full h-1.5 premium-tint rounded-lg appearance-none cursor-pointer accent-[#183B2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl premium-inset border premium-border">
                  <span className="text-xs premium-muted block mb-1">Protein Target</span>
                  <span className="text-xl font-bold premium-ink">{userProfile.dailyProteinTarget}g / day</span>
                </div>
                <div className="p-4 rounded-2xl premium-inset border premium-border">
                  <span className="text-xs premium-muted block mb-1">Fibre Target</span>
                  <span className="text-xl font-bold premium-ink">{userProfile.dailyFibreTarget}g / day</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Account Settings */}
          {activeSection === 'account' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold premium-ink mb-1">Account & Preferences</h3>
                <p className="text-xs premium-muted">SavorAI · Your kitchen preferences</p>
              </div>

              <div className="p-4 rounded-2xl premium-inset border premium-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold premium-ink block">Default Currency</span>
                  <span className="text-[11px] premium-muted">Malaysian Ringgit (RM)</span>
                </div>
                <span className="text-xs font-bold premium-ink premium-tint px-3 py-1 rounded-lg">MYR (RM)</span>
              </div>

              <div className="p-4 rounded-2xl premium-inset border premium-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold premium-ink block">Local Storage Memory</span>
                  <span className="text-[11px] premium-muted">Kitchen inventory and onboarding preferences</span>
                </div>
                <span className="text-xs font-bold premium-positive">Saved in Browser</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
