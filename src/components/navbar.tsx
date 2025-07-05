import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { MenuIcon, XIcon, ShoppingCart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useViewportSize } from "@mantine/hooks";
import useCartStore from "../store/useCartStore";
import { useLanguage } from "../context/LanguageContext";

interface NavLinkType {
  name: string;
  path: string;
}

const navLinks: NavLinkType[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Essential Oil", path: "/oil" },
  { name: "Liquid Soap", path: "/soap" },
  { name: "Contact Us", path: "/contact" },
 
];



const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useViewportSize();
  const isMobile = width < 768;

  const token = localStorage.getItem("token");


  const { language, toggleLanguage } = useLanguage();

  const totalItems = useCartStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0)
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenuOnMobile = () => {
    if (isMobile) setIsMenuOpen(false);
  };

  return (
    <header className="fixed z-50 w-full px-8 shadow-sm shadow-neutral-500 h-20 flex items-center bg-white">
      <nav className="flex justify-between items-center w-full">
      <NavLink to="/" className="font-bold">
          <img src="/luxlatherlogo.png" alt="Luxlather Logo" className="h-35" />
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `text-black ${
                    isActive ? "text-primary font-semibold" : "text-secondary"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
{/* admin link */}
{import.meta.env.DEV && (
  <li>
  {token && (
    <NavLink
    to="/admin"
    className={({ isActive }) =>
      `text-black ${isActive ? "text-primary font-semibold" : "text-secondary"}`
    }
  >
    Admin
  </NavLink>

  )}
    
  </li>
)}

        </ul>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6 ml-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="text-black hover:text-blue-600 text-lg" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-black hover:text-pink-500 text-lg" />
          </a>
          <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-black hover:text-green-500 text-lg" />
          </a>

          <Link to="/cart" className="relative">
            <ShoppingCart className="text-black hover:text-gray-700 w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="ml-2 px-3 py-1 rounded-full border text-sm font-medium border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            {language === "en" ? "日本語" : "EN"}
          </button>
        </div>

        {/* Hamburger Toggle */}
        <button
          aria-label="Menu Toggle"
          className="block md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <XIcon className="size-6 text-black" />
          ) : (
            <MenuIcon className="size-6 text-black" />
          )}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 right-0 w-2/3 bg-white p-6 shadow-lg space-y-4 z-40">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `block text-base ${
                      isActive ? "text-primary font-semibold" : "text-black"
                    }`
                  }
                  onClick={closeMenuOnMobile}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
{/* admin link */}
{import.meta.env.DEV && (
  <li>
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        `block text-base ${isActive ? "text-primary font-semibold" : "text-black"}`
      }
      onClick={closeMenuOnMobile}
    >
      Admin
    </NavLink>
  </li>
)}


          </ul>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <Link
              to="/cart"
              onClick={closeMenuOnMobile}
              className="flex items-center gap-2 text-black"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">Cart ({totalItems})</span>
            </Link>

            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-black hover:text-blue-600 text-lg" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-black hover:text-pink-500 text-lg" />
            </a>
            <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="text-black hover:text-green-500 text-lg" />
            </a>
          </div>

          {/* Language Toggle */}
          <div className="pt-4">
            <button
              onClick={toggleLanguage}
              className="w-full px-4 py-2 rounded-full border text-sm font-medium border-primary text-primary hover:bg-primary hover:text-white transition"
            >
              {language === "en" ? "日本語に切り替え" : "Switch to English"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
