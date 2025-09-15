import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ShieldCheck, Truck, FlaskConical } from "lucide-react";

const Home = () => {
  const { language } = useLanguage();

  const t = {
    title:
      language === "en"
        ? "Lux Lather - Body Oils & Liquid Soap"
        : "Lux Lather - 高品質なボディオイル＆液体石けん",
    h1: language === "en" ? "Elevate your everyday ritual" : "毎日のケアを、特別に",
    intro:
      language === "en"
        ? "Premium body oils and liquid soaps crafted with quality botanicals to nourish, hydrate, and revive your skin."
        : "厳選した植物由来成分を配合したプレミアムなボディオイル＆液体石けんで、肌をうるおし整えます。",
    jpTag:
      language === "en"
        ? "Make every day luxurious with oils and liquid soaps."
        : "ボディオイルと液体石けんで、毎日をラグジュアリーに。",
    learn: language === "en" ? "Learn About Us" : "私たちについて",
    shopBy: language === "en" ? "Shop by Category" : "カテゴリーから探す",
    oils: language === "en" ? "Body Oil Collection" : "ボディオイル コレクション",
    soaps: language === "en" ? "Liquid Soap Collection" : "液体石けん コレクション",
    usp1: language === "en" ? "Secure Checkout" : "安全な決済",
    usp2: language === "en" ? "Fast Shipping" : "迅速な配送",
    usp3: language === "en" ? "Quality Ingredients" : "高品質原料",
    meta:
      language === "en"
        ? "Premium natural body oils and liquid soaps by Lux Lather. Nourish, hydrate, and revive your skin with quality ingredients."
        : "Lux Lather のプレミアムなボディオイル＆液体石けん。高品質な原料で、肌をうるおし整えます。",
    ctaOil: language === "en" ? "Shop Oils" : "オイルを見る",
    ctaSoap: language === "en" ? "Shop Soaps" : "石けんを見る",
  };

  // SEO + preload + JSON-LD
  useEffect(() => {
    document.title = t.title;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.content = t.meta;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = "/oilcover.png";
    document.head.appendChild(link);

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Lux Lather",
      url: "https://luxlather.store",
      logo: "https://luxlather.store/luxlatherlogo.png",
      sameAs: ["https://www.instagram.com/", "https://www.facebook.com/"],
    });
    document.head.appendChild(ld);

    return () => {
      link.remove();
      ld.remove();
    };
  }, [t.title, t.meta]);

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50">
      {/* HERO — full-bleed cover with overlay */}
      <div className="relative isolate">
        <div className="relative h-[56vh] md:h-[68vh] lg:h-[72vh] overflow-hidden">
        <img
  src="/oilcover.png"
  alt="Natural beauty oils and soaps by Lux Lather"
  className="absolute inset-0 h-full w-full object-cover"
  width={1920}
  height={1080}
  loading="eager"
  fetchPriority="high"  
  decoding="async"
  style={{ objectPosition: "center 35%" }}
  sizes="100vw"
/>

          {/* soft left-to-right gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent" />
          {/* content */}
          <motion.div
            className="relative z-10 mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8 max-w-7xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <div className="max-w-xl">
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
                {t.jpTag}
              </span>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
                {t.h1}
              </h1>
              <p className="mt-3 text-base md:text-lg leading-relaxed text-neutral-700">
                {t.intro}
              </p>
              <div className="mt-6 items-center">
               
                <Link
                  to="/about"
                  className="hidden sm:inline-flex items-center text-sm font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-4"
                >
                  {t.learn}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* USPs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <li className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-neutral-800">{t.usp1}</span>
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <Truck className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-neutral-800">{t.usp2}</span>
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <FlaskConical className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-neutral-800">{t.usp3}</span>
          </li>
        </ul>
      </div>

      {/* SHOP BY CATEGORY */}
      <div className="bg-white/60 border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
          >
            {t.shopBy}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Oils */}
            <motion.div
              className="group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Link to="/oil" aria-label={t.oils}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <img
                      src="/oilcategory.png"
                      alt="Lux Lather body oil bottles"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={900}
                      height={675}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-semibold text-neutral-800 group-hover:text-primary transition">
                      {t.oils}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Soaps */}
            <motion.div
              className="group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Link to="/soap" aria-label={t.soaps}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <img
                      src="/soapcover.png"
                      alt="Lux Lather liquid soap bottles"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={900}
                      height={675}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-semibold text-neutral-800 group-hover:text-primary transition">
                      {t.soaps}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
