import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Globe2, Search, Shuffle, Sparkles } from 'lucide-react';
import { CUISINE_CATALOG, CUISINE_REGIONS, NO_CUISINE_PREFERENCE, POPULAR_CUISINES, cuisineRecipeCount } from '../data/cuisineCatalog';
import { APPROVED_VISUALS, CUISINE_VISUALS } from '../data/visualAssets';
import { useRecipeData } from './RecipeDataContext';
import { FoodVisual } from './FoodVisual';
import { DesignAction, DesignHeading, DesignSheet } from './DesignUI';

export function CuisineDiscovery({selected,onSelect,onNext}:{selected:string;onSelect:(value:string)=>void;onNext:()=>void}) {
  const {recipes}=useRecipeData();
  const [explorer,setExplorer]=useState(false),[search,setSearch]=useState(''),[region,setRegion]=useState('All regions');
  const visual=CUISINE_VISUALS[selected];
  const count=cuisineRecipeCount(recipes,selected);
  const surprise=()=>{const available=POPULAR_CUISINES.filter(cuisine=>cuisineRecipeCount(recipes,cuisine.name)>0);if(available.length)onSelect(available[Math.floor(Math.random()*available.length)].name)};
  return <><div className="discovery-grid"><section className="cuisine-panel">
    <DesignHeading eyebrow="GOOD FOOD STARTS WITH YOU" title="What are you craving?" description="A familiar favourite or a little adventure. Follow your appetite." />
    <div className="section-label"><span>POPULAR CUISINES</span><span>01 — 03</span></div>
    <div className="cuisine-grid">{POPULAR_CUISINES.map(cuisine=><button type="button" key={cuisine.id} className={`cuisine-card ${selected===cuisine.name?'active':''}`} aria-pressed={selected===cuisine.name} onClick={()=>onSelect(cuisine.name)}>
      <FoodVisual {...CUISINE_VISUALS[cuisine.name]} /><div className="cuisine-caption"><div><span>{cuisine.name}</span><small>{cuisineRecipeCount(recipes,cuisine.name)} recipes available</small></div><span className="selection-circle">{selected===cuisine.name?<Check size={13}/>:<ArrowUpRight size={13}/>}</span></div>
    </button>)}</div>
    <button type="button" className="explore-link" onClick={()=>{setSearch('');setExplorer(true)}}><Globe2 size={17}/><span>Explore all cuisines</span><span className="muted">A world of flavours</span><ArrowRight size={16}/></button>
    <div className="open-options"><button type="button" className={`select-chip ${selected===NO_CUISINE_PREFERENCE?'selected':''}`} aria-pressed={selected===NO_CUISINE_PREFERENCE} onClick={()=>onSelect(NO_CUISINE_PREFERENCE)}>{selected===NO_CUISINE_PREFERENCE&&<Check size={14}/>}No preference</button><button type="button" className="text-button" onClick={surprise}><Shuffle size={15}/>Surprise me</button></div>
    <p className="cuisine-availability" role="status">{selected===NO_CUISINE_PREFERENCE?`Explore all ${recipes.length} recipes.`:count?`${selected} · ${count} recipes in your catalog.`:`${selected} is supported as a preference. No recipes for it are in the current catalog yet.`}</p>
    <div className="step-footer"><span>You bring the craving.<br/><strong>We’ll find the possibilities.</strong></span><DesignAction onClick={onNext}>Continue</DesignAction></div>
  </section><aside className="discovery-hero">
    <FoodVisual key={selected} src={visual?.src??APPROVED_VISUALS.inspiration} alt={visual?.alt??'Thai basil chicken: culinary inspiration'} priority width={1264} height={848}/><div className="hero-shade"/>
    <div className="hero-top"><span className="hero-label"><span className="live-dot"/>YOUR PERSONAL KITCHEN ASSISTANT</span></div>
    <div className="hero-copy"><div className="hero-overline">LESS GUESSWORK. MORE GOOD FOOD.</div><h2>A little inspiration.<br/>A really good meal.</h2><p>Tell us what you have.<br/>We’ll tell you what you can cook.</p></div>
    <div className="hud-note"><span className="hud-icon"><Sparkles size={20}/></span><div><strong>Your kitchen. Your possibilities.</strong><p>Good meals start with what you already have.</p></div><ArrowUpRight size={18}/></div>
    <div className="hero-bottom"><span>{visual?`${selected.toUpperCase()} INSPIRATION`:'CULINARY INSPIRATION'}</span><small>Photography for inspiration · recommendations use your recipe catalog</small></div>
  </aside></div>
  <DesignSheet open={explorer} onClose={()=>setExplorer(false)} title="A world of flavours"><div className="search-field"><Search size={18}/><input type="search" aria-label="Search cuisines" placeholder="Find a cuisine…" value={search} onChange={event=>setSearch(event.target.value)}/></div><label className="eyebrow" htmlFor="cuisine-region">BROWSE BY REGION</label><select id="cuisine-region" value={region} onChange={event=>setRegion(event.target.value)}><option>All regions</option>{CUISINE_REGIONS.map(group=><option key={group}>{group}</option>)}</select><div className="region-list">{CUISINE_REGIONS.filter(group=>region==='All regions'||region===group).map(group=>{
    const matches=CUISINE_CATALOG.filter(cuisine=>cuisine.region===group&&cuisine.name.toLowerCase().includes(search.trim().toLowerCase()));
    return matches.length?<section key={group}><h3 className="eyebrow">{group}</h3>{matches.map(cuisine=><button type="button" className="explorer-item" key={cuisine.id} aria-pressed={selected===cuisine.name} onClick={()=>{onSelect(cuisine.name);setExplorer(false)}}><span>{cuisine.name}<small>{cuisineRecipeCount(recipes,cuisine.name)||'No'} recipes in the current catalog</small></span>{selected===cuisine.name?<Check size={17}/>:<ArrowUpRight size={16}/>}</button>)}</section>:null;
  })}</div>{!CUISINE_CATALOG.some(cuisine=>(region==='All regions'||region===cuisine.region)&&cuisine.name.toLowerCase().includes(search.trim().toLowerCase()))&&<p>No cuisines found. Try another search.</p>}<p className="catalog-note">Preferences with no recipes currently return no recommendations.</p></DesignSheet></>;
}
