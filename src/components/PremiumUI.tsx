import React from 'react';
import { ArrowUpRight, Bookmark, Clock3, Flame, Sparkles, Wallet } from 'lucide-react';
import { DishIllustration } from './DishIllustration';
import { Recipe } from '../types';

export const HudMetric = ({ label, value, unit, prefix, icon }: {
  label: string; value: React.ReactNode; unit?: string; prefix?: string; icon?: React.ReactNode;
}) => (
  <div className="premium-hud">
    <span className="premium-hud-label">{icon}{label}</span>
    <strong>{prefix && <small className="premium-hud-prefix">{prefix}</small>}{value}{unit && <small>{unit}</small>}</strong>
  </div>
);

// The feature consumes existing scores and callbacks; it does not rank or filter recipes.
export const BestMatchFeature = ({ recipe, onSelect, isSaved, onToggleSave }: {
  recipe: Recipe; onSelect: (recipe: Recipe) => void; isSaved: boolean; onToggleSave: (id: string) => void;
}) => (
  <section className="premium-best-match premium-cinematic" aria-labelledby="best-match-title" key={recipe.id}>
    <div className="premium-best-copy">
      <p className="premium-eyebrow"><Sparkles size={13} aria-hidden="true" />Your best pantry match</p>
      <h2 id="best-match-title">{recipe.name}</h2>
      <p className="premium-best-description">{recipe.tagline}</p>
      <p className="premium-best-reason">{recipe.matchReason}</p>
      <div className="premium-best-metrics">
        <HudMetric label="Match" value={recipe.matchScore} unit="%" icon={<Sparkles size={12} />} />
        <HudMetric label="Est. cost" value={recipe.estimatedCostRM.toFixed(2)} prefix="RM" icon={<Wallet size={12} />} />
        <HudMetric label="Cook time" value={recipe.timeMinutes} unit="min" icon={<Clock3 size={12} />} />
        <HudMetric label="Calories" value={recipe.calories} unit="kcal" icon={<Flame size={12} />} />
      </div>
      <div className="premium-best-actions">
        <button type="button" className="premium-action" onClick={() => onSelect(recipe)}>View best match <ArrowUpRight size={16} aria-hidden="true" /></button>
        <button type="button" className="premium-best-save" aria-pressed={isSaved} onClick={() => onToggleSave(recipe.id)}><Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />{isSaved ? 'Saved' : 'Save recipe'}</button>
      </div>
    </div>
    <button type="button" className="premium-best-food" onClick={() => onSelect(recipe)} aria-label={`View best match: ${recipe.name}`}>
      <DishIllustration dishId={recipe.id} size="hero" showSteam={false} className="w-full h-full" />
      <span className="premium-best-food-label">{recipe.cuisine} <span>·</span> {recipe.difficulty}</span>
    </button>
  </section>
);
