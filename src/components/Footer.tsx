import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-gray-300 py-10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Logo & Description */}
      <div>
        <h2 className="text-white text-2xl font-bold mb-4">LuxLather 🤎</h2>
        <p className="text-sm">
          Indulge in handmade luxury. Pure, natural, and crafted with care.
        </p>
      </div>

      {/* Links */}
      <div>
        <h3 className="text-white font-semibold mb-3">Shop</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/oil" className="hover:text-white">Oil</a></li>
          <li><a href="/soap" className="hover:text-white">Soap</a></li>
          <li><a href="/sale" className="hover:text-white">Offers</a></li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-white font-semibold mb-3">Support</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          <li><a href="/faq" className="hover:text-white">FAQs</a></li>
          <li><a href="/shipping" className="hover:text-white">Shipping Info</a></li>
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
        <form className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="email"
            placeholder="Your email"
            className="px-3 py-2 rounded bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded text-sm"
          >
            Subscribe
          </button>
        </form>
         {/* Socials */}
         <div className="flex gap-4 text-white text-xl">
            <a
              href="https://wa.me/yourNumber"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-purple-400"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-purple-400"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-purple-400"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://tiktok.com/@yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-purple-400"
            >
              <FaTiktok />
            </a>
          </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} LuxLather. All rights reserved.
    </div>
  </footer>
  )
}

export default Footer;