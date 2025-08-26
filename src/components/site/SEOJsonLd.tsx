import Script from "next/script";

export default function SEOJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Roving Vietnam Travel",
    url: "https://www.fresh-travel.example",
    logo: "https://www.fresh-travel.example/og.jpg",
  };
  return (
    <Script id="jsonld-organization" type="application/ld+json">
      {JSON.stringify(org)}
    </Script>
  );
}


