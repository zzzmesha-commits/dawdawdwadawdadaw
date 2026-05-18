
export interface Item {
  id: string;
  name: string;
  rarity: 'ancient' | 'godly' | 'chroma' | 'unique' | 'legendary' | 'rare' | 'uncommon' | 'common';
  value: string;
  demand: string;
  status: string;
  updated: string;
  image: string;
  category: 'Knife' | 'Gun' | 'Set' | 'Pet' | 'Misc';
  price: number;
  originalPrice: number;
}

export const ITEMS: Item[] = [
  {
    id: '1',
    name: "Nik's Scythe",
    rarity: 'ancient',
    value: '125.0M',
    demand: 'High',
    status: 'Overpaid',
    updated: '20h ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fniks-scythe.webp&w=256&q=75',
    category: 'Knife',
    price: 649.99,
    originalPrice: 1200.00
  },
  {
    id: '2',
    name: "Chroma Traveler's",
    rarity: 'chroma',
    value: '227.5K',
    demand: 'Very High',
    status: 'Stable',
    updated: '1mo ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-travelers-gun.webp&w=256&q=75',
    category: 'Knife',
    price: 349.99,
    originalPrice: 550.00
  },
  {
    id: '3',
    name: 'Chroma Evergun',
    rarity: 'chroma',
    value: '81.5K',
    demand: 'High',
    status: 'Underpaid',
    updated: '20h ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-evergun.webp&w=256&q=75',
    category: 'Gun',
    price: 219.99,
    originalPrice: 350.00
  },
  {
    id: '4',
    name: 'Chroma Evergreen',
    rarity: 'chroma',
    value: '60K',
    demand: 'High',
    status: 'Stable',
    updated: '11d ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-evergreen.webp&w=256&q=75',
    category: 'Knife',
    price: 189.50,
    originalPrice: 280.00
  },
  {
    id: '5',
    name: 'Red Icecrusher',
    rarity: 'ancient',
    value: '45K',
    demand: '-',
    status: '-',
    updated: '1mo ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fred-icecrusher.webp&w=256&q=75',
    category: 'Knife',
    price: 124.99,
    originalPrice: 200.00
  },
  {
    id: '6',
    name: 'Red Icepiercer',
    rarity: 'ancient',
    value: '45K',
    demand: '-',
    status: '-',
    updated: '1mo ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fred-icepiercer.webp&w=256&q=75',
    category: 'Gun',
    price: 124.99,
    originalPrice: 200.00
  },
  {
    id: '7',
    name: 'Blue Elderwood Blade',
    rarity: 'ancient',
    value: '45K',
    demand: '-',
    status: '-',
    updated: '1mo ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fblue-elderwood-blade.webp&w=256&q=75',
    category: 'Knife',
    price: 124.99,
    originalPrice: 200.00
  },
  {
    id: '8',
    name: 'Blue Swirly Axe',
    rarity: 'ancient',
    value: '40K',
    demand: '-',
    status: '-',
    updated: '1mo ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fblue-swirly-axe.webp&w=256&q=75',
    category: 'Knife',
    price: 109.50,
    originalPrice: 175.00
  },
  {
    id: '9',
    name: 'Blue Synthwave',
    rarity: 'ancient',
    value: '40K',
    demand: '-',
    status: '-',
    updated: '1mo ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fblue-synthwave.webp&w=256&q=75',
    category: 'Knife',
    price: 109.50,
    originalPrice: 175.00
  },
  {
    id: '10',
    name: 'Chroma Bauble',
    rarity: 'chroma',
    value: '38.3K',
    demand: 'High',
    status: 'Stable',
    updated: '2d ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-bauble.webp&w=256&q=75',
    category: 'Gun',
    price: 99.99,
    originalPrice: 150.00
  },
  {
    id: '11',
    name: 'Chroma Constellation',
    rarity: 'chroma',
    value: '35.5K',
    demand: 'High',
    status: 'Stable',
    updated: '24d ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-constellation.webp&w=256&q=75',
    category: 'Knife',
    price: 89.50,
    originalPrice: 135.00
  },
  {
    id: '12',
    name: "Chroma Vampire's",
    rarity: 'chroma',
    value: '35.3K',
    demand: 'High',
    status: 'Stable',
    updated: '20h ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-vampires-gun.webp&w=256&q=75',
    category: 'Knife',
    price: 89.50,
    originalPrice: 135.00
  },
  {
    id: '13',
    name: 'Chroma Snowstorm',
    rarity: 'chroma',
    value: '4.3K',
    demand: 'Very High',
    status: 'Stable',
    updated: '21d ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-snowstorm.webp&w=256&q=75',
    category: 'Knife',
    price: 49.50,
    originalPrice: 85.00
  },
  {
    id: '14',
    name: 'Chroma Watergun',
    rarity: 'chroma',
    value: '3.4K',
    demand: 'Very High',
    status: 'Stable',
    updated: '8d ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-watergun.webp&w=256&q=75',
    category: 'Gun',
    price: 44.99,
    originalPrice: 75.00
  },
  {
    id: '15',
    name: 'Evergun',
    rarity: 'godly',
    value: '3.4K',
    demand: 'Very High',
    status: 'Stable',
    updated: '21h ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fevergun.webp&w=256&q=75',
    category: 'Gun',
    price: 44.99,
    originalPrice: 75.00
  },
  {
    id: '16',
    name: 'Chroma Sweet',
    rarity: 'chroma',
    value: '3.1K',
    demand: 'Very High',
    status: 'Underpaid',
    updated: '21h ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-sweet.webp&w=256&q=75',
    category: 'Knife',
    price: 39.50,
    originalPrice: 65.00
  },
  {
    id: '17',
    name: 'Chroma Ornament',
    rarity: 'chroma',
    value: '2.7K',
    demand: 'Very High',
    status: 'Stable',
    updated: '4d ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-ornament.webp&w=256&q=75',
    category: 'Knife',
    price: 29.99,
    originalPrice: 55.00
  },
  {
    id: '18',
    name: 'Constellation',
    rarity: 'godly',
    value: '2.6K',
    demand: 'Very High',
    status: 'Stable',
    updated: '3d ago',
    image: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fconstellation.webp&w=256&q=75',
    category: 'Knife',
    price: 29.99,
    originalPrice: 55.00
  }
];
