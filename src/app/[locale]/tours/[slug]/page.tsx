import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Mapbox from "@/components/map/Mapbox";
import { tours } from "@/lib/sampleData";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export default function TourDetail({ params }: Props) {
  const tour = tours.find((t) => t.slug === params.slug);
  if (!tour) return notFound();
  return (
    <>
      <Navbar />
      <main className="py-10">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-8">
          <div className="relative h-64 md:h-96">
            <Image src={tour.image} alt={`${tour.title} image`} fill className="object-cover rounded-lg border" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{tour.title}</h1>
            <p className="mt-2 text-muted-foreground">{tour.description}</p>
            <div className="mt-4 font-medium">Location: {tour.location}</div>
            <div className="mt-1 text-primary font-semibold">${tour.price}</div>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 mt-8">
          <Mapbox coordinates={tour.coordinates} height={360} />
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        name: tour.title,
        description: tour.description,
        image: tour.image,
        address: tour.location
      })}} />
    </>
  );
}


