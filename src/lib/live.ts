export type LiveItem = {
  key: "north" | "central" | "south" | "packages";
  image: string;
  alt: string;
};

export const liveItems: readonly LiveItem[] = [
  {
    key: "north",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop",
    alt: "Northern Vietnam scenery",
  },
  {
    key: "central",
    image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop",
    alt: "Central Vietnam ancient town",
  },
  {
    key: "south",
    image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop",
    alt: "Southern Vietnam palm beach",
  },
  {
    key: "packages",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
    alt: "Travel packages and experiences",
  },
];


