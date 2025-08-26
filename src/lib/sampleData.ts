export type TourItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image: string;
  coordinates: [number, number];
};

export const tours: TourItem[] = [
  {
    id: "1",
    slug: "ha-long-bay",
    title: "Ha Long Bay",
    description: "Cruise among limestone karsts and emerald waters.",
    price: 120,
    location: "Quang Ninh, Vietnam",
    image: "/window.svg",
    coordinates: [107.043, 20.910],
  },
  {
    id: "2",
    slug: "hoi-an",
    title: "Hoi An Ancient Town",
    description: "Lantern-lit streets and UNESCO heritage charm.",
    price: 90,
    location: "Quang Nam, Vietnam",
    image: "/window.svg",
    coordinates: [108.327, 15.880],
  },
  {
    id: "3",
    slug: "da-nang",
    title: "Da Nang",
    description: "Beaches, bridges, and Ba Na Hills.",
    price: 80,
    location: "Da Nang, Vietnam",
    image: "/window.svg",
    coordinates: [108.220, 16.067],
  },
  {
    id: "4",
    slug: "sapa",
    title: "Sapa",
    description: "Terraced fields and mountain villages.",
    price: 110,
    location: "Lao Cai, Vietnam",
    image: "/window.svg",
    coordinates: [103.841, 22.335],
  },
  {
    id: "5",
    slug: "nha-trang",
    title: "Nha Trang",
    description: "Sun-drenched beaches and island hopping.",
    price: 95,
    location: "Khanh Hoa, Vietnam",
    image: "/window.svg",
    coordinates: [109.196, 12.238],
  },
  {
    id: "6",
    slug: "phu-quoc",
    title: "Phu Quoc",
    description: "Pristine shores and tropical forests.",
    price: 130,
    location: "Kien Giang, Vietnam",
    image: "/window.svg",
    coordinates: [103.960, 10.289],
  },
];


