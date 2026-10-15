import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Leaf,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { categories } from "@/data/products";
import { useStorefrontProducts } from "@/hooks/use-storefront-products";
import { LandmarkCard } from "@/components/LandmarkCards";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import hero1 from "@/assets/hero/hero-1.webp";
import hero2 from "@/assets/hero/hero-2.webp";
import hero3 from "@/assets/hero/hero-3.webp";
import hero4 from "@/assets/hero/hero-4.webp";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Indian Handicraft Standards | Contemporary Lucknowi Chikankari" },
      {
        name: "description",
        content:
          "Discover Lucknowi Chikankari kurtis, kurta sets, palazzo sets and handcrafted occasion wear from Indian Handicraft Standards. A heritage craft, made to be worn today.",
      },
      { property: "og:url", content: "https://indianhandicraftstandards.com/" },
      {
        property: "og:title",
        content: "Indian Handicraft Standards | The Art of Chikankari",
      },
      {
        property: "og:description",
        content:
          "Authentic Lucknowi Chikankari, thoughtfully chosen for everyday elegance and special moments.",
      },
    ],
    links: [
      { rel: "preload", as: "image", href: hero1, fetchPriority: "high" } as never,
      { rel: "prefetch", as: "image", href: hero2 } as never,
      { rel: "prefetch", as: "image", href: hero3 } as never,
      { rel: "prefetch", as: "image", href: hero4 } as never,
      { rel: "canonical", href: "https://indianhandicraftstandards.com/" },
    ],
  }),
});

const EDITS = [
  {
    title: "Everyday Kurtis",
    slug: "kurtis",
    eyebrow: "The everyday edit",
    image: hero3,
  },
  {
    title: "Kurta & Palazzo Sets",
    slug: "kurta-sets",
    eyebrow: "Made to move",
    image: hero2,
  },
  {
    title: "Sarees & Occasionwear",
    slug: "sarees",
    eyebrow: "For your moments",
    image: hero4,
  },
];

const CRAFT_NOTES = [
  {
    icon: Scissors,
    title: "A living Lucknow craft",
    text: "Inspired by the delicate stitches and graceful motifs that make Chikankari unmistakable.",
  },
  {
    icon: Leaf,
    title: "Comfort comes first",
    text: "Pieces selected for wearable silhouettes, easy styling and all-day comfort.",
  },
  {
    icon: Heart,
    title: "Chosen with care",
    text: "From fabric and finish to the final details, every piece should feel special to wear.",
  },
];

