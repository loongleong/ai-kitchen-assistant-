import type { IngredientPrice, PriceLocation, QuantityUnit } from './pricing';
import { validIngredientPrice } from './pricing';

// Future server-side importer joins pricecatcher with lookup_item and lookup_premise.
// No network fetching or automatic guesses about item units are performed here.
export interface PriceCatcherObservation { date:string; item_code:number; premise_code:number; price:number; item:string; unit:string; state:string; district:string }
export interface PriceCatcherItemMapping { itemCode:number; ingredientId:string; sourceUnitLabel:string; unit:QuantityUnit; basisQuantity:number; purchaseKind:'loose'|'pack' }
export const importPriceCatcherPrices = (rows:readonly PriceCatcherObservation[], mappings:readonly PriceCatcherItemMapping[]):IngredientPrice[] => rows.flatMap(row => {
  const mapping = mappings.find(item => item.itemCode === row.item_code && item.sourceUnitLabel === row.unit);
  if (!mapping || !row.state || !row.district) return [];
  const locationScope:PriceLocation = {country:'MY',state:row.state,district:row.district,premiseCode:row.premise_code};
  const price:IngredientPrice = {
    ingredientId:mapping.ingredientId,name:row.item,unit:mapping.unit,priceRM:row.price,
    priceBasis:{quantity:mapping.basisQuantity,purchaseKind:mapping.purchaseKind},
    source:{kind:'pricecatcher',reference:`https://data.gov.my/data-catalogue/pricecatcher#${row.date}/${row.item_code}/${row.premise_code}`},
    updatedAt:row.date,locationScope
  };
  return validIngredientPrice(price) ? [price] : [];
});
