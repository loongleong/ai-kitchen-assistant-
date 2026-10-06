// Positions from the approved panorama. Names/categories/capabilities remain in equipmentCatalog.
export const KITCHEN_ZONES = [
  {name:'Cooking',description:'A little heat. Endless possibilities.',tools:[['stove',32,66],['frying-pan',18,46],['wok',48,39],['pot',77,48],['oven',48,84],['saucepan',85,76]]},
  {name:'Prep',description:'Where good meals begin.',tools:[['knife',16,60],['cutting-board',36,77],['mixing-bowl',50,46],['whisk',72,61],['grater',82,42]]},
  {name:'Appliances',description:'Your everyday helping hands.',tools:[['microwave',25,27],['rice-cooker',15,62],['air-fryer',41,47],['blender',62,35],['food-processor',67,71],['electric-kettle',87,53]]},
  {name:'Storage',description:'Discover a few more possibilities.',tools:[['steamer',17,27],['pressure-cooker',39,48],['slow-cooker',67,27],['toaster-oven',78,67],['mortar-pestle',27,73],['peeler',52,87],['electric-grill',85,87]]}
] as const;
