import React, { useState } from "react";
import { z } from "zod";
import api from "../lib/api";
import { useLanguage } from "../context/LanguageContext";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
  // honeypot: should be empty
  website: z.string().max(0).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const Contact: React.FC = () => {
  const { language } = useLanguage();

  const t = {
    title: language === "en" ? "Contact Us" : "お問い合わせ",
    blurb:
      language === "en"
        ? "We’d love to hear from you! Send us a message using the form below."
        : "お気軽にお問い合わせください。下記のフォームにご記入ください。",
    name: language === "en" ? "Name" : "お名前",
    namePH: language === "en" ? "Your full name" : "お名前を入力してください",
    email: language === "en" ? "Email" : "メールアドレス",
    emailPH: language === "en" ? "example@email.com" : "メールアドレスを入力してください",
    message: language === "en" ? "Message" : "メッセージ",
    messagePH:
      language === "en"
        ? "Type your message here..."
        : "こちらにメッセージをご記入ください...",
    send: language === "en" ? "Send Message" : "送信する",
    sending: language === "en" ? "Sending..." : "送信中…",
    success:
      language === "en"
        ? "Thanks! We received your message and will get back to you soon."
        : "送信ありがとうございます。追ってご連絡いたします。",
    fail:
      language === "en"
        ? "Failed to send. Please try again."
        : "送信に失敗しました。もう一度お試しください。",
    nameErr: language === "en" ? "Please enter your name." : "お名前を入力してください。",
    emailErr:
      language === "en"
        ? "Please enter a valid email."
        : "有効なメールアドレスを入力してください。",
    msgErr:
      language === "en"
        ? "Please enter a longer message."
        : "もう少し詳しくご記入ください。",
  };

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    website: "", // honeypot
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );

  const onChange =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((eMap) => ({ ...eMap, [key]: "" }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const map: Partial<Record<keyof FormData, string>> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as keyof FormData;
        if (path === "name") map.name = t.nameErr;
        if (path === "email") map.email = t.emailErr;
        if (path === "message") map.message = t.msgErr;
      }
      setErrors(map);
      return;
    }

    // honeypot: if filled, silently "succeed"
    if (form.website) {
      setStatus("ok");
      return;
    }

    try {
      setStatus("sending");
      // Minimal backend endpoint; create one if you don't have it yet:
      // POST /api/contact  -> { name, email, message }
      await api.post("/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setStatus("ok");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      console.error(err);
      setStatus("err");
    }
  };

  return (
    <section className="min-h-screen px-6 py-12 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-6">
          {t.title}
        </h1>
        <p className="text-center text-gray-700 mb-8">{t.blurb}</p>

        {status === "ok" && (
          <div className="mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {t.success}
          </div>
        )}
        {status === "err" && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {t.fail}
          </div>
        )}

        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          {/* Honeypot (hidden from users) */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={onChange("website")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
              {t.name}
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={onChange("name")}
              placeholder={t.namePH}
              className={`w-full px-4 py-3 border rounded-md focus:outline-primary ${
                errors.name ? "border-red-500" : ""
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder={t.emailPH}
              className={`w-full px-4 py-3 border rounded-md focus:outline-primary ${
                errors.email ? "border-red-500" : ""
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block mb-1 font-medium text-gray-700">
              {t.message}
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={onChange("message")}
              placeholder={t.messagePH}
              className={`w-full px-4 py-3 border rounded-md focus:outline-primary ${
                errors.message ? "border-red-500" : ""
              }`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              required
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-sm text-red-600">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary/90 transition disabled:opacity-60"
          >
            {status === "sending" ? t.sending : t.send}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
