export type RegionKey = "north" | "central" | "south" | "packages";
export type LocaleOption = "vi" | "en";

export interface Province {
  nameVi: string;
  nameEn: string;
  image: string;
  alt: string;
}

export interface PackageDefinition {
  titleVi: string;
  titleEn: string;
  image: string;
  duration: { days: number; nights: number };
}

export const regionLabels: Record<LocaleOption, Record<RegionKey, string>> = {
  vi: {
    north: "Miền Bắc",
    central: "Miền Trung",
    south: "Miền Nam",
    packages: "Gói tour",
  },
  en: {
    north: "Northern Vietnam",
    central: "Central Vietnam",
    south: "Southern Vietnam",
    packages: "Packages",
  },
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const regions: Record<RegionKey, Province[]> = { 
  north: [
    { nameVi: "Hà Giang", nameEn: "Ha Giang", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Ha Giang" },
    { nameVi: "Cao Bằng", nameEn: "Cao Bang", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", alt: "Cao Bang" },
    { nameVi: "Bắc Kạn", nameEn: "Bac Kan", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", alt: "Bac Kan" },
    { nameVi: "Lạng Sơn", nameEn: "Lang Son", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", alt: "Lang Son" },
    { nameVi: "Tuyên Quang", nameEn: "Tuyen Quang", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", alt: "Tuyen Quang" },
    { nameVi: "Thái Nguyên", nameEn: "Thai Nguyen", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", alt: "Thai Nguyen" },
    { nameVi: "Phú Thọ", nameEn: "Phu Tho", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", alt: "Phu Tho" },
    { nameVi: "Bắc Giang", nameEn: "Bac Giang", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", alt: "Bac Giang" },
    { nameVi: "Quảng Ninh", nameEn: "Quang Ninh", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", alt: "Quang Ninh" },
    { nameVi: "Hải Dương", nameEn: "Hai Duong", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", alt: "Hai Duong" },
    { nameVi: "Hưng Yên", nameEn: "Hung Yen", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", alt: "Hung Yen" },
    { nameVi: "Vĩnh Phúc", nameEn: "Vinh Phuc", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", alt: "Vinh Phuc" },
    { nameVi: "Bắc Ninh", nameEn: "Bac Ninh", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", alt: "Bac Ninh" },
    { nameVi: "Thái Bình", nameEn: "Thai Binh", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", alt: "Thai Binh" },
    { nameVi: "Nam Định", nameEn: "Nam Dinh", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", alt: "Nam Dinh" },
    { nameVi: "Hà Nam", nameEn: "Ha Nam", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Ha Nam" },
    { nameVi: "Ninh Bình", nameEn: "Ninh Binh", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", alt: "Ninh Binh" },
    { nameVi: "Lào Cai", nameEn: "Lao Cai", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", alt: "Lao Cai" },
    { nameVi: "Yên Bái", nameEn: "Yen Bai", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", alt: "Yen Bai" },
    { nameVi: "Lai Châu", nameEn: "Lai Chau", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", alt: "Lai Chau" },
    { nameVi: "Điện Biên", nameEn: "Dien Bien", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", alt: "Dien Bien" },
    { nameVi: "Sơn La", nameEn: "Son La", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", alt: "Son La" },
    { nameVi: "Hòa Bình", nameEn: "Hoa Binh", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Hoa Binh" },
  ],
  central: [
    // Bắc Trung Bộ
    { nameVi: "Thanh Hóa", nameEn: "Thanh Hoa", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Thanh Hoa" },
    { nameVi: "Nghệ An", nameEn: "Nghe An", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", alt: "Nghe An" },
    { nameVi: "Hà Tĩnh", nameEn: "Ha Tinh", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", alt: "Ha Tinh" },
    { nameVi: "Quảng Bình", nameEn: "Quang Binh", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", alt: "Quang Binh" },
    { nameVi: "Quảng Trị", nameEn: "Quang Tri", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", alt: "Quang Tri" },
    { nameVi: "Thừa Thiên-Huế", nameEn: "Thua Thien Hue", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", alt: "Thua Thien Hue" },
    // Duyên hải Nam Trung Bộ
    { nameVi: "Đà Nẵng", nameEn: "Da Nang", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", alt: "Da Nang" },
    { nameVi: "Quảng Nam", nameEn: "Quang Nam", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", alt: "Quang Nam" },
    { nameVi: "Quảng Ngãi", nameEn: "Quang Ngai", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Quang Ngai" },
    { nameVi: "Bình Định", nameEn: "Binh Dinh", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", alt: "Binh Dinh" },
    { nameVi: "Phú Yên", nameEn: "Phu Yen", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", alt: "Phu Yen" },
    { nameVi: "Khánh Hòa", nameEn: "Khanh Hoa", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", alt: "Khanh Hoa" },
    { nameVi: "Ninh Thuận", nameEn: "Ninh Thuan", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", alt: "Ninh Thuan" },
    { nameVi: "Bình Thuận", nameEn: "Binh Thuan", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", alt: "Binh Thuan" },
    // Tây Nguyên
    { nameVi: "Kon Tum", nameEn: "Kon Tum", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", alt: "Kon Tum" },
    { nameVi: "Gia Lai", nameEn: "Gia Lai", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", alt: "Gia Lai" },
    { nameVi: "Đắk Lắk", nameEn: "Dak Lak", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Dak Lak" },
    { nameVi: "Đắk Nông", nameEn: "Dak Nong", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", alt: "Dak Nong" },
    { nameVi: "Lâm Đồng", nameEn: "Lam Dong", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", alt: "Lam Dong" },
  ],
  south: [
    { nameVi: "Thành phố Hồ Chí Minh", nameEn: "Ho Chi Minh City", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Ho Chi Minh City" },
    { nameVi: "Bình Phước", nameEn: "Binh Phuoc", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", alt: "Binh Phuoc" },
    { nameVi: "Bình Dương", nameEn: "Binh Duong", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", alt: "Binh Duong" },
    { nameVi: "Đồng Nai", nameEn: "Dong Nai", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", alt: "Dong Nai" },
    { nameVi: "Tây Ninh", nameEn: "Tay Ninh", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", alt: "Tay Ninh" },
    { nameVi: "Bà Rịa - Vũng Tàu", nameEn: "Ba Ria - Vung Tau", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", alt: "Ba Ria - Vung Tau" },
    { nameVi: "Thành phố Cần Thơ", nameEn: "Can Tho City", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", alt: "Can Tho" },
    { nameVi: "Tỉnh An Giang", nameEn: "An Giang Province", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", alt: "An Giang" },
    { nameVi: "Tỉnh Bạc Liêu", nameEn: "Bac Lieu Province", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Bac Lieu" },
    { nameVi: "Tỉnh Bến Tre", nameEn: "Ben Tre Province", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", alt: "Ben Tre" },
    { nameVi: "Tỉnh Đồng Tháp", nameEn: "Dong Thap Province", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", alt: "Dong Thap" },
    { nameVi: "Tỉnh Hậu Giang", nameEn: "Hau Giang Province", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", alt: "Hau Giang" },
    { nameVi: "Tỉnh Kiên Giang", nameEn: "Kien Giang Province", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", alt: "Kien Giang" },
    { nameVi: "Tỉnh Long An", nameEn: "Long An Province", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", alt: "Long An" },
    { nameVi: "Tỉnh Sóc Trăng", nameEn: "Soc Trang Province", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", alt: "Soc Trang" },
    { nameVi: "Tỉnh Tiền Giang", nameEn: "Tien Giang Province", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", alt: "Tien Giang" },
    { nameVi: "Tỉnh Trà Vinh", nameEn: "Tra Vinh Province", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", alt: "Tra Vinh" },
    { nameVi: "Tỉnh Vĩnh Long", nameEn: "Vinh Long Province", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", alt: "Vinh Long" },
  ],
  packages: new Array(8).fill(null).map((_, i) => ({
    nameVi: `Gói ${i + 1}`,
    nameEn: `Package ${i + 1}`,
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
    alt: "Package",
  })),
};

export function getRegionLabel(locale: LocaleOption, region: RegionKey): string {
  return regionLabels[locale][region];
}

export function getProvincesForRegion(region: RegionKey): Province[] {
  return regions[region] || [];
}

export function getProvinceDisplayName(locale: LocaleOption, province: Province): string {
  return locale === "vi" ? province.nameVi : province.nameEn;
}

// Packages grouped by regions
export const packagesByRegion: Record<Exclude<RegionKey, "packages">, PackageDefinition[]> = {
  north: [
    { titleVi: "Hà Nội - Ninh Bình - Hạ Long", titleEn: "Hanoi - Ninh Binh - Ha Long", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", duration: { days: 4, nights: 3 } },
    { titleVi: "Hà Nội - Mai Châu - Pù Luông", titleEn: "Hanoi - Mai Chau - Pu Luong", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", duration: { days: 3, nights: 2 } },
    { titleVi: "Hà Nội - Mai Châu - Pù Luông - Ninh Bình", titleEn: "Hanoi - Mai Chau - Pu Luong - Ninh Binh", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", duration: { days: 4, nights: 3 } },
    { titleVi: "Hà Nội - Mai Châu - Pù Luông - Ninh Bình - Hạ Long", titleEn: "Hanoi - Mai Chau - Pu Luong - Ninh Binh - Ha Long", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", duration: { days: 5, nights: 4 } },
    { titleVi: "Hà Nội - Sapa - Hạ Long", titleEn: "Hanoi - Sapa - Ha Long", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", duration: { days: 5, nights: 4 } },
    { titleVi: "Hà Nội - Hà Giang - Cao Bằng", titleEn: "Hanoi - Ha Giang - Cao Bang", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", duration: { days: 5, nights: 4 } },
  ],
  central: [
    { titleVi: "Đà Nẵng - Hội An - Huế", titleEn: "Da Nang - Hoi An - Hue", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", duration: { days: 4, nights: 3 } },
    { titleVi: "Huế - Đà Nẵng - Bà Nà", titleEn: "Hue - Da Nang - Ba Na", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", duration: { days: 3, nights: 2 } },
    { titleVi: "Quy Nhơn - Phú Yên - Nha Trang", titleEn: "Quy Nhon - Phu Yen - Nha Trang", image: "https://images.unsplash.com/photo-1558981033-0c0b40745aac?q=80&w=1200&auto=format&fit=crop", duration: { days: 5, nights: 4 } },
    { titleVi: "Quảng Bình - Quảng Trị - Huế", titleEn: "Quang Binh - Quang Tri - Hue", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", duration: { days: 4, nights: 3 } },
  ],
  south: [
    { titleVi: "TP.HCM - Mỹ Tho - Cần Thơ", titleEn: "Ho Chi Minh City - My Tho - Can Tho", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", duration: { days: 3, nights: 2 } },
    { titleVi: "TP.HCM - Vũng Tàu - Long An", titleEn: "Ho Chi Minh City - Vung Tau - Long An", image: "https://images.unsplash.com/photo-1528372444006-1bfc81acab02?q=80&w=1200&auto=format&fit=crop", duration: { days: 3, nights: 2 } },
    { titleVi: "TP.HCM - Cần Thơ - Châu Đốc", titleEn: "Ho Chi Minh City - Can Tho - Chau Doc", image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", duration: { days: 4, nights: 3 } },
    { titleVi: "TP.HCM - Phú Quốc", titleEn: "Ho Chi Minh City - Phu Quoc", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop", duration: { days: 4, nights: 3 } },
  ],
};

export function getPackageGroups(locale: LocaleOption): { key: Exclude<RegionKey, "packages">; label: string; items: PackageDefinition[] }[] {
  return (['north', 'central', 'south'] as const).map((key) => ({
    key,
    label: `${locale === 'vi' ? 'Gói' : 'Packages'} ${getRegionLabel(locale, key as RegionKey)}`,
    items: packagesByRegion[key],
  }));
}

export function getPackageTitle(locale: LocaleOption, pkg: PackageDefinition): string {
  return locale === 'vi' ? pkg.titleVi : pkg.titleEn;
}



