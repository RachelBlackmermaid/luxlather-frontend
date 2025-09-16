import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  X as XIcon,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useViewportSize } from "@mantine/hooks";
import useCartStore from "../store/useCartStore";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false); // desktop dropdown
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false); // mobile accordion
  const { width } = useViewportSize();
  const isMobile = width < 768;
  const { language, toggleLanguage } = useLanguage();
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  const totalItems = useCartStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0)
  );

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setProductsOpen(false);
    setMobileProductsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenuOnMobile = () => {
    if (isMobile) setIsMenuOpen(false);
  };

  // --- Desktop Products dropdown helpers (outside-click + keyboard)
  const dropdownRef = useRef<HTMLLIElement>(null);
  const productsBtnRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (productsOpen && firstItemRef.current) {
      // small delay so the element exists post-render
      const id = setTimeout(() => firstItemRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [productsOpen]);

  const onProductsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setProductsOpen(false);
      productsBtnRef.current?.focus();
    }
    if ((e.key === "Enter" || e.key === "ArrowDown") && !productsOpen) {
      e.preventDefault();
      setProductsOpen(true);
    }
  };

  // Sticky shadow on scroll (nice micro-interaction)
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopLink = (isActive: boolean) =>
    [
      "relative text-sm font-medium transition-colors",
      "text-neutral-700 hover:text-neutral-900",
      isActive && "text-neutral-900",
      // underline animation
      "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-[width] after:duration-200 hover:after:w-full",
      isActive && "after:w-full",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <header
      className={[
        "sticky top-0 z-[60] w-full",
        "backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90",
        "border-b border-neutral-200/70",
        scrolled ? "shadow-sm" : "",
      ].join(" ")}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
          onClick={closeMenuOnMobile}
        >
          <img
            src="/luxlatherlogo.png"
            alt="Luxlather Logo"
            className="h-35 w-auto"
          />
         
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <NavLink to="/" className={({ isActive }) => desktopLink(isActive)}>
              Home
            </NavLink>
          </li>

          {/* Products dropdown */}
          <li
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            // ⛔ remove onMouseLeave
          >
            <button
              ref={productsBtnRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={productsOpen}
              onClick={() => setProductsOpen((v) => !v)}
              onKeyDown={onProductsKeyDown}
              className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              Products
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  productsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {productsOpen && (
              <div
                role="menu"
                aria-label="Products"
                className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-neutral-200 bg-white shadow-lg p-2 z-50"
              >
                <NavLink
                  to="/oil"
                  ref={firstItemRef}
                  role="menuitem"
                  tabIndex={0}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50 ${
                      isActive ? "text-primary font-semibold" : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`
                  }
                  onClick={() => setProductsOpen(false)}
                >
                  Essential Oil
                </NavLink>
                <NavLink
                  to="/soap"
                  role="menuitem"
                  tabIndex={0}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50 ${
                      isActive ? "text-primary font-semibold" : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`
                  }
                  onClick={() => setProductsOpen(false)}
                >
                  Liquid Soap
                </NavLink>
              </div>
            )}
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => desktopLink(isActive)}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => desktopLink(isActive)}
            >
              Contact Us
            </NavLink>
          </li>

          {/* Customer / Admin */}
          {!loading && user && (
            <>
              <li>
                <NavLink
                  to="/account"
                  className={({ isActive }) => desktopLink(isActive)}
                >
                  Account
                </NavLink>
              </li>
              {user.role === "admin" && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => desktopLink(isActive)}
                  >
                    Admin
                  </NavLink>
                </li>
              )}
              <li>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {!loading && !user && (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => desktopLink(isActive)}
                >
                  Sign in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    [
                      "inline-flex items-center rounded-full border border-primary px-3 py-1.5 text-sm font-semibold",
                      "text-primary hover:bg-primary hover:text-white transition-colors",
                      isActive && "bg-primary text-white",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    ]
                      .filter(Boolean)
                      .join(" ")
                  }
                >
                  Create account
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Desktop Right: Cart + Lang (hide social in header; keep on mobile menu) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/cart"
            className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full p-1"
          >
            <ShoppingCart className="w-6 h-6 text-neutral-800 hover:text-neutral-900" />
            {totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] px-1 leading-[18px] text-center rounded-full"
                aria-live="polite"
              >
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={toggleLanguage}
            className="ml-1 inline-flex items-center rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {language === "en" ? "日本語" : "EN"}
          </button>
        </div>

        {/* Hamburger */}
        <button
          aria-label="Menu Toggle"
          className="block md:hidden p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <XIcon className="h-6 w-6 text-neutral-900" />
          ) : (
            <MenuIcon className="h-6 w-6 text-neutral-900" />
          )}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-16 z-50 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-sm">
          <div className="px-6 py-5 space-y-4">
            <ul className="space-y-3">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    [
                      "block text-base",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-neutral-900",
                    ].join(" ")
                  }
                  onClick={closeMenuOnMobile}
                >
                  Home
                </NavLink>
              </li>

              {/* Mobile Products accordion */}
              <li>
                <button
                  className="w-full text-left text-base text-neutral-900 inline-flex items-center justify-between"
                  onClick={() => setMobileProductsOpen((v) => !v)}
                  aria-expanded={mobileProductsOpen}
                >
                  <span>Products</span>
                  <ChevronDown
                    className={[
                      "h-4 w-4 transition-transform duration-200",
                      mobileProductsOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>
                {mobileProductsOpen && (
                  <div className="mt-2 ml-3 space-y-2">
                    <NavLink
                      to="/oil"
                      className={({ isActive }) =>
                        [
                          "block text-sm",
                          isActive
                            ? "text-primary font-semibold"
                            : "text-neutral-900",
                        ].join(" ")
                      }
                      onClick={() => {
                        setMobileProductsOpen(false);
                        closeMenuOnMobile();
                      }}
                    >
                      Essential Oil
                    </NavLink>
                    <NavLink
                      to="/soap"
                      className={({ isActive }) =>
                        [
                          "block text-sm",
                          isActive
                            ? "text-primary font-semibold"
                            : "text-neutral-900",
                        ].join(" ")
                      }
                      onClick={() => {
                        setMobileProductsOpen(false);
                        closeMenuOnMobile();
                      }}
                    >
                      Liquid Soap
                    </NavLink>
                  </div>
                )}
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    [
                      "block text-base",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-neutral-900",
                    ].join(" ")
                  }
                  onClick={closeMenuOnMobile}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    [
                      "block text-base",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-neutral-900",
                    ].join(" ")
                  }
                  onClick={closeMenuOnMobile}
                >
                  Contact Us
                </NavLink>
              </li>

              {/* Customer / Admin (mobile) */}
              {!loading && user && (
                <>
                  <li>
                    <NavLink
                      to="/account"
                      className={({ isActive }) =>
                        [
                          "block text-base",
                          isActive
                            ? "text-primary font-semibold"
                            : "text-neutral-900",
                        ].join(" ")
                      }
                      onClick={closeMenuOnMobile}
                    >
                      Account
                    </NavLink>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          [
                            "block text-base",
                            isActive
                              ? "text-primary font-semibold"
                              : "text-neutral-900",
                          ].join(" ")
                        }
                        onClick={closeMenuOnMobile}
                      >
                        Admin
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={async () => {
                        await logout();
                        closeMenuOnMobile();
                      }}
                      className="block text-left text-base text-neutral-900"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

              {!loading && !user && (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        [
                          "block text-base",
                          isActive
                            ? "text-primary font-semibold"
                            : "text-neutral-900",
                        ].join(" ")
                      }
                      onClick={closeMenuOnMobile}
                    >
                      Sign in
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        [
                          "inline-flex items-center rounded-full border border-primary px-3 py-1.5 text-sm font-semibold",
                          isActive ? "bg-primary text-white" : "text-primary",
                        ].join(" ")
                      }
                      onClick={closeMenuOnMobile}
                    >
                      Create account
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile Icons */}
            <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
              <Link
                to="/cart"
                onClick={closeMenuOnMobile}
                className="flex items-center gap-2 text-neutral-900"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm">Cart ({totalItems})</span>
              </Link>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-neutral-900 hover:opacity-80 text-lg" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="text-neutral-900 hover:opacity-80 text-lg" />
              </a>
              <a
                href="https://wa.me/yourphonenumber"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-neutral-900 hover:opacity-80 text-lg" />
              </a>
            </div>

            {/* Language Toggle */}
            <div className="pt-4">
              <button
                onClick={toggleLanguage}
                className="w-full px-4 py-2 rounded-full border text-sm font-semibold border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                {language === "en" ? "日本語に切り替え" : "Switch to English"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
