import Script from "next/script";

export default function SEOJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Roving Vietnam Travel",
    url: "https://www.rovingvietnamtravel.com",
    logo: "https://www.rovingvietnamtravel.com/og.jpg",
  };
  return (
    <Script id="jsonld-organization" type="application/ld+json">
      {JSON.stringify(org)}
    </Script>
  );
}


