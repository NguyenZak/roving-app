import Image from "next/image";
import { Link } from "@/i18n/routing";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tours } from "@/lib/sampleData";

export default function ToursPage() {
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          {tours.map((t) => (
            <Card key={t.id} className="overflow-hidden group">
              <div className="relative h-48">
                <Image src={t.image} alt={`${t.title} tour image`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.description}</p>
                <div className="mt-3 text-sm">From ${t.price}</div>
                <div className="mt-4">
                  <Link href={`/tours/${t.slug}`} className="text-primary">View details</Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}


