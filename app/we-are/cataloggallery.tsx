

// // his is the forntend of my catalog section
// // THIS IS TOO TOO HOSHPOCH TOO MANY STUFF ON FRONT PAGE AND ITS TOTALY LOOKS LIKE ITS MADE BY AI
// // What i want you to do is rewrite the code make the front end LUXURIOUS i dont waant generic ai site
// // this catalog will be send to international buyer with multi millions dollars busniess i dont want them to instantly close the site just after seeing how bad the fist page  is
// // do a extensive research first go to pintrest google wherever take inspiration then write the code 

"use client";

/**
 * Design system for this page (so future edits stay consistent):
 *
 * Ground   #14110D  "Loom Ink"      — page background, warmer than flat black
 * Surface  #1C1811  "Raw Backing"   — image/card wells
 * Ink      #EAE3D2  "Undyed Wool"   — primary text
 * Muted    #93897A  "Grey Warp"     — secondary text, hairlines
 * Accent   #B98A3E  "Turmeric"      — the one interactive colour (buttons, links, focus)
 * Thread   #A6432B "Madder" / #2E3F52 "Indigo" / #5B4530 "Walnut"
 *          — used only in the four-strand "selvage" rule (top progress rail
 *          and plate dividers). This is the page's signature device: a
 *          bundle of dyed yarn standing in for a scroll-progress indicator,
 *          echoed at small scale as a rule between plates. It never appears
 *          anywhere else, so it stays a device rather than decoration.
 *
 * Type: Fraunces (display, used quietly — no italics, weight does the work)
 *       IBM Plex Mono (spec labels, plate numbers — this is a trade
 *       catalogue, and mills print specs in monospace/typewriter faces)
 *       Inter (body copy only, light weight, never uppercase-tracked)
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

const pad = (n: number) => String(n).padStart(2, "0");

export type CatalogPageImage = {
  src: string;
  width: number;
  height: number;
  zoomSrc: string;
  zoomWidth: number;
  zoomHeight: number;
  blurDataURL: string;
};
const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B98A3E]";

export default function CatalogGallery({
  pages,
  pdfUrl,
}: {
  pages: CatalogPageImage[];
  pdfUrl: string;
}) {
  const [activePage, setActivePage] = useState(1);
  const [viewMode, setViewMode] = useState<"editorial" | "grid">("editorial");
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [isPastHero, setIsPastHero] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroEndRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });
  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  // Track active page during scroll (editorial view only)
  useEffect(() => {
    if (viewMode !== "editorial") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-page"));
            if (idx) setActivePage(idx);
          }
        });
      },
      { threshold: 0.4 }
    );

    pageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [pages.length, viewMode]);

  // Header gains its wayfinding once the reader has moved past the hero —
  // one clear action up front, more controls once there's something to
  // navigate between.
  useEffect(() => {
    const el = heroEndRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lightbox keyboard controls & body lock
  useEffect(() => {
    if (zoomIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomIndex(null);
      if (e.key === "ArrowRight")
        setZoomIndex((i) => (i === null ? i : Math.min(i + 1, pages.length - 1)));
      if (e.key === "ArrowLeft")
        setZoomIndex((i) => (i === null ? i : Math.max(i - 1, 0)));
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomIndex, pages.length]);

  const cover = pages[0];
  const currentZoomPage = zoomIndex !== null ? pages[zoomIndex] : null;

  const scrollToPage = (pageNumber: number) => {
    setViewMode("editorial");
    setTimeout(() => {
      const el = pageRefs.current[pageNumber - 1];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <main
      className={`${display.variable} ${mono.variable} ${body.variable} min-h-screen bg-[#14110D] font-[family-name:var(--font-body)] text-[#EAE3D2] antialiased selection:bg-[#B98A3E] selection:text-[#14110D]`}
    >
      {/* Header — minimal by default, gains wayfinding after the hero */}
      <header className="fixed inset-x-0 top-0 z-40 bg-[#14110D]/85 backdrop-blur-md">
        {/* Signature: a four-strand thread rule, standing in for reading progress */}
        <div className="flex h-[8px] flex-col gap-[1px] overflow-hidden">
          {["#A6432B", "#2E3F52", "#B98A3E", "#5B4530"].map((c) => (
            <motion.div
              key={c}
              style={{ scaleX: progress }}
              className="h-[1px] w-full origin-left"
            />
          ))}
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-4 pt-3 md:px-12">
  <div className="flex items-baseline gap-3">
    <Link
      href="/"
      className="font-[family-name:var(--font-display)] text-lg text-[#EAE3D2]"
    >
      Indian Tufted Carpets
    </Link>
  </div>

          <div className="flex items-center gap-6">
            {isPastHero && (
              <div className="hidden items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.05em] text-[#93897A] lg:flex">
                <button
                  type="button"
                  onClick={() => setViewMode("editorial")}
                  className={`${focusRing} transition ${
                    viewMode === "editorial" ? "text-[#EAE3D2]" : "hover:text-[#EAE3D2]"
                  }`}
                >
                  Lookbook
                </button>
                <span aria-hidden className="text-[#4a4436]">/</span>
              </div>
            )}

            {isPastHero && viewMode === "editorial" && (
              <span className="hidden font-[family-name:var(--font-mono)] text-[11px] text-[#93897A] lg:block">
                {pad(activePage)} — {pad(pages.length)}
              </span>
            )}

            <Button
              onClick={handleContactClick}
              className={`${focusRing} text-[12px] transition ${
                isPastHero
                  ? "bg-[#B98A3E] px-4 py-2 text-[#14110D] hover:bg-[#c89a4e]"
                  : "text-[#EAE3D2] underline decoration-[#93897A] underline-offset-4 hover:decoration-[#EAE3D2]"
              }`}
            >
              Enquire
            </Button>
          </div>
        </div>
      </header>

      {/* HERO — one thesis: what this is, one plate to look at, one action */}
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-24 md:px-12 lg:pt-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[#B98A3E]">
              Hand-Made · Bhadohi, India
            </p>

            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[0.95] text-[#EAE3D2] sm:text-6xl lg:text-7xl">
              <span className="block font-light">Rugs made</span>
              <span className="block font-semibold">to specification</span>
            </h1>

            <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-[#93897A]">
              A working catalogue for architects, hospitality groups, and importers.
              Every plate here is built for commercial and residential specification,
              tufted by hand in Bhadohi.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            </div>
          </div>

          {cover && (
            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={() => setZoomIndex(0)}
                className={`${focusRing} group block w-full max-w-sm text-left`}
              >
                <div className="relative overflow-hidden bg-[#1C1811]">
                  <Image
                    src={cover.src}
                    alt="Catalogue cover"
                    width={cover.width}
                    height={cover.height}
                    priority
                    placeholder="blur"
                    blurDataURL={cover.blurDataURL}
                    sizes="(min-width: 1024px) 380px, 80vw"
                    className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.015]"
                  />
                </div>
                <span className="mt-3 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[#93897A] transition group-hover:text-[#EAE3D2]">
                  View cover plate ↗
                </span>
              </button>
            </div>
          )}
        </div>
      </section>
      <div ref={heroEndRef} className="h-px" />

      {/* EDITORIAL LOOKBOOK VIEW */}
      {viewMode === "editorial" && (
        <section className="mx-auto max-w-5xl px-6 py-12 md:px-12">
          <div className="space-y-28 md:space-y-40">
            {pages.map((page, i) => {
              const pageNum = i + 1;
              return (
                <div
                  key={page.src}
                  data-page={pageNum}
                  ref={(el) => {
                    pageRefs.current[i] = el;
                  }}
                  className="group"
                >
                  {/* Small selvage rule — same four threads as the top rail,
                      here used as a static divider rather than a progress cue */}
                  <div className="mb-4 flex h-[3px] gap-[2px]" aria-hidden>
                    <span className="h-full w-full bg-[#A6432B]/70" />
                    <span className="h-full w-full bg-[#2E3F52]/70" />
                    <span className="h-full w-full bg-[#B98A3E]/70" />
                    <span className="h-full w-full bg-[#5B4530]/70" />
                  </div>

                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#93897A]">
                      No. {pad(pageNum)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomIndex(i)}
                      className={`${focusRing} font-[family-name:var(--font-mono)] text-[11px] text-[#93897A] underline decoration-transparent underline-offset-4 transition hover:text-[#EAE3D2] hover:decoration-[#EAE3D2]`}
                    >
                      Enlarge ↗
                    </button>
                  </div>

                  <div
                    onClick={() => setZoomIndex(i)}
                    className="relative cursor-zoom-in overflow-hidden bg-[#1C1811]"
                  >
                    <Image
                      src={page.src}
                      alt={`Catalogue plate ${pageNum}`}
                      width={page.width}
                      height={page.height}
                      placeholder="blur"
                      blurDataURL={page.blurDataURL}
                      loading={i < 2 ? "eager" : "lazy"}
                      sizes="(min-width: 1024px) 900px, 100vw"
                      className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.008]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TRADE ENQUIRY FOOTER */}
      <footer id="contact" className="border-t border-[#EAE3D2]/10 bg-[#0F0C08] px-6 py-28 text-center md:px-12">
        <div className="mx-auto max-w-xl">
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[#B98A3E]">
            Trade &amp; export enquiries
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-light text-[#EAE3D2] sm:text-4xl">
            Request samples
          </h2>
          <p className="mt-5 text-sm font-light leading-relaxed text-[#93897A]">
            Custom colourways, sizing, and construction are available on request.
            Reach out directly and a member of the export team will follow up
            with pricing and lead times.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              download
              className={`${focusRing} text-[13px] text-[#93897A] underline decoration-[#4a4436] underline-offset-4 transition hover:text-[#EAE3D2] hover:decoration-[#EAE3D2]`}
            >
              Download the PDF catalogue
            </a>
          </div>
        </div>
      </footer>

      {/* FULL-SCREEN LIGHTBOX */}
      {currentZoomPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0806]/95 backdrop-blur-md"
          onClick={() => setZoomIndex(null)}
        >
          <div
            className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-8 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#93897A]">
              {pad((zoomIndex ?? 0) + 1)} — {pad(pages.length)}
            </span>
            <button
              type="button"
              onClick={() => setZoomIndex(null)}
              className={`${focusRing} font-[family-name:var(--font-mono)] text-[11px] text-[#EAE3D2] underline decoration-[#93897A] underline-offset-4 hover:decoration-[#EAE3D2]`}
            >
              Close [Esc]
            </button>
          </div>

          {zoomIndex! > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex((i) => (i === null ? i : i - 1));
              }}
              aria-label="Previous plate"
              className={`${focusRing} absolute left-6 top-1/2 z-10 -translate-y-1/2 p-4 text-[#93897A] transition hover:text-[#EAE3D2]`}
            >
              ←
            </button>
          )}

          {zoomIndex! < pages.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex((i) => (i === null ? i : i + 1));
              }}
              aria-label="Next plate"
              className={`${focusRing} absolute right-6 top-1/2 z-10 -translate-y-1/2 p-4 text-[#93897A] transition hover:text-[#EAE3D2]`}
            >
              →
            </button>
          )}

          <div
            className="relative max-h-[88vh] max-w-[90vw] overflow-auto p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentZoomPage.zoomSrc}
              alt={`High resolution plate ${(zoomIndex ?? 0) + 1}`}
              width={currentZoomPage.zoomWidth}
              height={currentZoomPage.zoomHeight}
              priority
              className="h-auto max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}