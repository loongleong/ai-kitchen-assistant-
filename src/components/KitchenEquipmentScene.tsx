import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChefHat, GripHorizontal, Plus, X } from 'lucide-react';
import { findEquipment } from '../data/equipmentCatalog';
import { KITCHEN_ZONES } from '../data/kitchenLayout';
import { APPROVED_VISUALS } from '../data/visualAssets';
import { EquipmentCatalogPanel } from './EquipmentCatalogPanel';
import { DesignAction } from './DesignUI';

interface Props {selectedEquipment:string[];onToggle:(tool:string)=>void;onNext?:()=>void;disabled?:boolean}
export function KitchenEquipmentScene({selectedEquipment,onToggle,onNext,disabled}:Props) {
  const viewport=useRef<HTMLDivElement>(null);
  const drag=useRef({start:0,scroll:0,active:false,moved:false});
  const navigationZone=useRef(0),panningTo=useRef<number|null>(null);
  const [activeZone,setActiveZone]=useState(0),[dragging,setDragging]=useState(false);
  const goTo=(index:number)=>{navigationZone.current=index;const el=viewport.current;if(el){panningTo.current=(el.scrollWidth-el.clientWidth)*index/(KITCHEN_ZONES.length-1);el.scrollTo({left:panningTo.current,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}};
  const endDrag=(event:React.PointerEvent<HTMLDivElement>)=>{drag.current.active=false;setDragging(false);if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)};
  return <><div className="panoramic-layout"><div className="panorama-card">
    <div className="panorama-toolbar"><span><GripHorizontal size={17}/>Drag or swipe to explore your kitchen</span><span>0{activeZone+1}<i>/ 04</i></span></div>
    <div ref={viewport} className={'panorama-viewport'+(dragging?' is-dragging':'')} tabIndex={0} role="region" aria-label="Panoramic kitchen. Drag, swipe or use arrow keys to explore four zones."
      onScroll={event=>{const el=event.currentTarget;const zone=Math.min(3,Math.round(el.scrollLeft/Math.max(1,el.scrollWidth-el.clientWidth)*3));setActiveZone(zone);if(panningTo.current!==null&&Math.abs(el.scrollLeft-panningTo.current)<2)panningTo.current=null;if(panningTo.current===null)navigationZone.current=zone}}
      onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();goTo(Math.max(0,Math.min(3,navigationZone.current+(event.key==='ArrowRight'?1:-1))))}else if(event.key==='Home'||event.key==='End'){event.preventDefault();goTo(event.key==='Home'?0:3)}}}
      onPointerDown={event=>{panningTo.current=null;navigationZone.current=activeZone;if(event.pointerType!=='mouse'||event.button!==0)return;drag.current={start:event.clientX,scroll:event.currentTarget.scrollLeft,active:true,moved:false}}}
      onWheel={()=>{panningTo.current=null}}
      onPointerMove={event=>{const state=drag.current;if(!state.active)return;const delta=event.clientX-state.start;if(Math.abs(delta)>6){state.moved=true;setDragging(true);event.currentTarget.setPointerCapture(event.pointerId)}if(state.moved)event.currentTarget.scrollLeft=state.scroll-delta}}
      onPointerUp={endDrag} onPointerCancel={event=>{endDrag(event);drag.current.moved=false}}
      onPointerLeave={()=>{if(!drag.current.moved)drag.current.active=false}}
      onClickCapture={event=>{if(drag.current.moved){event.preventDefault();event.stopPropagation();drag.current.moved=false}}}>
      <div className="panorama-track"><img src={APPROVED_VISUALS.panorama} alt="Continuous forest-green kitchen with cooking, preparation, appliance and storage areas" width="2064" height="512" draggable={false} decoding="async"/>
      {KITCHEN_ZONES.map((zone,index)=><div className="panorama-zone" key={zone.name}><div className="panorama-zone-label"><span>0{index+1} / {zone.name.toUpperCase()} ZONE</span><p>{zone.description}</p></div>{zone.tools.map(([id,x,y])=>{
        const tool=findEquipment(id);if(!tool)return null;
        const selected=selectedEquipment.includes(tool.name);
        return <button type="button" key={id} className={'panorama-tool'+(selected?' is-selected':'')} style={{left:x+'%',top:y+'%'}} aria-label={tool.name} aria-pressed={selected} onClick={()=>onToggle(tool.name)} onFocus={event=>{if(event.currentTarget.matches(':focus-visible'))event.currentTarget.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'})}}>{selected?<Check size={14}/>:<Plus size={14}/>}<span>{tool.name}</span></button>;
      })}</div>)}</div>
    </div>
    <div className="panorama-navigation"><button type="button" aria-label="Explore previous kitchen zone" disabled={activeZone===0} onClick={()=>goTo(activeZone-1)}><ArrowLeft size={18}/></button><div className="panorama-map">{KITCHEN_ZONES.map((zone,index)=><button type="button" key={zone.name} aria-current={activeZone===index?'step':undefined} onClick={()=>goTo(index)}><span className="map-line"/><span>{zone.name}</span></button>)}</div><button type="button" aria-label="Explore next kitchen zone" disabled={activeZone===3} onClick={()=>goTo(activeZone+1)}><ArrowRight size={18}/></button></div>
    <div className="panorama-footnote"><span><Check size={13}/>Your selections stay with you as you explore.</span><span>{KITCHEN_ZONES.reduce((sum,zone)=>sum+zone.tools.length,0)} hotspots · 4 zones</span></div>
  </div><aside className="kitchen-inventory panorama-summary"><span className="eyebrow"><ChefHat size={18}/>YOUR KITCHEN</span><h3>Make it yours.</h3><p>No fancy setup needed. Just the tools you reach for every day.</p><div className="panorama-count"><strong aria-live="polite">{String(selectedEquipment.length).padStart(2,'0')}</strong><span>tools selected<br/>endless possibilities</span></div><div className="selected-tools" aria-label="Selected kitchen tools">{selectedEquipment.length?selectedEquipment.map(name=><button type="button" key={name} aria-label={'Remove '+name+' from your kitchen'} onClick={()=>onToggle(name)}><Check size={13}/>{name}<X size={12}/></button>):<p>Tap a tool in the kitchen to make your first selection.</p>}</div><div className="inventory-bottom"><p>Explore all four zones, or start with what you have.</p>{onNext&&<DesignAction onClick={onNext} disabled={disabled}>Find my meals</DesignAction>}</div></aside></div>
  <EquipmentCatalogPanel selected={selectedEquipment} onToggle={onToggle} includeAll/></>;
}
