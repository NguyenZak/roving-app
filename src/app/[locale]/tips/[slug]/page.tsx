import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTipBySlug, tipsData } from "@/lib/tips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { Tag as TagIcon, CalendarDays, MessageSquare } from "lucide-react";

type Params = { params: { locale: string; slug: string } };

export async function generateStaticParams() {
  return tipsData.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const tip = getTipBySlug(params.slug);
  return { title: tip ? tip.title : "Travel Tip" };
}

export default function TipDetailPage({ params }: Params) {
  const tip = getTipBySlug(params.slug);
  if (!tip) return notFound();
  const related = tipsData.filter((t) => t.slug !== params.slug).slice(0, 3);
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{tip.title}</h1>
          <div className="relative h-72 sm:h-80 md:h-96 lg:h-[28rem] rounded-lg overflow-hidden border mb-6">
            <Image src={tip.image} alt={tip.title} fill className="object-cover" />
          </div>
          <div className="prose prose-neutral max-w-none">
            <p>{tip.content}</p>
          </div>
        </div>
        {related.length > 0 && (
          <section className="mt-12">
            <div className="mx-auto max-w-6xl px-4">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Related tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} href={`/tips/${r.slug}`} className="block">
                    <Card className="overflow-hidden h-full">
                      <div className="relative h-40">
                        <Image src={r.image} alt={r.title} fill className="object-cover" />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <TagIcon className="h-4 w-4" aria-hidden />
                          {r.tags.map((t) => (
                            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs">#{t}</span>
                          ))}
                        </div>
                        <CardTitle className="text-lg leading-tight mt-2">{r.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-muted-foreground pt-0">
                        <p className="leading-relaxed line-clamp-3">{r.excerpt}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pb-4">
                          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" aria-hidden />{r.date}</span>
                          <span className="inline-flex items-center gap-1"><MessageSquare className="h-4 w-4" aria-hidden />{r.comments}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}


