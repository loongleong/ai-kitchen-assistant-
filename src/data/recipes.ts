import { Recipe } from '../types';

export const RECIPES: Recipe[] = [
  {
    id: 'teriyaki-chicken-bowl',
    name: 'Teriyaki Chicken Rice Bowl',
    tagline: 'Glazed tender chicken thigh over steaming jasmine rice with sesame greens',
    cuisine: 'Japanese',
    timeMinutes: 24,
    estimatedCostRM: 11.50,
    servings: 2,
    difficulty: 'Beginner',
    calories: 560,
    protein: 38,
    carbs: 64,
    fat: 16,
    fibre: 4,
    requiredEquipment: ['Frying pan', 'Pot', 'Knife', 'Stove'],
    dishCategory: 'rice',
    badgeText: '96% match',
    matchScore: 96,
    matchReason: 'You have 5/6 ingredients · Fits comfortably in your RM15 budget · Uses frying pan & stove',
    ingredients: [
      { id: 'i1', name: 'Chicken breast or thigh', amount: '250g', have: true },
      { id: 'i2', name: 'Cooked jasmine rice', amount: '2 cups', have: true },
      { id: 'i3', name: 'Soy sauce', amount: '2 tbsp', have: true },
      { id: 'i4', name: 'Garlic cloves (minced)', amount: '2 cloves', have: true },
      { id: 'i5', name: 'Egg (soft-boiled or fried)', amount: '1 whole', have: true },
      { 
        id: 'i6', 
        name: 'Spring onion', 
        amount: '2 stalks', 
        have: false, 
        estCostIfMissing: 1.50,
        substitute: 'Yellow onion slices or chopped chives',
        substituteNote: 'Thinly sliced yellow onion sautéed for 30s provides similar aromatic sweetness.'
      }
    ],
    healthierVariant: {
      calories: 490,
      protein: 41,
      carbs: 56,
      fat: 11,
      fibre: 6,
      modifications: [
        'Reduce cooking oil from 1.5 tbsp to 0.5 tbsp (-40 kcal)',
        'Use low-sodium soy sauce with honey glaze (-30 kcal)',
        'Add 80g steamed broccoli or pak choy (+2g fibre, fuller satiety)'
      ],
      swaps: [
        { original: '1.5 tbsp vegetable oil', replacement: 'Cooking spray / 0.5 tsp sesame oil', note: 'Saves 50 kcal without losing fragrant aroma' },
        { original: 'Standard teriyaki glaze', replacement: 'Light soy + ginger + drizzle of honey', note: 'Reduces refined sugars by 45%' },
        { original: 'All white jasmine rice', replacement: 'Half white rice + half cauliflower/brown rice', note: 'Cuts 60 kcal and doubles micronutrients' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Prep the chicken & aromatics',
        instruction: 'Cut the chicken into bite-sized 2cm pieces. In a small bowl, mix soy sauce, minced garlic, and a teaspoon of sweetener or mirin.',
        timerMinutes: 4,
        whatToLookFor: 'Evenly sized chicken chunks so they cook uniformly in the pan.',
        tip: 'Pat chicken dry with paper towel before cutting for better searing.',
        visualType: 'prep'
      },
      {
        stepNumber: 2,
        title: 'Sear the chicken in a hot pan',
        instruction: 'Heat your frying pan over medium-high heat with half a tablespoon of oil. Place the chicken pieces in a single layer without overcrowding.',
        timerMinutes: 5,
        whatToLookFor: 'Sizzling sound right when chicken touches pan, and pale pink turning golden white around edges.',
        tip: 'Don’t move the chicken for the first 2 minutes so it develops a nice browned crust.',
        visualType: 'sear'
      },
      {
        stepNumber: 3,
        title: 'Cook through & glaze',
        instruction: 'Flip chicken pieces and pour in your teriyaki sauce mixture. Reduce heat to medium and stir continuously as sauce bubbles and thickens into a glossy glaze.',
        timerMinutes: 4,
        whatToLookFor: 'Sticky glossy bubbles coating every piece of chicken; no raw pink chicken in center.',
        tip: 'If sauce thickens too quickly, add 1 tablespoon of water.',
        visualType: 'sauce'
      },
      {
        stepNumber: 4,
        title: 'Assemble the bowl',
        instruction: 'Spoon warm cooked rice into serving bowls. Top with glazed teriyaki chicken, your egg, and garnish with sliced spring onions or chives.',
        timerMinutes: 2,
        whatToLookFor: 'Fragrant aromatic steam and shiny glazed chicken resting over rice.',
        tip: 'Pour the remaining pan sauce directly over the warm rice for maximum flavour.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'ginger-chicken-rice-bowl',
    name: 'Ginger Chicken Rice Bowl',
    tagline: 'Comforting aromatic ginger scallion chicken with garlic fragrant rice',
    cuisine: 'Malaysian',
    timeMinutes: 22,
    estimatedCostRM: 9.80,
    servings: 2,
    difficulty: 'Beginner',
    calories: 540,
    protein: 36,
    carbs: 62,
    fat: 14,
    fibre: 3,
    requiredEquipment: ['Frying pan', 'Rice cooker', 'Knife', 'Stove'],
    dishCategory: 'rice',
    badgeText: '94% match',
    matchScore: 94,
    matchReason: 'You already have 6/7 ingredients · RM9.80 fits Student budget · Fast 22 min cook time',
    ingredients: [
      { id: 'g1', name: 'Chicken breast', amount: '220g', have: true },
      { id: 'g2', name: 'Fresh ginger (julienned)', amount: '3 tbsp', have: true },
      { id: 'g3', name: 'Garlic cloves', amount: '3 cloves', have: true },
      { id: 'g4', name: 'Jasmine rice', amount: '1.5 cups', have: true },
      { id: 'g5', name: 'Soy sauce', amount: '1.5 tbsp', have: true },
      { id: 'g6', name: 'Sesame oil', amount: '1 tsp', have: true },
      { 
        id: 'g7', 
        name: 'Cucumber slices', 
        amount: '6 slices', 
        have: false, 
        estCostIfMissing: 1.20,
        substitute: 'Lettuce leaves or pickled carrots',
        substituteNote: 'Provides cool crisp contrast against the hot aromatic ginger.'
      }
    ],
    healthierVariant: {
      calories: 475,
      protein: 39,
      carbs: 55,
      fat: 9,
      fibre: 5,
      modifications: [
        'Steamed chicken rather than pan-fried in extra oil (-45 kcal)',
        'Extra ginger & garlic for natural thermogenic flavor with zero calorie cost',
        'Add cucumber rounds and blanched greens (+2g fibre)'
      ],
      swaps: [
        { original: '2 tbsp cooking oil', replacement: '1 tsp sesame oil finishing drizzle', note: 'Cuts 110 kcal of neutral cooking fats' },
        { original: 'White rice', replacement: 'Brown / mixed grain rice', note: 'Higher micronutrient density and longer fullness' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Julienne ginger & prep chicken',
        instruction: 'Slice fresh ginger into thin matchsticks. Cut chicken into thin strips and toss with 1 tsp soy sauce and a pinch of pepper.',
        timerMinutes: 4,
        whatToLookFor: 'Fine ginger matchsticks that will release warm fragrance quickly in heat.',
        tip: 'Scrape ginger skin with a spoon for fast, waste-free peeling.',
        visualType: 'prep'
      },
      {
        stepNumber: 2,
        title: 'Bloom the ginger & garlic',
        instruction: 'Heat frying pan with half a teaspoon of oil over medium heat. Fry julienned ginger and minced garlic until aromatic.',
        timerMinutes: 2,
        whatToLookFor: 'Pale gold ginger edges and a deep warm aroma filling your kitchen.',
        tip: 'Keep heat medium so garlic does not scorch or turn bitter.',
        visualType: 'sear'
      },
      {
        stepNumber: 3,
        title: 'Flash cook the chicken',
        instruction: 'Add marinated chicken strips. Toss briskly over medium-high heat until the meat is opaque and lightly caramelized.',
        timerMinutes: 5,
        whatToLookFor: 'Chicken completely turns white with light golden edges and juicy sheen.',
        tip: 'Stir constantly to coat chicken thoroughly in the ginger oil.',
        visualType: 'simmer'
      },
      {
        stepNumber: 4,
        title: 'Serve over hot rice',
        instruction: 'Ladle chicken and ginger aromatics over steaming rice. Add cucumber slices and drizzle with sesame oil.',
        timerMinutes: 2,
        whatToLookFor: 'Glistening ginger chicken and tender rice.',
        tip: 'Drizzle the hot pan juices over the rice bowl for deep flavour.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'chicken-tomato-rice',
    name: 'One-Pot Chicken Tomato Rice',
    tagline: 'Hearty rice simmered in savory garlic tomato sauce with juicy chicken cubes',
    cuisine: 'Western',
    timeMinutes: 28,
    estimatedCostRM: 10.20,
    servings: 2,
    difficulty: 'Beginner',
    calories: 520,
    protein: 34,
    carbs: 68,
    fat: 12,
    fibre: 5,
    requiredEquipment: ['Frying pan', 'Knife', 'Stove'],
    dishCategory: 'rice',
    badgeText: '93% match',
    matchScore: 93,
    matchReason: 'You have tomatoes, rice & chicken · Single pan meal = 2 min cleanup · Within RM15',
    ingredients: [
      { id: 'ct1', name: 'Chicken breast', amount: '220g', have: true },
      { id: 'ct2', name: 'Ripe tomatoes (diced)', amount: '2 medium', have: true },
      { id: 'ct3', name: 'Garlic cloves', amount: '3 cloves', have: true },
      { id: 'ct4', name: 'Rice', amount: '1.5 cups', have: true },
      { id: 'ct5', name: 'Soy sauce / Salt', amount: '1 tbsp', have: true },
      { 
        id: 'ct6', 
        name: 'Italian herbs / oregano', 
        amount: '1/2 tsp', 
        have: false, 
        estCostIfMissing: 2.00,
        substitute: 'Black pepper or fresh coriander',
        substituteNote: 'Fresh ground black pepper adds pleasant warm kick.'
      }
    ],
    healthierVariant: {
      calories: 460,
      protein: 36,
      carbs: 60,
      fat: 8,
      fibre: 7,
      modifications: [
        'Double the diced tomatoes for rich lycopene and natural sauce volume',
        'Use skinless chicken breast with minimal pan oil',
        'Top with baby spinach for added folate and iron'
      ],
      swaps: [
        { original: 'Butter / high oil', replacement: 'Olive oil mist', note: 'Cuts 60 kcal saturated fats' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Chop tomatoes and brown chicken',
        instruction: 'Dice tomatoes into small cubes. Season chicken cubes with salt and garlic, then sear in pan for 3 minutes.',
        timerMinutes: 4,
        whatToLookFor: 'Chicken takes on a light brown colour on exterior.',
        visualType: 'sear'
      },
      {
        stepNumber: 2,
        title: 'Simmer down tomatoes into sauce',
        instruction: 'Add diced tomatoes and minced garlic to the pan. Press down with spatula until tomatoes release juices into a thick sauce.',
        timerMinutes: 5,
        whatToLookFor: 'Tomatoes break down into bubbling, bright red savoury sauce.',
        visualType: 'simmer'
      },
      {
        stepNumber: 3,
        title: 'Stir in rice & cover',
        instruction: 'Fold in the cooked rice and let it absorb the tomato chicken juices on low heat.',
        timerMinutes: 4,
        whatToLookFor: 'Rice grains turning rosy red and fragrant.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'garlic-chicken-fried-rice',
    name: 'Garlic Chicken Fried Rice',
    tagline: 'Golden wok-fragrant fried rice loaded with crispy garlic bits and egg ribbons',
    cuisine: 'Chinese',
    timeMinutes: 16,
    estimatedCostRM: 7.90,
    servings: 2,
    difficulty: 'Beginner',
    calories: 510,
    protein: 32,
    carbs: 66,
    fat: 13,
    fibre: 2,
    requiredEquipment: ['Frying pan', 'Knife', 'Stove'],
    dishCategory: 'rice',
    badgeText: '98% match',
    matchScore: 98,
    matchReason: 'You have 100% of core ingredients · Under RM8 · Fast 16 minutes',
    ingredients: [
      { id: 'gf1', name: 'Cold leftover rice', amount: '2 cups', have: true },
      { id: 'gf2', name: 'Chicken breast (diced)', amount: '180g', have: true },
      { id: 'gf3', name: 'Eggs (beaten)', amount: '2 whole', have: true },
      { id: 'gf4', name: 'Garlic (lots, minced)', amount: '6 cloves', have: true },
      { id: 'gf5', name: 'Soy sauce', amount: '1.5 tbsp', have: true },
      { id: 'gf6', name: 'Cooking oil', amount: '1 tbsp', have: true }
    ],
    healthierVariant: {
      calories: 440,
      protein: 35,
      carbs: 58,
      fat: 8,
      fibre: 4,
      modifications: [
        'Use non-stick pan to cut oil from 2 tbsp to 1 tsp (-80 kcal)',
        'Add 1 cup diced carrots or peas for volume without high calories',
        '1 whole egg + 1 egg white for higher protein density'
      ],
      swaps: [
        { original: '2 tbsp vegetable oil', replacement: '1 tsp sesame oil + splash of water', note: 'Keeps rice moist with 70% less oil' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Toast the garlic chips',
        instruction: 'Heat 1 tsp oil in frying pan. Fry half of minced garlic until light golden and crispy, then scoop onto a small plate.',
        timerMinutes: 2,
        whatToLookFor: 'Golden straw colour on garlic chips without burning dark.',
        visualType: 'sear'
      },
      {
        stepNumber: 2,
        title: 'Cook chicken & scramble egg',
        instruction: 'Add chicken and remaining raw garlic to pan. Cook 3 minutes. Push to side, pour in beaten egg and scramble soft.',
        timerMinutes: 4,
        whatToLookFor: 'Tender egg curds and cooked juicy chicken.',
        visualType: 'prep'
      },
      {
        stepNumber: 3,
        title: 'Toss rice and season',
        instruction: 'Add cold rice. Break up clumps with spatula over high heat. Drizzle soy sauce around pan edge and toss briskly.',
        timerMinutes: 4,
        whatToLookFor: 'Sizzling rice grains bouncing slightly in pan; uniform golden hue.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'egg-chicken-donburi',
    name: 'Egg & Chicken Donburi (Oyakodon)',
    tagline: 'Silky simmered egg and sweet onion over tender chicken and warm rice',
    cuisine: 'Japanese',
    timeMinutes: 18,
    estimatedCostRM: 8.90,
    servings: 2,
    difficulty: 'Beginner',
    calories: 530,
    protein: 36,
    carbs: 60,
    fat: 14,
    fibre: 2,
    requiredEquipment: ['Frying pan', 'Knife', 'Stove'],
    dishCategory: 'rice',
    badgeText: '95% match',
    matchScore: 95,
    matchReason: 'Uses your eggs, chicken & soy sauce · High 36g protein · 18 min prep',
    ingredients: [
      { id: 'ed1', name: 'Chicken thigh or breast', amount: '200g', have: true },
      { id: 'ed2', name: 'Eggs (lightly beaten)', amount: '2 whole', have: true },
      { id: 'ed3', name: 'Yellow onion (sliced)', amount: '1/2 medium', have: true },
      { id: 'ed4', name: 'Soy sauce', amount: '2 tbsp', have: true },
      { id: 'ed5', name: 'Cooked rice', amount: '2 bowls', have: true },
      { 
        id: 'ed6', 
        name: 'Dashi broth or chicken broth', 
        amount: '1/3 cup', 
        have: false, 
        estCostIfMissing: 1.00,
        substitute: 'Warm water with 1/2 tsp chicken bouillon or soy sauce',
        substituteNote: 'Water with a pinch of chicken stock or sugar replicates the comforting dashi base.'
      }
    ],
    healthierVariant: {
      calories: 460,
      protein: 38,
      carbs: 54,
      fat: 10,
      fibre: 3,
      modifications: [
        'Simmered purely in broth without adding oil or butter (0 added fat)',
        'Reduce sweetener in sauce by half, let natural sweet onion carry flavor',
        'Add sliced mushrooms or spinach for low-cal volume'
      ],
      swaps: [
        { original: '2 whole eggs', replacement: '1 whole egg + 1 egg white', note: 'Cuts 50 kcal and reduces cholesterol' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Simmer sweet onions and broth',
        instruction: 'In a shallow frying pan, combine broth, soy sauce, and sliced onions. Bring to a gentle simmer on medium heat.',
        timerMinutes: 3,
        whatToLookFor: 'Onions become translucent and broth smells sweet and savory.',
        visualType: 'simmer'
      },
      {
        stepNumber: 2,
        title: 'Add chicken',
        instruction: 'Lay bite-sized chicken pieces flat across the bubbling broth. Cover pan and simmer gently for 4 minutes.',
        timerMinutes: 4,
        whatToLookFor: 'Chicken is cooked through and plumped up from absorbing the broth.',
        visualType: 'simmer'
      },
      {
        stepNumber: 3,
        title: 'Drizzle eggs in circles',
        instruction: 'Pour lightly beaten eggs in a spiral over the chicken. Cover with lid for 45 seconds, then turn off heat.',
        timerMinutes: 2,
        whatToLookFor: 'Egg is gently set on bottom but still velvety and soft on top.',
        visualType: 'sauce'
      },
      {
        stepNumber: 4,
        title: 'Slide onto rice',
        instruction: 'Tilt the pan and slide the silky egg and chicken directly onto bowls of warm rice.',
        timerMinutes: 1,
        whatToLookFor: 'Beautiful golden egg blanket coating the chicken over rice.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'air-fryer-turmeric-chicken',
    name: 'Air Fryer Turmeric Chicken & Rice',
    tagline: 'Crispy aromatic golden spiced chicken with fluffy garlic rice',
    cuisine: 'Malaysian',
    timeMinutes: 22,
    estimatedCostRM: 11.00,
    servings: 2,
    difficulty: 'Easy',
    calories: 495,
    protein: 42,
    carbs: 52,
    fat: 12,
    fibre: 3,
    requiredEquipment: ['Air fryer', 'Rice cooker', 'Knife'],
    dishCategory: 'rice',
    badgeText: '91% match',
    matchScore: 91,
    matchReason: 'Fits your Air Fryer · Very high protein (42g) · Low hands-on active time',
    ingredients: [
      { id: 'at1', name: 'Chicken breast cutlets', amount: '280g', have: true },
      { id: 'at2', name: 'Turmeric powder', amount: '1 tsp', have: true },
      { id: 'at3', name: 'Garlic & ginger paste', amount: '1 tbsp', have: true },
      { id: 'at4', name: 'Cooked rice', amount: '2 bowls', have: true },
      { id: 'at5', name: 'Cooking oil', amount: '1 tsp', have: true },
      { 
        id: 'at6', 
        name: 'Fresh lime / calamansi', 
        amount: '1 piece', 
        have: false, 
        estCostIfMissing: 0.50,
        substitute: 'Drop of vinegar or lemon',
        substituteNote: 'Acidity balances turmeric warmth.'
      }
    ],
    healthierVariant: {
      calories: 440,
      protein: 44,
      carbs: 48,
      fat: 7,
      fibre: 4,
      modifications: [
        'Air-fried without batter or heavy oil',
        'Turmeric provides natural anti-inflammatory polyphenols'
      ],
      swaps: [
        { original: 'Deep fried chicken', replacement: 'Air fryer at 190°C with 1 tsp oil', note: 'Saves 180 kcal of deep-fry fat' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Marinate chicken in turmeric',
        instruction: 'Coat chicken pieces in turmeric powder, garlic, salt, and 1 tsp oil.',
        timerMinutes: 3,
        whatToLookFor: 'Bright sunny golden coating all over chicken.',
        visualType: 'prep'
      },
      {
        stepNumber: 2,
        title: 'Air fry at 190°C',
        instruction: 'Arrange in air fryer basket. Cook for 12 minutes, shaking basket at the 6-minute mark.',
        timerMinutes: 12,
        whatToLookFor: 'Sizzling crispy exterior with deep golden edges.',
        visualType: 'sear'
      },
      {
        stepNumber: 3,
        title: 'Plate with rice and lime',
        instruction: 'Serve hot with fragrant rice and squeeze fresh lime juice over top.',
        timerMinutes: 2,
        whatToLookFor: 'Crispy skin contrast against tender juicy chicken inside.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'scallion-oil-noodles',
    name: 'Scallion Oil Noodles with Poached Egg',
    tagline: 'Springy noodles tossed in deeply caramelized scallion oil and dark soy',
    cuisine: 'Chinese',
    timeMinutes: 14,
    estimatedCostRM: 6.50,
    servings: 1,
    difficulty: 'Beginner',
    calories: 480,
    protein: 16,
    carbs: 70,
    fat: 14,
    fibre: 3,
    requiredEquipment: ['Pot', 'Frying pan', 'Stove'],
    dishCategory: 'noodles',
    badgeText: '88% match',
    matchScore: 88,
    matchReason: 'Fastest 14 min meal · Lowest cost at RM6.50 · Satisfying pantry dinner',
    ingredients: [
      { id: 'so1', name: 'Wheat noodles or instant ramen', amount: '1 portion', have: true },
      { id: 'so2', name: 'Egg', amount: '1 whole', have: true },
      { id: 'so3', name: 'Soy sauce & dark soy', amount: '1.5 tbsp', have: true },
      { id: 'so4', name: 'Cooking oil', amount: '1.5 tbsp', have: true },
      { 
        id: 'so5', 
        name: 'Spring onions (a bunch)', 
        amount: '4 stalks', 
        have: false, 
        estCostIfMissing: 1.50,
        substitute: 'Thinly sliced shallots or red onion',
        substituteNote: 'Fried shallot oil gives incredible traditional aroma.'
      }
    ],
    healthierVariant: {
      calories: 410,
      protein: 20,
      carbs: 60,
      fat: 9,
      fibre: 5,
      modifications: [
        'Cut scallion oil from 1.5 tbsp to 1 tsp + 2 tbsp noodle broth',
        'Add 1 egg white for extra lean protein',
        'Toss with blanched bok choy or greens'
      ],
      swaps: [
        { original: '2 tbsp cooking oil', replacement: '1 tsp oil + fragrant aromatics', note: 'Cuts 110 kcal of fat' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Boil noodles and egg',
        instruction: 'Boil noodles in pot for 3 minutes. In the last minute, drop in the egg to poach.',
        timerMinutes: 4,
        whatToLookFor: 'Al dente noodles and soft runny yolk.',
        visualType: 'simmer'
      },
      {
        stepNumber: 2,
        title: 'Crisp the scallions in oil',
        instruction: 'Fry sliced scallions in oil over low heat until dark brown and crispy.',
        timerMinutes: 4,
        whatToLookFor: 'Deep bronze fragrant scallion crisps.',
        visualType: 'sear'
      },
      {
        stepNumber: 3,
        title: 'Toss noodles in sauce',
        instruction: 'Drain noodles, toss with soy sauce and hot scallion oil, top with poached egg.',
        timerMinutes: 2,
        whatToLookFor: 'Glossy noodles coated in savory dark sauce.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'stir-fried-tomato-egg-rice',
    name: 'Homestyle Tomato & Egg Rice',
    tagline: 'Silky scrambled eggs enveloped in sweet-tart garlic tomato gravy',
    cuisine: 'Chinese',
    timeMinutes: 15,
    estimatedCostRM: 6.80,
    servings: 2,
    difficulty: 'Beginner',
    calories: 460,
    protein: 22,
    carbs: 58,
    fat: 15,
    fibre: 4,
    requiredEquipment: ['Frying pan', 'Stove', 'Knife'],
    dishCategory: 'rice',
    badgeText: '97% match',
    matchScore: 97,
    matchReason: 'Uses 100% of your current pantry eggs & tomatoes · RM6.80 total',
    ingredients: [
      { id: 'te1', name: 'Eggs', amount: '3 whole', have: true },
      { id: 'te2', name: 'Ripe red tomatoes', amount: '2 large', have: true },
      { id: 'te3', name: 'Garlic', amount: '2 cloves', have: true },
      { id: 'te4', name: 'Soy sauce & pinch of sugar', amount: '1 tbsp', have: true },
      { id: 'te5', name: 'Cooked rice', amount: '2 bowls', have: true }
    ],
    healthierVariant: {
      calories: 390,
      protein: 24,
      carbs: 54,
      fat: 8,
      fibre: 5,
      modifications: [
        '2 egg whites + 1 whole egg to cut fat while preserving volume',
        'Extra tomato simmer for thick sauce with zero cornstarch'
      ],
      swaps: [
        { original: 'Refined sugar', replacement: 'Natural sweetness from slow-simmered ripe tomatoes', note: 'Zero empty calories' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Soft scramble the eggs',
        instruction: 'Whisk eggs with a pinch of salt. Pour into hot oiled pan and stir gently until 80% set, then remove to plate.',
        timerMinutes: 2,
        whatToLookFor: 'Fluffy golden egg curds that are still slightly runny.',
        visualType: 'sear'
      },
      {
        stepNumber: 2,
        title: 'Simmer tomatoes to gravy',
        instruction: 'Add diced tomatoes and garlic to pan with 2 tbsp water. Simmer until soft and saucy.',
        timerMinutes: 4,
        whatToLookFor: 'Rich, natural red gravy bubbling in pan.',
        visualType: 'simmer'
      },
      {
        stepNumber: 3,
        title: 'Fold eggs back in',
        instruction: 'Return soft eggs to pan. Turn off heat and fold gently so eggs soak up tomato gravy.',
        timerMinutes: 1,
        whatToLookFor: 'Egg folds marbling through the red sauce.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'malaysian-soy-chicken',
    name: 'Ayam Masak Kicap (Soy Sauce Chicken)',
    tagline: 'Classic Malaysian sweet savory caramelized chicken with garlic & onions',
    cuisine: 'Malaysian',
    timeMinutes: 25,
    estimatedCostRM: 11.20,
    servings: 2,
    difficulty: 'Beginner',
    calories: 530,
    protein: 38,
    carbs: 55,
    fat: 16,
    fibre: 3,
    requiredEquipment: ['Frying pan', 'Knife', 'Stove'],
    dishCategory: 'rice',
    badgeText: '93% match',
    matchScore: 93,
    matchReason: 'Classic Malaysian comfort · Matches your chicken, garlic & soy sauce',
    ingredients: [
      { id: 'am1', name: 'Chicken breast or thigh', amount: '260g', have: true },
      { id: 'am2', name: 'Dark & sweet soy sauce (Kicap Manis)', amount: '2.5 tbsp', have: true },
      { id: 'am3', name: 'Garlic & yellow onion', amount: '1 onion, 3 garlic', have: true },
      { id: 'am4', name: 'Rice', amount: '2 bowls', have: true },
      { 
        id: 'am5', 
        name: 'Red chilli / bird’s eye chilli', 
        amount: '1 piece', 
        have: false, 
        estCostIfMissing: 0.80,
        substitute: 'Pinch of chilli powder or black pepper',
        substituteNote: 'Adds that signature warming kick.'
      }
    ],
    healthierVariant: {
      calories: 460,
      protein: 41,
      carbs: 48,
      fat: 10,
      fibre: 4,
      modifications: [
        'Pan-seared without deep frying the chicken first (-70 kcal)',
        'Blend of dark soy with a splash of water to lower sodium density'
      ],
      swaps: [
        { original: 'Pre-deep frying chicken', replacement: 'Quick pan-sear with lid steam', note: 'Retains tenderness with 60% less oil' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Sear chicken with turmeric & salt',
        instruction: 'Season chicken pieces and sear in hot pan until browned on both sides.',
        timerMinutes: 6,
        whatToLookFor: 'Golden crust forming on chicken surface.',
        visualType: 'sear'
      },
      {
        stepNumber: 2,
        title: 'Sauté onions and garlic',
        instruction: 'Add sliced onion rings and garlic to pan until softened and sweet.',
        timerMinutes: 3,
        whatToLookFor: 'Onion rings turning soft and glistening with chicken drippings.',
        visualType: 'prep'
      },
      {
        stepNumber: 3,
        title: 'Pour kicap and simmer',
        instruction: 'Add kicap manis, soy sauce, and 3 tbsp water. Simmer until sauce reduces to a sticky dark coating.',
        timerMinutes: 5,
        whatToLookFor: 'Rich mahogany glaze sticking to each chicken piece.',
        visualType: 'sauce'
      }
    ]
  },
  {
    id: 'kimchi-chicken-fried-rice',
    name: 'Kimchi Chicken Fried Rice',
    tagline: 'Zesty Korean fried rice with fermented kimchi punch, chicken, and runny egg',
    cuisine: 'Korean',
    timeMinutes: 18,
    estimatedCostRM: 10.50,
    servings: 2,
    difficulty: 'Easy',
    calories: 520,
    protein: 34,
    carbs: 64,
    fat: 13,
    fibre: 4,
    requiredEquipment: ['Frying pan', 'Stove'],
    dishCategory: 'rice',
    badgeText: '90% match',
    matchScore: 90,
    matchReason: 'Great probiotic crunch · Fast 18 min · Uses leftover rice & chicken',
    ingredients: [
      { id: 'kc1', name: 'Chicken breast (diced)', amount: '200g', have: true },
      { id: 'kc2', name: 'Cold cooked rice', amount: '2 cups', have: true },
      { id: 'kc3', name: 'Eggs (fried sunny-side up)', amount: '2 whole', have: true },
      { id: 'kc4', name: 'Garlic', amount: '2 cloves', have: true },
      { 
        id: 'kc5', 
        name: 'Aged Kimchi (chopped)', 
        amount: '1/2 cup', 
        have: false, 
        estCostIfMissing: 3.50,
        substitute: 'Pickled mustard greens or hot sauce + cabbage',
        substituteNote: 'Tangy crunch with spicy warmth.'
      }
    ],
    healthierVariant: {
      calories: 450,
      protein: 37,
      carbs: 56,
      fat: 8,
      fibre: 6,
      modifications: [
        'Add extra shredded cabbage to bulk up portion with near-zero calories',
        'Use kimchi juice directly for seasoning rather than extra oil'
      ],
      swaps: [
        { original: '1.5 tbsp cooking oil', replacement: 'Kimchi juice + 1/2 tsp sesame oil', note: 'Cuts 80 kcal of oil' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Sizzle chicken and kimchi',
        instruction: 'Stir fry chicken cubes until cooked, then add chopped kimchi and cook until juices caramelize.',
        timerMinutes: 4,
        whatToLookFor: 'Kimchi turns translucent and smells smoky sweet.',
        visualType: 'sear'
      },
      {
        stepNumber: 2,
        title: 'Fold in rice',
        instruction: 'Add rice and kimchi juice. Press and toss in pan until every grain is orange and spicy.',
        timerMinutes: 4,
        whatToLookFor: 'Grains separated and sizzling evenly.',
        visualType: 'simmer'
      },
      {
        stepNumber: 3,
        title: 'Top with runny fried egg',
        instruction: 'Serve rice in bowl with sunny egg on top; let the yolk break into the warm rice.',
        timerMinutes: 2,
        whatToLookFor: 'Golden runny yolk melting into fiery kimchi rice.',
        visualType: 'plate'
      }
    ]
  },
  {
    id: 'japanese-curry-chicken',
    name: 'Quick Japanese Curry Chicken & Rice',
    tagline: 'Warm comforting mild curry gravy with tender chicken, potatoes, and carrots',
    cuisine: 'Japanese',
    timeMinutes: 26,
    estimatedCostRM: 12.50,
    servings: 2,
    difficulty: 'Easy',
    calories: 580,
    protein: 35,
    carbs: 72,
    fat: 16,
    fibre: 5,
    requiredEquipment: ['Pot', 'Knife', 'Stove'],
    dishCategory: 'rice',
    badgeText: '89% match',
    matchScore: 89,
    matchReason: 'Classic soul food · Uses chicken & rice · Fills you up for hours',
    ingredients: [
      { id: 'jc1', name: 'Chicken breast or thigh', amount: '240g', have: true },
      { id: 'jc2', name: 'Cooked rice', amount: '2 bowls', have: true },
      { id: 'jc3', name: 'Onion & garlic', amount: '1 onion, 2 garlic', have: true },
      { 
        id: 'jc4', 
        name: 'Japanese curry roux cube', 
        amount: '2 blocks', 
        have: false, 
        estCostIfMissing: 2.80,
        substitute: 'Curry powder + 1 tbsp flour + 1 tsp soy sauce',
        substituteNote: 'Pantry roux substitute thickens gravy with similar warm spiced profile.'
      },
      { 
        id: 'jc5', 
        name: 'Potato or carrot', 
        amount: '1 medium', 
        have: false, 
        estCostIfMissing: 1.50,
        substitute: 'Extra onions or pumpkin',
        substituteNote: 'Provides comforting body in the curry stew.'
      }
    ],
    healthierVariant: {
      calories: 505,
      protein: 38,
      carbs: 64,
      fat: 10,
      fibre: 7,
      modifications: [
        'Skim surface oil and use skinless chicken breast',
        'Add extra chunks of cauliflower/carrots to replace half the potato'
      ],
      swaps: [
        { original: '2 blocks commercial roux', replacement: 'Curry powder + tomato paste + light stock', note: 'Reduces palm oil saturated fat by 50%' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Sauté onion and chicken',
        instruction: 'Cook sliced onions in pot until soft, add chicken chunks and sear lightly.',
        timerMinutes: 4,
        whatToLookFor: 'Sweet browned onions and sealed chicken.',
        visualType: 'sear'
      },
      {
        stepNumber: 2,
        title: 'Simmer with water',
        instruction: 'Pour in 1.5 cups water and vegetables. Simmer gently for 10 minutes until tender.',
        timerMinutes: 10,
        whatToLookFor: 'Vegetables fork-tender and broth aromatic.',
        visualType: 'simmer'
      },
      {
        stepNumber: 3,
        title: 'Dissolve curry roux',
        instruction: 'Turn off heat. Break in curry roux and stir until completely melted, then simmer 2 minutes on low.',
        timerMinutes: 3,
        whatToLookFor: 'Velvety rich brown curry coating the back of a spoon.',
        visualType: 'sauce'
      }
    ]
  },
  {
    id: 'creamy-chicken-pasta',
    name: 'Creamy Garlic Chicken Pasta',
    tagline: 'Silky comfort pasta tossed with tender garlic chicken and parmesan aroma',
    cuisine: 'Italian',
    timeMinutes: 22,
    estimatedCostRM: 13.80,
    servings: 2,
    difficulty: 'Easy',
    calories: 850,
    protein: 38,
    carbs: 82,
    fat: 38,
    fibre: 3,
    requiredEquipment: ['Pot', 'Frying pan', 'Knife', 'Stove'],
    dishCategory: 'noodles',
    badgeText: '86% match',
    matchScore: 86,
    matchReason: 'Classic Italian comfort · Highlighted in Healthy Mode with smart swaps',
    ingredients: [
      { id: 'cp1', name: 'Chicken breast (sliced)', amount: '240g', have: true },
      { id: 'cp2', name: 'Garlic cloves', amount: '4 cloves', have: true },
      { id: 'cp3', name: 'Pasta (penne or fettuccine)', amount: '180g', have: true },
      { 
        id: 'cp4', 
        name: 'Heavy cooking cream', 
        amount: '120ml', 
        have: false, 
        estCostIfMissing: 3.50,
        substitute: 'Milk / Greek yogurt + pasta water + splash of oil',
        substituteNote: 'Creates a rich emulsified cream sauce with 60% fewer calories.'
      },
      { 
        id: 'cp5', 
        name: 'Parmesan cheese', 
        amount: '2 tbsp', 
        have: false, 
        estCostIfMissing: 3.00,
        substitute: 'Pinch of nutritional yeast or aged cheddar',
        substituteNote: 'Provides savory umami depth.'
      }
    ],
    healthierVariant: {
      calories: 620,
      protein: 45,
      carbs: 68,
      fat: 14,
      fibre: 7,
      modifications: [
        'Greek yogurt & pasta cooking water swap instead of 120ml heavy cream (-160 kcal)',
        'Whole-wheat penne with 2x fibre (+4g fibre, steadier blood sugar)',
        'Add 100g steamed broccoli florets directly into sauce for volume'
      ],
      swaps: [
        { original: 'Heavy cream (120ml, ~400 kcal)', replacement: 'Greek yogurt (80g) + starchy pasta water (~90 kcal)', note: 'Cuts 230 kcal while increasing protein by 8g' },
        { original: '2 tbsp butter', replacement: '1 tsp extra virgin olive oil', note: 'Reduces saturated fats by 75%' },
        { original: 'Extra cheese topping', replacement: 'Fresh cracked black pepper & lemon zest', note: 'Zero calorie brightness' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Boil pasta & reserve water',
        instruction: 'Cook pasta in salted boiling water until al dente. Scoop out 1/2 cup of starchy pasta water before draining.',
        timerMinutes: 8,
        whatToLookFor: 'Pasta has slight bite in the center; water is starchy and cloudy.',
        visualType: 'simmer'
      },
      {
        stepNumber: 2,
        title: 'Sear chicken & garlic',
        instruction: 'In frying pan, sear chicken slices with minced garlic until golden and cooked through.',
        timerMinutes: 5,
        whatToLookFor: 'Garlic is fragrant and chicken slices have gentle golden color.',
        visualType: 'sear'
      },
      {
        stepNumber: 3,
        title: 'Emulsify creamy sauce & coat',
        instruction: 'Lower heat. Stir in cream (or yogurt swap) and splash of reserved pasta water. Toss in cooked pasta.',
        timerMinutes: 3,
        whatToLookFor: 'Velvety sauce clinging smoothly to every noodle piece without separating.',
        visualType: 'sauce'
      }
    ]
  }
];
