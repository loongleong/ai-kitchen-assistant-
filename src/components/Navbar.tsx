import { Bookmark, Camera, ChefHat, ChevronDown, Leaf, Settings, Sparkles } from 'lucide-react';
import { UserKitchenProfile } from '../types';
type Screen = 'home'|'cook'|'recommendations'|'scan'|'healthy'|'saved'|'profile';
interface NavbarProps {activeScreen:Screen;onNavigate:(screen:Screen)=>void;userProfile:UserKitchenProfile;onOpenOnboarding:()=>void}
export function Navbar({activeScreen,onNavigate,userProfile,onOpenOnboarding}:NavbarProps) {
  return <header className="site-header">
    <button className="brand" aria-label="SavorAI home" onClick={()=>onNavigate('home')}><span className="brand-symbol"><ChefHat size={27} /></span>Savor<span>AI</span><span>.</span></button>
    <nav aria-label="Main navigation"><button className={['cook','recommendations'].includes(activeScreen)?'active':''} onClick={()=>onNavigate('cook')}><Sparkles size={16} />What can I cook?</button><button className={activeScreen==='saved'?'active':''} onClick={()=>onNavigate('saved')}><Bookmark size={16} />Saved recipes</button></nav>
    <details className="nav-more"><summary aria-label="More navigation"><span>Your kitchen</span><ChevronDown size={16} /></summary><div>
      <button onClick={event=>{onNavigate('scan');event.currentTarget.closest('details')?.removeAttribute('open')}}><Camera size={16} />Scan Food</button>
      <button onClick={event=>{onNavigate('healthy');event.currentTarget.closest('details')?.removeAttribute('open')}}><Leaf size={16} />Healthy Mode</button>
      <button onClick={event=>{onNavigate('profile');event.currentTarget.closest('details')?.removeAttribute('open')}}><Settings size={16} />Profile & settings</button>
      <button onClick={event=>{onOpenOnboarding();event.currentTarget.closest('details')?.removeAttribute('open')}}><ChefHat size={16} />Kitchen setup</button>
    </div></details>
    <button className="profile-mark" aria-label={'Open '+userProfile.name+"'s profile"} onClick={()=>onNavigate('profile')}>{userProfile.name.slice(0,1)}</button>
  </header>;
}
