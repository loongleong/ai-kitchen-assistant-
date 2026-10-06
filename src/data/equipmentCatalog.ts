export const EQUIPMENT_CATEGORIES = ['Heat sources', 'Cookware', 'Appliances', 'Prep tools', 'Specialty tools'] as const;
export type EquipmentCategory = typeof EQUIPMENT_CATEGORIES[number];
export type CookingCapability = 'stovetop-heat' | 'stovetop-fry' | 'stir-fry' | 'sear' | 'boil' | 'simmer' | 'cook-rice' | 'air-fry' | 'microwave' | 'bake' | 'toast' | 'pressure-cook' | 'slow-cook' | 'steam' | 'blend' | 'process' | 'heat-water' | 'slice' | 'chop' | 'prep-surface' | 'peel' | 'grate' | 'whisk' | 'mix' | 'grind' | 'grill';
export interface ScenePosition { x:number; y:number; w:number; h:number; order:number }
export interface Equipment { id:string; name:string; category:EquipmentCategory; capabilities:readonly CookingCapability[]; aliases?:readonly string[]; scene?:ScenePosition; defaultOwned?:boolean }
export const EQUIPMENT_CATALOG: readonly Equipment[] = [
  { id:'stove', name:'Stove', category:'Heat sources', capabilities:['stovetop-heat'], defaultOwned:true, scene:{x:6,y:50,w:31,h:3,order:3} },
  { id:'induction-cooker', name:'Induction cooker', category:'Heat sources', capabilities:['stovetop-heat'], aliases:['Induction hob'] },
  { id:'frying-pan', name:'Frying pan', category:'Cookware', capabilities:['stovetop-fry','sear'], aliases:['Skillet'], defaultOwned:true, scene:{x:7,y:41,w:15,h:9,order:1} },
  { id:'wok', name:'Wok', category:'Cookware', capabilities:['stovetop-fry','stir-fry','sear'] },
  { id:'saucepan', name:'Saucepan', category:'Cookware', capabilities:['boil','simmer'] },
  { id:'pot', name:'Pot', category:'Cookware', capabilities:['boil','simmer'], defaultOwned:true, scene:{x:24,y:39,w:11,h:11,order:2} },
  { id:'stock-pot', name:'Stock pot', category:'Cookware', capabilities:['boil','simmer'] },
  { id:'rice-cooker', name:'Rice cooker', category:'Appliances', capabilities:['cook-rice'], defaultOwned:true, scene:{x:50,y:37,w:10,h:13,order:5} },
  { id:'air-fryer', name:'Air fryer', category:'Appliances', capabilities:['air-fry'], scene:{x:62,y:34,w:11,h:17,order:6} },
  { id:'microwave', name:'Microwave', category:'Appliances', capabilities:['microwave'], scene:{x:21.5,y:4,w:20,h:16,order:0} },
  { id:'oven', name:'Oven', category:'Appliances', capabilities:['bake'], scene:{x:6,y:56,w:29,h:33,order:8} },
  { id:'toaster-oven', name:'Toaster oven', category:'Appliances', capabilities:['bake','toast'] },
  { id:'pressure-cooker', name:'Pressure cooker', category:'Appliances', capabilities:['pressure-cook'] },
  { id:'slow-cooker', name:'Slow cooker', category:'Appliances', capabilities:['slow-cook'] },
  { id:'steamer', name:'Steamer', category:'Cookware', capabilities:['steam'] },
  { id:'blender', name:'Blender', category:'Appliances', capabilities:['blend'], scene:{x:40,y:28,w:8,h:22,order:4} },
  { id:'food-processor', name:'Food processor', category:'Appliances', capabilities:['process'] },
  { id:'electric-kettle', name:'Electric kettle', category:'Appliances', capabilities:['heat-water'] },
  { id:'knife', name:'Knife', category:'Prep tools', capabilities:['slice','chop'], defaultOwned:true, scene:{x:77,y:47,w:15,h:5,order:7} },
  { id:'cutting-board', name:'Cutting board', category:'Prep tools', capabilities:['prep-surface'] },
  { id:'peeler', name:'Peeler', category:'Prep tools', capabilities:['peel'] },
  { id:'grater', name:'Grater', category:'Prep tools', capabilities:['grate'] },
  { id:'whisk', name:'Whisk', category:'Prep tools', capabilities:['whisk'] },
  { id:'mixing-bowl', name:'Mixing bowl', category:'Prep tools', capabilities:['mix'] },
  { id:'mortar-pestle', name:'Mortar & pestle', category:'Specialty tools', capabilities:['grind'] },
  { id:'electric-grill', name:'Electric grill', category:'Specialty tools', capabilities:['grill','sear'] }
];
export const findEquipment = (value:string) => EQUIPMENT_CATALOG.find(tool => [tool.id,tool.name,...tool.aliases ?? []].some(name => name.toLowerCase() === value.toLowerCase()));
export const normalizeEquipment = (values:readonly string[]) => [...new Set(values.map(value => findEquipment(value)?.name ?? value))];
export const DEFAULT_EQUIPMENT_NAMES = EQUIPMENT_CATALOG.filter(tool => tool.defaultOwned).map(tool => tool.name);
export const SCENE_EQUIPMENT = EQUIPMENT_CATALOG.filter(tool => tool.scene).sort((a,b)=>a.scene!.order-b.scene!.order);

// Alternatives are explicit capability sets. Appliance methods are kept distinct: an oven
// is not silently treated as an air fryer and a kettle cannot replace a simmering pot.
export interface EquipmentRequirement { label:string; alternatives:readonly (readonly CookingCapability[])[] }
export const equipmentRequirements = (names:readonly string[]): EquipmentRequirement[] => names.map(name => ({ label:name, alternatives:[findEquipment(name)?.capabilities ?? []] }));
export const equipmentCompatibility = (names:readonly string[], owned:readonly string[], requirements?:readonly EquipmentRequirement[]) => {
  const tools = owned.map(value => ({ name:findEquipment(value)?.name ?? value, capabilities:findEquipment(value)?.capabilities ?? [] }));
  const capabilities = new Set(tools.flatMap(tool => tool.capabilities));
  const checks = (requirements ?? equipmentRequirements(names)).map(requirement => {
    const alternative = requirement.alternatives.find(group => group.length && group.every(capability => capabilities.has(capability)));
    const exact = tools.find(tool => tool.name.toLowerCase() === requirement.label.toLowerCase());
    const singleTool = alternative && tools.find(tool=>alternative.every(capability=>tool.capabilities.includes(capability)));
    const matchingTools = singleTool ? [singleTool.name] : alternative ? tools.filter(tool => tool.capabilities.some(capability => alternative.includes(capability))).map(tool => tool.name) : [];
    return { label:requirement.label, compatible:!!alternative || (!requirement.alternatives.some(group => group.length) && !!exact), ownedTools:matchingTools.length ? matchingTools : exact ? [exact.name] : [] };
  });
  return { compatible:checks.every(check => check.compatible), checks, missing:checks.filter(check => !check.compatible).map(check => check.label) };
};
