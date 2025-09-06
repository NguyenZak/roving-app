"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuContent, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Compass, Landmark, Phone, Search as SearchIcon, Globe, ChevronRight, MapPin, FileText, Plane } from "lucide-react";
import LanguageSwitch from "@/components/site/LanguageSwitch";
import { useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { useLocale } from "next-intl";
import { getProvincesForRegion, getProvinceDisplayName, slugify, type LocaleOption } from "@/lib/regions";

interface Region {
  key: string;
  nameEn: string;
  nameVi: string;
  image: string;
}

interface Destination {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  image: string;
  alt: string;
  isFeatured: boolean;
  order: number;
  region: string;
  Region?: {
    key: string;
    nameEn: string;
    nameVi: string;
  };
}

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations("nav");
  const tLive = useTranslations("live");
  const locale = useLocale() as LocaleOption;
  const [hoveredRegion, setHoveredRegion] = useState<"north" | "central" | "south" | null>(null);
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch regions
        const regionsRes = await fetch("/api/regions");
        if (regionsRes.ok) {
          const regionsData = await regionsRes.json();
          setRegions(regionsData.items || []);
        }

        // Fetch destinations
        const destinationsRes = await fetch("/api/destinations");
        if (destinationsRes.ok) {
          const destinationsData = await destinationsRes.json();
          setDestinations(destinationsData.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/regions/packages?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowSearch(false);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSearch) {
        const target = event.target as Element;
        if (!target.closest('[data-search-container]')) {
          setShowSearch(false);
        }
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearch]);

  const headerClass = transparent
    ? `fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg" 
          : "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
      }`
    : "fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg";

  const textColor = "text-gray-900";
  const hoverColor = "hover:text-violet-600";

  return (
    <header className={headerClass}>
      <div className="mx-auto max-w-[1440px] px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <MapPin className="h-8 w-8 text-violet-600 group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="flex flex-col">
            <span className="font-inter-bold text-lg text-gray-900">
              Roving Vietnam
            </span>
            <span className="font-inter-normal text-xs text-gray-500">
              Travel & Tours
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className={`bg-transparent hover:bg-transparent px-6 py-3 font-inter-medium text-base ${textColor} ${hoverColor} transition-all duration-300 rounded-lg hover:bg-violet-50/50`}>
                  {t("live")}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-8 w-screen md:w-[1100px] md:left-1/2 md:-translate-x-1/2 bg-white/98 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {regions.map((region) => (
                      <Link key={region.key} href={`/regions/${region.key}`} className="group block">
                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                          <img src={region.image} alt={region.nameVi} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute inset-0 flex items-end p-6">
                            <span className="text-white font-inter-bold text-xl drop-shadow-2xl">
                              {region.nameVi}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={`bg-transparent hover:bg-transparent px-6 py-3 font-inter-medium text-base ${textColor} ${hoverColor} transition-all duration-300 rounded-lg hover:bg-violet-50/50`}>
                  {t("mustSee")}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-8 w-screen md:w-[1000px] md:left-1/2 md:-translate-x-1/2 border border-gray-200 rounded-2xl shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {(["north","central","south"] as const).map((regionKey) => {
                      const regionDestinations = destinations.filter(d => d.Region?.key === regionKey);
                      return (
                        <div
                          key={regionKey}
                          className="space-y-6"
                          onMouseEnter={() => setHoveredRegion(regionKey)}
                          onFocus={() => setHoveredRegion(regionKey)}
                          onMouseLeave={() => setHoveredRegion(null)}
                        >
                          <Link href={`/regions/${regionKey}`} className="group block">
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105">
                              <img src={regions.find(r => r.key === regionKey)?.image || "/placeholder-region.jpg"} alt="region" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                              <div className="absolute inset-0 flex items-end p-4">
                                <span className="text-white font-inter-bold text-lg drop-shadow-lg">
                                  {regionKey === 'north' ? 'Miền Bắc' : regionKey === 'central' ? 'Miền Trung' : 'Miền Nam'}
                                </span>
                              </div>
                            </div>
                          </Link>
                          <ul className="space-y-2">
                            {regionDestinations.map((destination) => (
                              <li key={`${regionKey}-${destination.slug}`}>
                                <Link 
                                  href={`/regions/${regionKey}/${destination.slug}`} 
                                  className="flex items-center gap-3 text-gray-800 hover:text-violet-600 transition-all duration-300 group p-3 rounded-lg hover:bg-violet-50/50"
                                >
                                  <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-violet-600 transition-all duration-300 group-hover:translate-x-1" />
                                  <span className="text-sm font-inter-medium">
                                    {locale === "vi" ? destination.nameVi : destination.nameEn}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className={`px-4 py-2 font-inter-medium transition-colors duration-200 ${textColor} ${hoverColor}`}>
                    {t("about")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/tours" className={`px-4 py-2 font-inter-medium transition-colors duration-200 ${textColor} ${hoverColor}`}>
                    Tours
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/contact" className={`px-4 py-2 font-inter-medium transition-colors duration-200 ${textColor} ${hoverColor}`}>
                    {t("contact")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Language Switch */}
          <LanguageSwitch />

          {/* Search Icon with Popup */}
          <div className="relative" data-search-container>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              aria-label={locale === "vi" ? "Tìm kiếm" : "Search"}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>

            {/* Search Popup */}
            {showSearch && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 animate-in slide-in-from-top-2 duration-200">
                <form onSubmit={handleSearch} className="space-y-3">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={locale === "vi" ? "Tìm kiếm điểm đến..." : "Search destinations..."}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg"
                  >
                    {locale === "vi" ? "Tìm kiếm" : "Search"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Open menu" 
                className="text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-80 bg-white/95 backdrop-blur-md">
              <SheetHeader className="p-6 border-b border-gray-200">
                <SheetTitle className="text-xl font-inter-bold text-gray-900">Roving Vietnam Travel</SheetTitle>
              </SheetHeader>
              
              <div className="p-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={locale === "vi" ? "Tìm kiếm..." : "Search..."}
                      className="pl-10 pr-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full mt-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg"
                  >
                    {locale === "vi" ? "Tìm kiếm" : "Search"}
                  </Button>
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  <Link
                    href="/regions/packages"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-inter-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors duration-200"
                  >
                    <Compass className="h-5 w-5" />
                    <span>{t("live")}</span>
                  </Link>
                  <Link
                    href="/regions/north"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-inter-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors duration-200"
                  >
                    <Landmark className="h-5 w-5" />
                    <span>{t("mustSee")}</span>
                  </Link>
                
                  <Link
                    href="/tours"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-inter-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors duration-200"
                  >
                    <Plane className="h-5 w-5" />
                    <span>Tours</span>
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-inter-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors duration-200"
                  >
                    <Home className="h-5 w-5" />
                    <span>{t("about")}</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-inter-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors duration-200"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{t("contact")}</span>
                  </Link>
                </nav>
              </div>

              <SheetFooter className="p-6 border-t border-gray-200">
                <div className="w-full">
                  <LanguageSwitch />
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


