import React from 'react';

interface DishIllustrationProps {
  dishId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSteam?: boolean;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({
  dishId,
  className = '',
  size = 'md',
  showSteam = true,
}) => {
  // Determine dish-specific colors and visual motif
  const getDishVisuals = () => {
    switch (dishId) {
      case 'teriyaki-chicken-bowl':
        return {
          bgGradient: 'from-[#2B1B17] via-[#4A2E1B] to-[#783E19]',
          bowlColor: '#1A2421',
          accentColor: '#D97706',
          title: 'Teriyaki Chicken Rice Bowl',
          renderGarnish: () => (
            <g>
              {/* Steamed rice base */}
              <ellipse cx="100" cy="105" rx="72" ry="38" fill="#F8FAFC" opacity="0.95" />
              <ellipse cx="100" cy="103" rx="68" ry="34" fill="#F1F5F9" />
              {/* Caramelized chicken pieces */}
              <rect x="65" y="80" width="34" height="22" rx="7" fill="#78350F" transform="rotate(-8 82 91)" />
              <rect x="67" y="82" width="30" height="18" rx="6" fill="#92400E" transform="rotate(-8 82 91)" />
              <path d="M72 84 Q82 81 92 88" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
              
              <rect x="96" y="78" width="38" height="24" rx="8" fill="#78350F" transform="rotate(12 115 90)" />
              <rect x="98" y="80" width="34" height="20" rx="7" fill="#B45309" transform="rotate(12 115 90)" />
              <path d="M102 83 Q114 80 128 88" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

              <rect x="76" y="98" width="36" height="22" rx="7" fill="#78350F" transform="rotate(4 94 109)" />
              <rect x="78" y="100" width="32" height="18" rx="6" fill="#92400E" transform="rotate(4 94 109)" />

              {/* Egg with soft yolk */}
              <circle cx="132" cy="106" r="16" fill="#FFFFFF" />
              <circle cx="132" cy="106" r="10" fill="#F59E0B" />
              <circle cx="130" cy="103" r="3" fill="#FEF3C7" />

              {/* Greens & Spring onion flecks */}
              <circle cx="68" cy="115" r="7" fill="#15803D" />
              <circle cx="68" cy="115" r="4" fill="#22C55E" />
              <circle cx="112" cy="74" r="2.5" fill="#4ADE80" />
              <circle cx="120" cy="72" r="2" fill="#22C55E" />
              <circle cx="86" cy="76" r="2.5" fill="#4ADE80" />
              {/* Toasted sesame seeds */}
              <circle cx="80" cy="88" r="1" fill="#FEF3C7" />
              <circle cx="84" cy="92" r="1" fill="#FEF3C7" />
              <circle cx="110" cy="86" r="1" fill="#FEF3C7" />
              <circle cx="116" cy="90" r="1" fill="#FEF3C7" />
            </g>
          )
        };

      case 'ginger-chicken-rice-bowl':
        return {
          bgGradient: 'from-[#1C3325] via-[#2D5A3F] to-[#4D7C57]',
          bowlColor: '#183B2B',
          accentColor: '#10B981',
          title: 'Ginger Chicken Rice Bowl',
          renderGarnish: () => (
            <g>
              {/* Rice base */}
              <ellipse cx="100" cy="105" rx="72" ry="38" fill="#F8FAFC" />
              {/* Ginger julienne strips */}
              <line x1="72" y1="84" x2="90" y2="80" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="76" y1="88" x2="94" y2="86" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
              <line x1="104" y1="80" x2="122" y2="85" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
              {/* Succulent glazed chicken strips */}
              <rect x="66" y="86" width="38" height="18" rx="6" fill="#D97706" transform="rotate(-6 85 95)" />
              <rect x="98" y="86" width="36" height="18" rx="6" fill="#B45309" transform="rotate(8 116 95)" />
              <rect x="80" y="98" width="40" height="19" rx="6" fill="#D97706" />
              {/* Cucumber crescents */}
              <path d="M52 102 A 14 14 0 0 1 66 118 L 54 118 Z" fill="#22C55E" />
              <path d="M54 104 A 12 12 0 0 1 64 116 L 56 116 Z" fill="#86EFAC" />
              {/* Scallion oil drizzle */}
              <path d="M85 78 Q100 82 115 76" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="92" cy="104" r="2.5" fill="#22C55E" />
              <circle cx="106" cy="106" r="2.5" fill="#22C55E" />
            </g>
          )
        };

      case 'chicken-tomato-rice':
        return {
          bgGradient: 'from-[#451410] via-[#7F1D1D] to-[#B91C1C]',
          bowlColor: '#3B1713',
          accentColor: '#EF4444',
          title: 'One-Pot Chicken Tomato Rice',
          renderGarnish: () => (
            <g>
              {/* Reddish savory tomato rice */}
              <ellipse cx="100" cy="105" rx="72" ry="38" fill="#F87171" opacity="0.9" />
              <ellipse cx="100" cy="103" rx="68" ry="34" fill="#EF4444" opacity="0.8" />
              {/* Browned chicken pieces */}
              <rect x="68" y="82" width="32" height="20" rx="7" fill="#991B1B" />
              <rect x="102" y="84" width="30" height="20" rx="7" fill="#7F1D1D" />
              <rect x="84" y="98" width="32" height="18" rx="7" fill="#991B1B" />
              {/* Cherry tomato halves */}
              <circle cx="65" cy="110" r="10" fill="#DC2626" />
              <circle cx="63" cy="108" r="3" fill="#F87171" />
              <circle cx="132" cy="102" r="11" fill="#DC2626" />
              <circle cx="130" cy="100" r="3" fill="#F87171" />
              {/* Basil/Parsley leaf flecks */}
              <path d="M96 74 Q102 70 106 75 Q102 80 96 74 Z" fill="#15803D" />
              <path d="M118 78 Q124 74 128 80 Q122 84 118 78 Z" fill="#15803D" />
              <circle cx="90" cy="112" r="2.5" fill="#22C55E" />
            </g>
          )
        };

      case 'garlic-chicken-fried-rice':
        return {
          bgGradient: 'from-[#292524] via-[#44403C] to-[#78716C]',
          bowlColor: '#1C1917',
          accentColor: '#F59E0B',
          title: 'Garlic Chicken Fried Rice',
          renderGarnish: () => (
            <g>
              {/* Golden speckled fried rice */}
              <ellipse cx="100" cy="105" rx="72" ry="38" fill="#FDE68A" />
              <ellipse cx="100" cy="103" rx="68" ry="34" fill="#FCD34D" opacity="0.9" />
              {/* Egg ribbons */}
              <path d="M68 92 Q80 86 92 94 Q104 88 116 92" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M74 104 Q88 100 102 108" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Crispy garlic bits */}
              <rect x="70" y="80" width="6" height="6" rx="1.5" fill="#B45309" />
              <rect x="88" y="78" width="5" height="5" rx="1.5" fill="#92400E" />
              <rect x="112" y="82" width="6" height="6" rx="1.5" fill="#B45309" />
              <rect x="126" y="96" width="5" height="5" rx="1.5" fill="#92400E" />
              <rect x="82" y="112" width="6" height="6" rx="1.5" fill="#B45309" />
              {/* Chicken bits */}
              <rect x="80" y="86" width="18" height="14" rx="4" fill="#D97706" />
              <rect x="104" y="96" width="20" height="14" rx="4" fill="#D97706" />
              {/* Scallion greens */}
              <circle cx="78" cy="98" r="2.5" fill="#16A34A" />
              <circle cx="98" cy="80" r="2.5" fill="#16A34A" />
              <circle cx="120" cy="108" r="2.5" fill="#16A34A" />
            </g>
          )
        };

      case 'egg-chicken-donburi':
        return {
          bgGradient: 'from-[#1E293B] via-[#334155] to-[#475569]',
          bowlColor: '#0F172A',
          accentColor: '#EAB308',
          title: 'Egg & Chicken Donburi',
          renderGarnish: () => (
            <g>
              {/* Rice base */}
              <ellipse cx="100" cy="105" rx="72" ry="38" fill="#F8FAFC" />
              {/* Silky simmered golden egg cloud */}
              <ellipse cx="100" cy="96" rx="56" ry="26" fill="#FDE047" opacity="0.95" />
              <ellipse cx="98" cy="94" rx="48" ry="20" fill="#FEF08A" />
              {/* Simmered chicken chunks */}
              <rect x="74" y="86" width="26" height="16" rx="5" fill="#CA8A04" />
              <rect x="104" y="88" width="24" height="16" rx="5" fill="#A16207" />
              {/* Sweet simmered onions */}
              <path d="M65 96 C75 90, 85 104, 95 98" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85" />
              <path d="M100 100 C110 94, 120 104, 130 96" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85" />
              {/* Nori seaweed shreds */}
              <rect x="94" y="76" width="14" height="3" rx="1" fill="#0F172A" transform="rotate(15 101 77)" />
              <rect x="100" y="80" width="12" height="2.5" rx="1" fill="#0F172A" transform="rotate(-10 106 81)" />
              {/* Mitsuba green leaf */}
              <circle cx="102" cy="72" r="3" fill="#15803D" />
              <circle cx="106" cy="73" r="2.5" fill="#22C55E" />
            </g>
          )
        };

      case 'creamy-chicken-pasta':
        return {
          bgGradient: 'from-[#312E81] via-[#3730A3] to-[#4F46E5]',
          bowlColor: '#1E1B4B',
          accentColor: '#F59E0B',
          title: 'Creamy Garlic Chicken Pasta',
          renderGarnish: () => (
            <g>
              {/* Pasta base ribbons */}
              <ellipse cx="100" cy="105" rx="72" ry="38" fill="#FEF3C7" />
              {/* Penne/Fettuccine curves */}
              <path d="M65 92 C75 80, 95 86, 110 82 C125 78, 135 90, 130 102" stroke="#FDE68A" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M68 106 C80 96, 100 108, 120 98" stroke="#FCD34D" strokeWidth="5.5" fill="none" strokeLinecap="round" />
              <path d="M80 114 C95 106, 115 116, 130 110" stroke="#FDE68A" strokeWidth="5" fill="none" strokeLinecap="round" />
              {/* Pan-seared chicken cubes */}
              <rect x="80" y="82" width="22" height="15" rx="4" fill="#B45309" />
              <rect x="108" y="88" width="20" height="15" rx="4" fill="#92400E" />
              {/* Broccoli florets (healthy element) */}
              <circle cx="68" cy="84" r="8" fill="#15803D" />
              <circle cx="66" cy="82" r="4" fill="#22C55E" />
              <circle cx="128" cy="94" r="7" fill="#15803D" />
              <circle cx="126" cy="92" r="3.5" fill="#22C55E" />
              {/* Parmesan shavings & pepper */}
              <line x1="90" y1="96" x2="102" y2="92" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="98" y1="104" x2="110" y2="100" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <circle cx="95" cy="88" r="1" fill="#1E293B" />
              <circle cx="104" cy="94" r="1" fill="#1E293B" />
              <circle cx="112" cy="85" r="1" fill="#1E293B" />
            </g>
          )
        };

      default:
        // Default delicious bowl presentation
        return {
          bgGradient: 'from-[#143224] via-[#1F4632] to-[#2E6147]',
          bowlColor: '#12261C',
          accentColor: '#10B981',
          title: 'SavorAI Crafted Meal',
          renderGarnish: () => (
            <g>
              <ellipse cx="100" cy="105" rx="70" ry="36" fill="#F8FAFC" />
              <rect x="72" y="82" width="30" height="18" rx="6" fill="#D97706" />
              <rect x="104" y="84" width="26" height="18" rx="6" fill="#B45309" />
              <rect x="86" y="98" width="30" height="16" rx="6" fill="#D97706" />
              <circle cx="66" cy="108" r="8" fill="#22C55E" />
              <circle cx="130" cy="104" r="10" fill="#EF4444" />
              <circle cx="96" cy="76" r="2.5" fill="#4ADE80" />
              <circle cx="108" cy="74" r="2" fill="#22C55E" />
            </g>
          )
        };
    }
  };

  const visual = getDishVisuals();

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${visual.bgGradient} flex items-center justify-center select-none ${className}`}>
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
      
      {/* Steam elements */}
      {showSteam && (
        <div className="absolute top-2 w-16 h-12 flex justify-center space-x-2 pointer-events-none">
          <div className="w-1.5 h-6 bg-white/40 rounded-full blur-[2px] animate-steam-1" />
          <div className="w-2 h-8 bg-white/50 rounded-full blur-[2px] animate-steam-2" />
          <div className="w-1.5 h-5 bg-white/30 rounded-full blur-[2px] animate-steam-3" />
        </div>
      )}

      {/* SVG Dish Architecture */}
      <svg 
        viewBox="0 0 200 170" 
        className="w-full h-full max-h-[92%] max-w-[92%] drop-shadow-xl"
        aria-label={visual.title}
        role="img"
      >
        <defs>
          <radialGradient id={`bowlShine-${dishId}`} cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#4A5568" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
          </radialGradient>
          <linearGradient id={`rimGrad-${dishId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Ambient plate shadow */}
        <ellipse cx="100" cy="144" rx="76" ry="16" fill="#000000" opacity="0.4" />

        {/* Ceramic bowl exterior */}
        <path 
          d="M 24 95 Q 26 142 100 142 Q 174 142 176 95 Z" 
          fill={visual.bowlColor} 
        />
        <path 
          d="M 24 95 Q 26 142 100 142 Q 174 142 176 95 Z" 
          fill={`url(#bowlShine-${dishId})`} 
        />

        {/* Inner Bowl Rim & Surface */}
        <ellipse cx="100" cy="95" rx="76" ry="24" fill="#0F172A" opacity="0.8" />
        <ellipse cx="100" cy="95" rx="74" ry="22" fill={visual.bowlColor} />

        {/* Dish Food Content & Garnishes */}
        {visual.renderGarnish()}

        {/* Ceramic Rim Highlight */}
        <ellipse 
          cx="100" 
          cy="95" 
          rx="76" 
          ry="24" 
          fill="none" 
          stroke={`url(#rimGrad-${dishId})`} 
          strokeWidth="1.5" 
          opacity="0.75" 
        />
      </svg>
    </div>
  );
};
