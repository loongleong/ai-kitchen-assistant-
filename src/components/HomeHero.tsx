import { ArrowUpRight, Camera, Check, Clock3, Leaf, Sparkles, Wallet } from 'lucide-react';
import { LazyMotion, domAnimation, m, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { Recipe, UserKitchenProfile } from '../types';
import { getEstimatedMealCostRM } from '../lib/pricing';
import { FoodVisual } from './FoodVisual';
interface Props {userProfile:UserKitchenProfile;featuredRecipe:Recipe;onFindMealsClick:()=>void;onSelectRecipe:(recipe:Recipe)=>void;onScanClick:()=>void;onHealthyClick?:()=>void}
export function HomeHero({featuredRecipe,onFindMealsClick,onSelectRecipe,onScanClick,onHealthyClick}:Props) {
  const reduced = useReducedMotion();
  const pointerX=useMotionValue(0),pointerY=useMotionValue(0);
  const x=useSpring(pointerX,{stiffness:95,damping:28}),y=useSpring(pointerY,{stiffness:95,damping:28});
  const reveal=(delay:number)=>({initial:reduced?false as const:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:reduced?0:.5,delay:reduced?0:delay}});
  return <LazyMotion features={domAnimation}><section className="welcome-hero" aria-labelledby="welcome-title" onPointerMove={event=>{
    if(reduced||event.pointerType!=='mouse'||!window.matchMedia('(hover:hover) and (min-width:768px)').matches)return;
    const bounds=event.currentTarget.getBoundingClientRect();pointerX.set((event.clientX-bounds.left-bounds.width/2)/bounds.width*10);pointerY.set((event.clientY-bounds.top-bounds.height/2)/bounds.height*8);
  }} onPointerLeave={()=>{pointerX.set(0);pointerY.set(0)}}>
    <div className="welcome-top"><span className="eyebrow">YOUR KITCHEN, UNDERSTOOD</span><span>GOOD FOOD. WITHIN REACH.</span></div>
    <div className="welcome-body"><div className="welcome-copy">
      <m.span className="welcome-magic" {...reveal(0)}><Sparkles size={20} />A little kitchen magic</m.span>
      <m.h1 id="welcome-title" {...reveal(.07)}>Tell us what<br />you have.<br /><em>We’ll tell you<br />what you can cook.</em></m.h1>
      <m.p {...reveal(.14)}>A few ingredients. A delicious possibility. Meals that fit your pantry, budget and the way you cook.</m.p>
      <m.div {...reveal(.21)}><button className="action" onClick={onFindMealsClick}>What can I cook?<ArrowUpRight size={22} /></button><button className="welcome-scan" onClick={onScanClick}><Camera size={20} />Scan Food</button>{onHealthyClick&&<button className="welcome-scan" onClick={onHealthyClick}><Leaf size={20} />Explore healthy meals</button>}<span className="welcome-proof"><Check size={17} />Good food starts with what you have.</span></m.div>
    </div><m.div className="welcome-dish" {...reveal(.12)}>
      <m.div className="dish-visual" style={reduced?undefined:{x,y}}>
        <button className="welcome-photo-link" aria-label={'View '+featuredRecipe.name} onClick={()=>onSelectRecipe(featuredRecipe)}><FoodVisual recipe={featuredRecipe} priority /></button>
        <div className="dish-stat stat-match"><Sparkles size={15} />Kitchen inspiration<strong>Everyday<small>ingredients</small></strong></div>
        <div className="dish-stat stat-calories">Calories<strong>{featuredRecipe.calories}<small>kcal</small></strong></div>
        <div className="dish-stat stat-cost"><Wallet size={13} />Estimated meal cost<strong><small>RM</small>{getEstimatedMealCostRM(featuredRecipe).toFixed(2)}</strong></div>
        <div className="dish-stat stat-time"><Clock3 size={15} />Cook time<strong>{featuredRecipe.timeMinutes}<small>min</small></strong></div>
      </m.div>
      <div className="dish-caption"><span className="eyebrow">TODAY’S SMART PICK</span><h2><button onClick={()=>onSelectRecipe(featuredRecipe)}>{featuredRecipe.name}<ArrowUpRight size={17} /></button></h2><p>{featuredRecipe.cuisine} · {featuredRecipe.difficulty} · {featuredRecipe.servings} servings</p><small>Recipe estimate · calories per serving</small></div>
    </m.div></div><div className="welcome-bottom"><span>FROM YOUR PANTRY TO YOUR PLATE</span><em>Good food. Within reach.</em></div>
  </section></LazyMotion>;
}
