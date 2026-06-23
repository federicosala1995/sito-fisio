import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { getPostBySlug, posts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Clock, CalendarCheck, MessageCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      locale: "it_IT",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24">
        {/* Header */}
        <section className="bg-navy py-16 mb-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-inter text-sm text-white/40 hover:text-teal transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              Tutti gli articoli
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-inter text-xs font-semibold text-teal bg-teal/15 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="font-inter text-xs text-white/40 flex items-center gap-1">
                <Clock size={11} />
                {post.readingTime} min di lettura
              </span>
            </div>
            <h1 className="font-fraunces text-3xl md:text-4xl font-semibold text-white leading-tight mb-4">
              {post.title}
            </h1>
            <time className="font-inter text-sm text-white/40">
              {formatDate(post.date)}
            </time>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-3xl">
          <article
            className="prose prose-lg prose-navy max-w-none
              prose-headings:font-fraunces prose-headings:font-semibold prose-headings:text-navy
              prose-h2:text-2xl prose-h3:text-xl
              prose-p:font-inter prose-p:text-navy/70 prose-p:leading-relaxed
              prose-li:font-inter prose-li:text-navy/70
              prose-a:text-teal prose-a:no-underline hover:prose-a:underline
              prose-strong:text-navy"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author note */}
          <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
              <span className="font-fraunces text-navy font-semibold">F</span>
            </div>
            <div>
              <p className="font-fraunces text-base font-semibold text-navy">Federico — Fisioterapista</p>
              <p className="font-inter text-sm text-navy/55 mt-1">
                Fisioterapista libero professionista a Castrezzato (BS). Iscritto all&apos;Albo TSRM-PSTRP.
                Specializzato in riabilitazione ortopedica e recupero sportivo.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-navy p-8 text-center space-y-4">
            <h3 className="font-fraunces text-2xl font-semibold text-white">
              Hai bisogno di una valutazione?
            </h3>
            <p className="font-inter text-white/55 text-sm">
              Prenota la tua seduta a Castrezzato (BS) — online, in pochi clic.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/prenota"
                className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 font-inter text-sm font-semibold text-white hover:bg-teal-600 transition-all"
              >
                <CalendarCheck size={15} />
                Prenota online
              </Link>
              <a
                href="https://wa.me/393454431758"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-inter text-sm font-semibold text-white/80 hover:border-white/40 transition-all"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
