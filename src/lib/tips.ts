export type TipItem = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  date: string;
  comments: number;
};

const makeSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const tipsData: TipItem[] = [
  {
    title: "Best Time to Visit",
    excerpt: "North: Oct–Apr, Central: Feb–Aug, South: Nov–Apr.",
    content:
      "North: Oct–Apr for cooler, dry weather. Central: Feb–Aug for beaches with less rain. South: Nov–Apr is dry season. Shoulder months bring fewer crowds and better deals.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop",
    tags: ["planning", "seasons"],
    date: "4.4.23",
    comments: 1,
    slug: "best-time-to-visit",
  },
  {
    title: "Currency & Payments",
    excerpt: "VND is common; cards accepted in cities. Carry small cash.",
    content:
      "Vietnamese Dong (VND) is the main currency. Major cities accept cards; smaller shops and rural areas prefer cash. Keep small notes for taxis, street food, and tips.",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1600&auto=format&fit=crop",
    tags: ["money", "tips"],
    date: "5.6.23",
    comments: 2,
    slug: "currency-and-payments",
  },
  {
    title: "Connectivity",
    excerpt: "Buy a local eSIM/SIM for reliable 4G and cheaper data.",
    content:
      "Pick up a local SIM/eSIM on arrival (e.g., Viettel, Vinaphone, MobiFone). 4G coverage is strong in cities and decent in rural areas. Top up via apps or convenience stores.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    tags: ["sim", "internet"],
    date: "7.1.24",
    comments: 0,
    slug: "connectivity",
  },
  {
    title: "Safety & Health",
    excerpt: "Use sunscreen, stay hydrated, and beware of traffic when crossing.",
    content:
      "Vietnam is generally safe. Keep valuables secure, hydrate well in hot months, and use sunscreen. Cross streets steadily—make eye contact and move at a constant pace.",
    image: "https://images.unsplash.com/photo-1551829142-5d4ca02c0f9b?q=80&w=1600&auto=format&fit=crop",
    tags: ["health", "safety"],
    date: "8.12.24",
    comments: 3,
    slug: "safety-and-health",
  },
  {
    title: "Local Etiquette",
    excerpt: "Dress modestly at temples, remove shoes when required.",
    content:
      "At temples and pagodas, dress modestly and remove shoes where required. Use two hands when giving/receiving items and avoid touching heads. Be respectful when photographing locals.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
    tags: ["culture", "etiquette"],
    date: "9.3.24",
    comments: 0,
    slug: "local-etiquette",
  },
  {
    title: "Transport Apps",
    excerpt: "Grab and Be are great for cabs and food delivery.",
    content:
      "Grab and Be offer reliable rides (car/bike) and food delivery at transparent prices. Always check the license plate and share trips when traveling late.",
    image: "https://images.unsplash.com/photo-1511397051536-5a93f14f56b5?q=80&w=1600&auto=format&fit=crop",
    tags: ["transport", "apps"],
    date: "10.19.24",
    comments: 4,
    slug: "transport-apps",
  },
  {
    title: "Packing Essentials",
    excerpt: "Light clothing, rain jacket, comfy shoes, adapter, sunscreen.",
    content:
      "Bring breathable clothes, a light rain jacket, comfortable shoes, universal adapter, sunscreen, insect repellent, and basic meds. A small daypack is handy for excursions.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop",
    tags: ["packing", "checklist"],
    date: "11.02.24",
    comments: 2,
    slug: "packing-essentials",
  },
  {
    title: "Visa & Entry",
    excerpt: "Check e-visa eligibility and passport validity (6+ months).",
    content:
      "Verify your nationality's e-visa eligibility. Ensure passport validity of at least 6 months and 1–2 blank pages. Keep accommodation and exit details handy for immigration.",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1600&auto=format&fit=crop",
    tags: ["visa", "entry"],
    date: "12.10.24",
    comments: 5,
    slug: "visa-and-entry",
  },
  {
    title: "Food & Water",
    excerpt: "Enjoy street food; choose busy stalls; drink bottled/boiled water.",
    content:
      "Try street food at busy, high-turnover stalls. Avoid raw ice where unsure. Drink bottled or boiled water and consider probiotics if you have a sensitive stomach.",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1600&auto=format&fit=crop",
    tags: ["food", "health"],
    date: "01.05.25",
    comments: 3,
    slug: "food-and-water",
  },
  {
    title: "Language Basics",
    excerpt: "Learn simple Vietnamese phrases to connect with locals.",
    content:
      "A few phrases go a long way: xin chào (hello), cảm ơn (thank you), bao nhiêu tiền? (how much?). Speak slowly and smile—locals appreciate the effort.",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop",
    tags: ["language", "culture"],
    date: "01.18.25",
    comments: 1,
    slug: "language-basics",
  },
];

export function getTipBySlug(slug: string): TipItem | undefined {
  return tipsData.find((t) => t.slug === slug || makeSlug(t.title) === slug);
}


