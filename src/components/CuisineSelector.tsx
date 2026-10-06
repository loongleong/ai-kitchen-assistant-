import React, { useId, useState } from 'react';
import { Check } from 'lucide-react';
import { CUISINE_CATALOG, CUISINE_REGIONS, NO_CUISINE_PREFERENCE, POPULAR_CUISINES, cuisineRecipeCount, normalizeCuisine } from '../data/cuisineCatalog';
import { useRecipeData } from './RecipeDataContext';

interface Props { selected:string|readonly string[]; onSelect:(name:string)=>void; variant?:'cook'|'rail'|'chips' }
export const CuisineSelector:React.FC<Props> = ({selected,onSelect,variant='chips'}) => {
  const {recipes} = useRecipeData();
  const [search,setSearch] = useState('');
  const [region,setRegion] = useState('All regions');
  const id = useId();
  const values = (typeof selected === 'string' ? [selected] : selected).map(normalizeCuisine);
  const option = (name:string, detail=true) => {
    const active = values.includes(name);
    const count = cuisineRecipeCount(recipes,name);
    return <button key={name} type="button" aria-pressed={active} onClick={()=>onSelect(name)} className={variant === 'rail' ? `w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${active ? 'premium-tint font-bold premium-ink' : 'premium-muted premium-hover-surface'}` : variant === 'chips' ? `px-3 py-2 rounded-xl text-xs border cursor-pointer transition-colors ${active ? 'premium-solid text-white border-transparent' : 'premium-surface premium-border premium-ink'}` : undefined}>
      <span>{name}{active && <Check size={13} aria-hidden="true" />}</span>
      {detail && <small>{name === NO_CUISINE_PREFERENCE ? `Explore all ${recipes.length} recipes` : count ? `${count} ${count === 1 ? 'recipe' : 'recipes'}` : 'No recipes yet'}</small>}
    </button>;
  };
  return <div className={`catalog-cuisines catalog-${variant}`}>
    <div className={variant === 'cook' ? 'cook-options cook-cuisines' : variant === 'rail' ? 'space-y-1' : 'flex flex-wrap gap-2'}>{option(NO_CUISINE_PREFERENCE,variant === 'cook')}{POPULAR_CUISINES.map(cuisine=>option(cuisine.name,variant === 'cook'))}</div>
    <p className="catalog-selected">Selected: {values.join(', ') || NO_CUISINE_PREFERENCE}</p>
    <details className="catalog-browser"><summary>Browse all cuisines</summary><div className="catalog-browser-content">
      <label htmlFor={`${id}-search`}>Search cuisines</label><input id={`${id}-search`} type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="e.g. Thai, Mediterranean…" />
      <label htmlFor={`${id}-region`}>Browse by region</label><select id={`${id}-region`} value={region} onChange={event=>setRegion(event.target.value)}><option>All regions</option>{CUISINE_REGIONS.map(item=><option key={item}>{item}</option>)}</select>
      <div className="catalog-list">{CUISINE_REGIONS.filter(item=>region === 'All regions' || region === item).map(group=>{
        const cuisines = CUISINE_CATALOG.filter(item=>item.region === group && item.name.toLowerCase().includes(search.trim().toLowerCase()));
        return cuisines.length ? <section key={group}><h4>{group}</h4><div className={variant === 'cook' ? 'cook-options cook-cuisines' : variant === 'rail' ? 'space-y-1' : 'flex flex-wrap gap-2'}>{cuisines.map(cuisine=>option(cuisine.name))}</div></section> : null;
      })}{!CUISINE_CATALOG.some(item=>(region === 'All regions' || region === item.region) && item.name.toLowerCase().includes(search.trim().toLowerCase())) && <p>No cuisine matches your search.</p>}</div>
      <p className="catalog-note">Cuisines with no recipes can be saved as preferences. They currently return no recommendations.</p>
    </div></details>
  </div>;
};
