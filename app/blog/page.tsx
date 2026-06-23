import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { posts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articoli di fisioterapia, riabilitazione e recupero sportivo. Consigli pratici di un fisioterapista a Castrezzato (BS), zona Franciacorta.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24">
        <section className="bg-navy py-20 mb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-3">
              Articoli
            </p>
            <h1 className="font-fraunces text-4xl md:text-5xl font-semibold text-white mb-4">
              Blog
            </h1>
            <p className="font-inter text-white/50 max-w-md mx-auto">
              Fisioterapia, recupero e prevenzione — scritto da un professionista.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-3xl border border-gray-100 bg-white overflow-hidden hover:border-teal/30 hover:shadow-xl transition-all duration-300"
              >
                {/* Category bar */}
                <div className="h-1.5 bg-gradient-to-r from-teal to-navy" />

                <div className="flex flex-col flex-1 p-7 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-xs font-semibold text-teal bg-teal/8 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="font-inter text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={11} />
                      {post.readingTime} min
                    </span>
                  </div>

                  <div className="flex-1">
                    <h2 className="font-fraunces text-xl font-semibold text-navy leading-snug mb-3 group-hover:text-teal transition-colors">
                      {post.title}
                    </h2>
                    <p className="font-inter text-sm text-navy/55 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <time className="font-inter text-xs text-gray-400">
                      {formatDate(post.date)}
                    </time>
                    <span className="font-inter text-xs text-teal font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Leggi <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
