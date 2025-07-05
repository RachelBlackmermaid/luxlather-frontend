import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Language Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleLanguage}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition"
          >
            {language === "en" ? "日本語へ" : "English"}
          </button>
        </div>

        {language === "en" ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              About Lux Lather
            </h1>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
              Lux Lather is a celebration of natural self-care. We craft luxurious{" "}
              <strong>body oils</strong> and <strong>liquid soaps</strong> using nature’s finest ingredients — blended in small batches to preserve their purity and power.
            </p>
            <p className="mt-6 text-gray-700">
              Our mission is to bring indulgence into your everyday, with handcrafted products that hydrate, heal, and elevate your skincare ritual. Every drop and every bar is a promise of quality, beauty, and wellness — made with care and intention.
            </p>
            <p className="mt-6 italic text-gray-600">
              Clean. Conscious. Crafted for you.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Lux Latherについて
            </h1>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
              Lux Latherは、自然なセルフケアを大切にしたボディオイルと液体石けんのブランドです。最高品質の天然素材を使用し、少量ずつ丁寧に製造しています。
            </p>
            <p className="mt-6 text-gray-700">
              毎日の生活に贅沢なひとときを。私たちのプロダクトは、肌を潤し、癒し、スキンケアをより豊かな時間に変えてくれます。一滴一滴、ひとつひとつに、心を込めて。
            </p>
            <p className="mt-6 italic text-gray-600">
              清潔に。意識的に。あなたのために、丁寧に。
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default About;
