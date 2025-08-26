import SEOJsonLd from "@/components/site/SEOJsonLd";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-white">
      <SEOJsonLd />
      <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-primary font-semibold text-lg">Fresh Travel</div>
          <p className="mt-2 text-sm text-muted-foreground">Live fully in Vietnam.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Quick Links</div>
          <ul className="space-y-1 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tours">Tours</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <ul className="space-y-1 text-sm">
            <li>Email: hello@fresh-travel.example</li>
            <li>Phone: +84 000 000 000</li>
            <li>Address: Ho Chi Minh City</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Social</div>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground py-4 border-t">© {year} Fresh Travel</div>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Fresh Travel",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ho Chi Minh City",
          addressCountry: "VN"
        },
        url: "https://www.fresh-travel.example"
      })}} />
    </footer>
  );
}