function Index() {
  const products = useStorefrontProducts();
  const featured = products.slice(0, 8);
  const [news, setNews] = useState({
    email: "",
    sending: false,
    sent: false,
  });

  const getCategoryImage = (slug: string, fallback: string) =>
    products.find((product) => product.category === slug && product.images?.[0])
      ?.images[0] ?? fallback;

  const categoryCards = [
    { label: "Kurtis", slug: "kurtis", fallback: hero3 },
    { label: "Kurta Sets", slug: "kurta-sets", fallback: hero2 },
    { label: "Palazzo Sets", slug: "palazzo-sets", fallback: hero1 },
    { label: "Sarees", slug: "sarees", fallback: hero4 },
    { label: "Suit Pieces", slug: "unstitched-suits", fallback: hero1 },
    { label: "Pants & Bottoms", slug: "pants", fallback: hero3 },
  ].map((category) => ({
    ...category,
    image: getCategoryImage(category.slug, category.fallback),
  }));

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = news.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setNews((current) => ({ ...current, sending: true }));
    try {
      const { error } = await supabase.from("leads").insert({
        name: email.split("@")[0].slice(0, 60),
        phone: email,
        whatsapp: null,
        interest: "Newsletter signup",
        page_url:
          typeof window !== "undefined"
            ? window.location.href.slice(0, 500)
            : null,
        source: "newsletter",
        status: "new",
        notes: `Email: ${email}`,
        conversation: [],
      });
      if (error) throw error;
      setNews({ email: "", sending: false, sent: true });
      toast.success("Thank you — you are on the list.");
    } catch (error) {
      console.error(error);
      toast.error("Sign-up could not be saved just now. Please try again later.");
      setNews((current) => ({ ...current, sending: false }));
    }
  }

  return (
    <div className="ihs-home">
      {/* Editorial hero */}
      <section className="relative overflow-hidden bg-[#f6eee8]">
        <div className="mx-auto grid min-h-[620px] max-w-[1440px] items-center gap-9 px-5 py-9 sm:px-8 md:grid-cols-[0.86fr_1.14fr] md:px-12 md:py-14 lg:min-h-[710px] lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-10 order-2 pb-5 pt-1 md:order-1 md:pb-0"
          >
            <div className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8b4456] sm:text-xs">
              <span className="h-px w-9 bg-[#b27a63]" />
              Indian Handicraft Standards
            </div>
            <h1 className="max-w-2xl text-[3.2rem] font-medium leading-[0.98] tracking-[-0.055em] text-[#321f28] sm:text-6xl lg:text-[5.35rem]">
              The art of
              <br />
              Lucknow,
              <br />
              <span className="font-display italic font-normal text-[#984d60]">
                made yours.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#66535a] sm:text-base">
              A modern wardrobe shaped by the timeless beauty of Chikankari.
              Discover thoughtful everyday pieces and occasionwear rooted in
              the craft of Lucknow.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#63283c] px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#421a2a] sm:px-7"
              >
                Explore the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex min-h-12 items-center gap-2 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#63283c] transition hover:text-[#9c5263]"
              >
                Our story <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[#d9c6c0] pt-5 text-xs text-[#705d63]">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#9c5263]" />
                Championing Chikankari since 2015
              </span>
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#9c5263]" />
                Shipping across India
              </span>
            </div>
          </motion.div>

          <div className="relative order-1 mx-auto h-[360px] w-full max-w-[650px] md:order-2 md:h-[590px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="absolute inset-y-0 right-0 w-[78%] overflow-hidden rounded-t-[48%] rounded-b-[2px] bg-[#e7d8d0]"
            >
              <img
                src={hero1}
                alt="Timeless ivory Lucknowi Chikankari collection"
                fetchPriority="high"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#321f28]/25 via-transparent to-transparent" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -16, y: 12 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute bottom-6 left-0 h-[42%] w-[37%] overflow-hidden border-[7px] border-[#f6eee8] shadow-xl sm:bottom-9 sm:h-[40%]"
            >
              <img
                src={hero2}
                alt="Handcrafted Chikankari festive edit"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="absolute right-0 top-5 flex items-center gap-3 rounded-full border border-[#e0cec7] bg-[#fffaf7]/90 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#63283c] backdrop-blur-sm sm:right-2">
              <span className="h-2 w-2 rounded-full bg-[#a76953]" />
              Handcrafted heritage
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full border border-[#d9bcb6]/50" />
      </section>

      {/* Slim service and trust strip */}
      <section className="border-y border-[#eadfda] bg-[#fffdfb]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[#eadfda] px-4 sm:grid-cols-4 sm:divide-y-0">
          {[
            { icon: ShieldCheck, title: "Made with care", detail: "Thoughtful finishing" },
            { icon: Truck, title: "Delivery across India", detail: "Clear order updates" },
            { icon: RotateCcw, title: "Helpful support", detail: "Here when you need us" },
            { icon: Heart, title: "A heritage craft", detail: "Lucknowi Chikankari" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex min-h-[88px] items-center gap-3 px-3 py-4 sm:justify-center sm:px-5">
                <Icon className="h-5 w-5 shrink-0 text-[#9c5263]" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-semibold text-[#39252d]">{item.title}</p>
                  <p className="mt-1 text-[10px] text-[#87757a]">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category-led discovery */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9c5263]">
              Find your next favourite
            </p>
            <h2 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-[#321f28] sm:text-4xl">
              Shop by collection
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#63283c] hover:text-[#9c5263]"
          >
            View everything <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {categoryCards.map((category, index) => (
            <Link
              key={category.slug}
              to="/category/$slug"
              params={{ slug: category.slug }}
              className={`group relative block overflow-hidden bg-[#eaded8] ${index === 0 ? "row-span-2 min-h-[390px] sm:min-h-[480px]" : "min-h-[188px] sm:min-h-[230px]"}`}
            >
              <img
                src={category.image}
                alt={category.label}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24141a]/75 via-[#24141a]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-[10px]">
                    {index === 0 ? "The everyday edit" : index === 1 ? "Effortless dressing" : "Made for your moments"}
                  </p>
                  <h3 className="mt-1 text-lg font-medium text-white sm:text-2xl">
                    {category.label}
                  </h3>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/65 text-white transition group-hover:bg-white group-hover:text-[#63283c]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product feed: only published catalogue products */}
      <section className="bg-[#f8f2ee] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9c5263]">
                Picked for you
              </p>
              <h2 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-[#321f28] sm:text-4xl">
                Pieces to fall for
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#78656c]">
                Discover current styles and find the details that feel like you.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#63283c] hover:text-[#9c5263]"
            >
              Shop all pieces <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {featured.map((product) => (
                <LandmarkCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  title={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.images[0]}
                  shape={product.cardShape}
                  isDemo={product.isDemo}
                  stock={product.stock}
                  badge={
                    product.isBestseller
                      ? "Bestseller"
                      : product.isNew
                        ? "New"
                        : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d9c4c0] bg-white/70 px-6 py-12 text-center">
              <Sparkles className="mx-auto h-7 w-7 text-[#9c5263]" />
              <h3 className="mt-4 text-lg font-medium text-[#321f28]">
                The next collection is being prepared
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#78656c]">
                New arrivals will appear here as soon as they are published in the IHS catalogue.
              </p>
              <Link
                to="/shop"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#63283c] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#421a2a]"
              >
                Visit the collection <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Brand story */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-16 lg:px-12">
        <div className="relative min-h-[390px] overflow-hidden bg-[#e7d8d0] sm:min-h-[520px]">
          <img
            src={hero4}
            alt="The artistry and elegance of Chikankari"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24141a]/45 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white sm:bottom-8 sm:left-8 sm:right-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/80">Our roots</p>
              <p className="mt-1 text-2xl font-medium sm:text-3xl">Lucknow, since 2015</p>
            </div>
            <Star className="mb-1 h-6 w-6 fill-white/80 text-white/80" />
          </div>
        </div>
        <div className="py-2 lg:py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9c5263]">
            More than a detail
          </p>
          <h2 className="mt-3 max-w-xl text-4xl font-medium leading-[1.05] tracking-[-0.05em] text-[#321f28] sm:text-5xl">
            A centuries-old craft.
            <br />
            <span className="font-display italic font-normal text-[#984d60]">
              A way of being you.
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#78656c] sm:text-base">
            Indian Handicraft Standards celebrates the fine hand embroidery of
            Lucknow through pieces made for real wardrobes and real occasions.
            We bring the character of Chikankari into silhouettes you can make
            your own.
          </p>
          <div className="mt-8 space-y-5">
            {CRAFT_NOTES.map((note) => {
              const Icon = note.icon;
              return (
                <div key={note.title} className="flex gap-4 border-t border-[#eadfda] pt-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5e8e5] text-[#8e4357]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#39252d]">{note.title}</h3>
                    <p className="mt-1 max-w-lg text-sm leading-6 text-[#78656c]">{note.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#63283c] px-6 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#63283c] transition hover:bg-[#63283c] hover:text-white"
          >
            Discover our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Style assistance / WhatsApp */}
      <section className="bg-[#63283c] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between md:py-12 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e4bdba]">
              Need a little help?
            </p>
            <h2 className="mt-2 text-2xl font-medium sm:text-3xl">
              Your style, your size, your way.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Ask us about fit, measurements, fabric or placing an order. We’re happy to help.
            </p>
          </div>
          <a
            href="https://wa.me/919044466957?text=Hello%20IHS%2C%20I%20need%20help%20with%20a%20product."
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#fff9f6] px-6 text-xs font-semibold uppercase tracking-[0.13em] text-[#63283c] transition hover:bg-white"
          >
            Chat with us on WhatsApp <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#fffdfb] px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9c5263]">
            A note from the atelier
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#321f28] sm:text-4xl">
            New arrivals, delivered thoughtfully.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#78656c]">
            Join the IHS list for collection news, styling ideas and occasional offers.
          </p>
          <form
            onSubmit={subscribe}
            className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="ihs-newsletter-email">Email address</label>
            <input
              id="ihs-newsletter-email"
              type="email"
              value={news.email}
              onChange={(event) =>
                setNews((current) => ({ ...current, email: event.target.value, sent: false }))
              }
              placeholder="Your email address"
              required
              className="min-h-12 min-w-0 flex-1 rounded-full border border-[#e4d5cf] bg-white px-5 text-sm text-[#39252d] outline-none placeholder:text-[#aa999d] focus:border-[#9c5263]"
            />
            <button
              type="submit"
              disabled={news.sending}
              className="min-h-12 rounded-full bg-[#63283c] px-6 text-xs font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-[#421a2a] disabled:opacity-60"
            >
              {news.sending ? "Joining…" : news.sent ? "You're on the list" : "Join the list"}
            </button>
          </form>
          <p className="mt-3 text-[10px] text-[#97868b]">
            Thoughtful updates only. You can unsubscribe whenever you like.
          </p>
        </div>
      </section>
    </div>
  );
}
