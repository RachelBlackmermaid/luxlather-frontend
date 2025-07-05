import { useEffect } from "react";
import { motion } from "framer-motion";

const Home = () => {
  useEffect(() => {
    document.title = "Lux Lather - Body Oils & Liquid Soap";
  }, []);

  return (
    <section className="flex flex-col justify-center text-center bg-gray-50">
      {/* Banner Image */}
      <img
        src="/oilcover.png"
        alt="Lux Lather banner showing natural oils and soaps"
        className="w-full object-cover max-h-[680px]"
      />

      {/* Brand Intro */}
      <motion.div
        className="px-6 py-10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-primary text-4xl md:text-5xl font-bold mb-4">
          Welcome to Lux Lather
        </h1>
        <p className="text-black text-lg md:text-xl leading-relaxed">
          Discover the beauty of natural care with <span className="font-semibold">Lux Lather</span>, where we craft premium <strong>body oils</strong> and <strong>liquid soaps</strong> designed to elevate your daily routine. Every bottle is a blend of nature’s best — created to nourish, hydrate, and revive your skin with elegance and care.
        </p>
        <p className="text-gray-700 text-md md:text-lg mt-4 italic">
          ボディオイルと液体石けんで、毎日をラグジュアリーに。
        </p>

        <a
          href="/about"
          className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-2xl shadow hover:bg-primary/90 transition duration-300 text-lg font-medium"
        >
          Learn About Us
        </a>
      </motion.div>

      {/* Shop By Category */}
      <div className="bg-gray-100 py-12 px-6 sm:px-10 lg:px-16">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-700 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Body Oil */}
          <motion.a
            href="/oil"
            className="group block text-center"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition duration-500">
              <img
                src="/oilcategory.png"
                alt="Lux Lather body oil bottles"
                className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
              />
              <p className="mt-4 text-2xl font-semibold text-gray-700 group-hover:text-primary transition">
                Body Oil Collection
              </p>
            </div>
          </motion.a>

          {/* Liquid Soap */}
          <motion.a
            href="/soap"
            className="group block text-center"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition duration-500">
              <img
                src="/soapcover.png"
                alt="Lux Lather liquid soap bottles"
                className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
              />
              <p className="mt-4 text-2xl font-semibold text-gray-700 group-hover:text-primary transition">
                Liquid Soap Collection
              </p>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Home;
