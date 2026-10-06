import React, { useId, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { EQUIPMENT_CATALOG, EQUIPMENT_CATEGORIES } from '../data/equipmentCatalog';

export const EquipmentCatalogPanel:React.FC<{selected:readonly string[];onToggle:(tool:string)=>void;includeAll?:boolean}> = ({selected,onToggle,includeAll=false}) => {
  const [search,setSearch] = useState('');
  const [category,setCategory] = useState('All categories');
  const id = useId();
  const tools = EQUIPMENT_CATALOG.filter(tool=>(includeAll || !tool.scene) && (category === 'All categories' || tool.category === category) && tool.name.toLowerCase().includes(search.trim().toLowerCase()));
  return <details className="catalog-browser equipment-browser"><summary>Add more kitchen tools</summary><div className="catalog-browser-content">
    <label htmlFor={`${id}-search`}>Search kitchen tools</label><input id={`${id}-search`} type="search" placeholder="e.g. Wok, pressure cooker…" value={search} onChange={event=>setSearch(event.target.value)} />
    <label htmlFor={`${id}-category`}>Equipment category</label><select id={`${id}-category`} value={category} onChange={event=>setCategory(event.target.value)}><option>All categories</option>{EQUIPMENT_CATEGORIES.map(item=><option key={item}>{item}</option>)}</select>
    <div className="catalog-list">{EQUIPMENT_CATEGORIES.map(group=>{
      const grouped = tools.filter(tool=>tool.category === group);
      return grouped.length ? <section key={group}><h4>{group}</h4><div className="catalog-equipment-options">{grouped.map(tool=>{
        const active = selected.includes(tool.name);
        return <button key={tool.id} type="button" aria-pressed={active} onClick={()=>onToggle(tool.name)}>{active ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}{tool.name}</button>;
      })}</div></section> : null;
    })}{tools.length === 0 && <p>No additional tools match this search.</p>}</div>
  </div></details>;
};
