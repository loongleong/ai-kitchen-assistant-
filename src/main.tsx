import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './premium.css';
import './savor-design.css';
import './design-adaptations.css';
// Keep visual adaptations after the approved base in both development and builds.
import './components/CatalogSelectors.css';
import './components/HomeHero.css';
import './components/WhatCanICookScreen.css';
import './components/KitchenEquipmentScene.css';
import './components/RecommendationsScreen.css';
import './components/RecipeDetailModal.css';
import './components/CookingModeModal.css';

createRoot(document.getElementById('root')!).render(<App />);
