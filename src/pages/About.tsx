import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { language, toggleLanguage } = useLanguage();

  const t = {
    title:
      language === "en"
        ? "About Lux Lather – Natural Body Oils & Liquid Soap"
        : "Lux Latherについて – 高品質ボディオイル＆液体石けん",
    meta:
      language === "en"
        ? "Learn about Lux Lather’s mission and craft. We hand-blend premium body oils and liquid soaps using quality ingredients for everyday wellness."
        : "Lux Latherの想いとこだわり。厳選された原料で丁寧に作られたボディオイルと液体石けんで、毎日を心地よく。",
    h1: language === "en" ? "About Lux Lather" : "Lux Latherについて",
    p1:
      language === "en"
        ? "Lux Lather is a celebration of natural self-care. We craft luxurious body oils and liquid soaps in small batches to preserve purity and performance."
        : "Lux Latherは、自然なセルフケアを大切にするブランド。ボディオイルと液体石けんを少量生産で丁寧に仕上げ、素材本来の良さを引き出します。",
    p2:
      language === "en"
        ? "Our mission is to bring indulgence to your everyday ritual—products that hydrate, calm, and elevate. Every bottle reflects care, quality, and intention."
        : "私たちの使命は、日々の習慣に上質さを添えること。肌をうるおし、整え、心地よい時間へ導くプロダクトをお届けします。",
    p3:
      language === "en"
        ? "Clean. Conscious. Crafted for you."
        : "清潔に。意識的に。あなたのために、丁寧に。",
    valuesTitle: language === "en" ? "Our Values" : "私たちの価値観",
    v1:
      language === "en"
        ? "Quality Ingredients"
        : "高品質な原料",
    v2:
      language === "en"
        ? "Small-Batch Craft"
        : "少量生産のクラフト",
    v3:
      language === "en"
        ? "Secure, Fast Checkout"
        : "安全でスムーズな決済",
    ctaShop: language === "en" ? "Shop Our Collection" : "商品を見る",
    ctaContact: language === "en" ? "Contact Us" : "お問い合わせ",
    toggleLabel: language === "en" ? "日本語へ" : "English",
  };

  // SEO: set title + meta and structured data
  useEffect(() => {
    document.title = t.title;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.content = t.meta;

    // JSON-LD AboutPage + Organization
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: t.title,
      description: t.meta,
      mainEntity: {
        "@type": "Organization",
        name: "Lux Lather",
        url: "https://luxlather.store",
        logo: "https://luxlather.store/luxlatherlogo.png",
      },
    });
    document.head.appendChild(ld);
    return () => ld.remove();
  }, [t.title, t.meta]);

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Language Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleLanguage}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition"
          >
            {t.toggleLabel}
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
          {t.h1}
        </h1>

        <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
          {t.p1}
        </p>
        <p className="mt-6 text-gray-700">
          {t.p2}
        </p>
        <p className="mt-6 italic text-gray-600">{t.p3}</p>

        {/* Values */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.valuesTitle}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <li className="bg-white border rounded-lg p-4 shadow-sm">{t.v1}</li>
            <li className="bg-white border rounded-lg p-4 shadow-sm">{t.v2}</li>
            <li className="bg-white border rounded-lg p-4 shadow-sm">{t.v3}</li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/oil"
            className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
            aria-label={t.ctaShop}
          >
            {t.ctaShop}
          </Link>
          <Link
            to="/contact"
            className="border border-primary text-primary px-5 py-2 rounded hover:bg-primary hover:text-white"
            aria-label={t.ctaContact}
          >
            {t.ctaContact}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
