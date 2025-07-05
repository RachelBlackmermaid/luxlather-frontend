import { useLanguage } from "../context/LanguageContext";

const Contact = () => {
  const { language } = useLanguage();

  return (
    <section className="min-h-screen px-6 py-12 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-6">
          {language === "en" ? "Contact Us" : "お問い合わせ"}
        </h1>
        <p className="text-center text-gray-700 mb-8">
          {language === "en"
            ? "We’d love to hear from you! Send us a message using the form below."
            : "お気軽にお問い合わせください。下記のフォームにご記入ください。"}
        </p>

        <form className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-1 font-medium text-gray-700"
            >
              {language === "en" ? "Name" : "お名前"}
            </label>
            <input
              type="text"
              id="name"
              placeholder={
                language === "en" ? "Your full name" : "お名前を入力してください"
              }
              className="w-full px-4 py-3 border rounded-md focus:outline-primary"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              {language === "en" ? "Email" : "メールアドレス"}
            </label>
            <input
              type="email"
              id="email"
              placeholder={
                language === "en" ? "example@email.com" : "メールアドレスを入力してください"
              }
              className="w-full px-4 py-3 border rounded-md focus:outline-primary"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block mb-1 font-medium text-gray-700"
            >
              {language === "en" ? "Message" : "メッセージ"}
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder={
                language === "en"
                  ? "Type your message here..."
                  : "こちらにメッセージをご記入ください..."
              }
              className="w-full px-4 py-3 border rounded-md focus:outline-primary"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary/90 transition"
          >
            {language === "en" ? "Send Message" : "送信する"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
