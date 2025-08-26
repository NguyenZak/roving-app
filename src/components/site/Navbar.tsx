"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import LanguageSwitch from "@/components/site/LanguageSwitch";
import { useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = transparent
    ? `fixed top-0 inset-x-0 z-50 transition-colors ${isScrolled ? "bg-white/80 backdrop-blur border-b text-gray-900" : "bg-transparent border-transparent text-white"}`
    : "sticky top-0 z-50 bg-white/80 backdrop-blur border-b";
  return (
    <header className={headerClass}>
      <div className="font-semibold mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="sr-only">Roving Vietnam Travel</span>
          <span className={`${transparent ? (isScrolled ? "text-primary" : "text-white") : "text-primary"} font-semibold text-lg`}>Roving Vietnam Travel</span>
        </Link>
        <nav className={`hidden md:flex items-center gap-4 ${transparent && !isScrolled ? "text-white" : ""}`}>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#live" className={`px-3 py-2 transition ${transparent && !isScrolled ? "hover:text-white/80" : "hover:text-primary"}`}>{t("live")}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#must-see" className={`px-3 py-2 transition ${transparent && !isScrolled ? "hover:text-white/80" : "hover:text-primary"}`}>{t("mustSee")}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#about" className={`px-3 py-2 transition ${transparent && !isScrolled ? "hover:text-white/80" : "hover:text-primary"}`}>{t("about")}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#contact" className={`px-3 py-2 transition ${transparent && !isScrolled ? "hover:text-white/80" : "hover:text-primary"}`}>{t("contact")}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = search.trim();
              if (q.length === 0) return;
              router.push(`/regions/packages?q=${encodeURIComponent(q)}`);
            }}
            className="hidden md:flex items-center gap-2"
            role="search"
            aria-label="Site search"
          >
            <div className="w-52">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search packages..."
                aria-label="Search packages"
                className={`${transparent && !isScrolled ? "placeholder:text-white/80 text-white" : ""}`}
              />
            </div>
            <Button type="submit" size="sm" className="shrink-0">Search</Button>
          </form>
          <LanguageSwitch />
        </nav>
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className={`${transparent && !isScrolled ? "text-white" : ""}`}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = search.trim();
                  if (q.length === 0) return;
                  setOpen(false);
                  router.push(`/regions/packages?q=${encodeURIComponent(q)}`);
                }}
                className="mt-6"
                role="search"
                aria-label="Site search"
              >
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search packages..."
                  aria-label="Search packages"
                />
                <Button type="submit" className="mt-2 w-full">Search</Button>
              </form>
              <div className="grid gap-4 mt-6 font-semibold">
                <Link href="/#live" onClick={() => setOpen(false)}>{t("live")}</Link>
                <Link href="/#must-see" onClick={() => setOpen(false)}>{t("mustSee")}</Link>
                <Link href="/#about" onClick={() => setOpen(false)}>{t("about")}</Link>
                <Link href="/#contact" onClick={() => setOpen(false)}>{t("contact")}</Link>
                <LanguageSwitch />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


