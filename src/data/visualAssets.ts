// Approved artwork is presentation data only; availability comes from cuisineCatalog/recipes.
export const APPROVED_VISUALS = {
  inspiration:'/images/savor/basil-chicken.webp',
  cooking:'/images/savor/cooking.webp',
  panorama:'/images/savor/kitchen-panorama.webp',
  kitchen:'/images/savor/kitchen.webp'
};
export const CUISINE_VISUALS:Record<string,{src:string;alt:string}> = {
  Malaysian:{src:'/images/savor/cuisine-malaysian.webp',alt:'Malaysian cuisine inspiration: nasi lemak'},
  Chinese:{src:'/images/savor/cuisine-chinese.webp',alt:'Chinese cuisine inspiration: dumplings'},
  Japanese:{src:'/images/savor/cuisine-japanese.webp',alt:'Japanese cuisine inspiration: salmon rice bowl'},
  Korean:{src:'/images/savor/cuisine-korean.webp',alt:'Korean cuisine inspiration: bibimbap'},
  Thai:{src:'/images/savor/cuisine-thai.webp',alt:'Thai cuisine inspiration: green curry'},
  Italian:{src:'/images/savor/cuisine-italian.webp',alt:'Italian cuisine inspiration: tomato pasta'},
  Western:{src:'/images/chicken-tomato-rice.webp',alt:'Western cuisine inspiration: tomato chicken rice'}
};
