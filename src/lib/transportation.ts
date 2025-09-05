export type TransportItem = {
  key: "plane" | "train" | "bus" | "boat";
  title: string;
  image: string;
  alt: string;
  summary: string;
  content: string;
  tags: string[];
  date: string;
  comments: number;
};

export const transportData: TransportItem[] = [
  {
    key: "plane",
    title: "Flights",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop",
    alt: "Airplane in the sky",
    summary: "Domestic and international routes to major cities.",
    content: "Vietnam is well-connected by air with multiple daily flights between major hubs (HAN, SGN, DAD). Book early for holiday seasons.",
    tags: ["air", "fast"],
    date: "02.10.25",
    comments: 3,
  },
  {
    key: "train",
    title: "Railway",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=1600&auto=format&fit=crop",
    alt: "Train passing through countryside",
    summary: "Reunification Express along the coast of Vietnam.",
    content: "The North–South line is scenic with comfortable soft-seat and sleeper options. Great for slow travel.",
    tags: ["rail", "scenic"],
    date: "01.28.25",
    comments: 1,
  },
  {
    key: "bus",
    title: "Buses",
    image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236?q=80&w=1600&auto=format&fit=crop",
    alt: "Bus on the road",
    summary: "Comfortable sleeper buses across regions and provinces.",
    content: "Sleeper buses are budget-friendly for intercity travel; choose reputable operators for safety and comfort.",
    tags: ["budget", "overnight"],
    date: "12.22.24",
    comments: 2,
  },
  {
    key: "boat",
    title: "Boats",
    image: "https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=1600&auto=format&fit=crop",
    alt: "Boat at sea",
    summary: "Cruises and ferries for islands and bays.",
    content: "From Ha Long Bay cruises to ferries serving Phu Quoc and Con Dao, boats open up Vietnam's islands and bays.",
    tags: ["islands", "ferry"],
    date: "11.05.24",
    comments: 0,
  },
];

export function getTransportByKey(key: string): TransportItem | undefined {
  return transportData.find((t) => t.key === key);
}


