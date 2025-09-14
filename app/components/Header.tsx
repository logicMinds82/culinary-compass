"use client";
import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si"; // X icon instead of Twitter

interface MenuItem {
  label: string;
  uniqueKey?: string;
  href?: string;
  submenu?: { label: string; uniqueKey?: string; href: string }[];
}

const menuItemsLoggedOut: MenuItem[] = [
  { label: "Homepage", uniqueKey: "homepage", href: "/" },
  { label: "Recipes", uniqueKey: "recipes", href: "/recipes" },
  { label: "Submit Recipe", uniqueKey: "submitRecipe", href: "/submit-recipe" },
  { label: "News", uniqueKey: "news", href: "/news" },
  { label: "Contacts", uniqueKey: "contactUs", href: "/contactus" },
];

const menuItemsLoggedIn: MenuItem[] = [
  { label: "Homepage", uniqueKey: "homepage", href: "/" },
  { label: "Recipes", uniqueKey: "recipes", href: "/recipes" },
  { label: "Submit Recipe", uniqueKey: "submitRecipe", href: "/submit-recipe" },
  { label: "Favorite Recipes", uniqueKey: "favoriteRecipes", href: "/favorite-recipes" },
  { label: "News", uniqueKey: "news", href: "/news" },
  { label: "Contacts", uniqueKey: "contactUs", href: "/contactus" },
];

const Header = () => {
  const { user } = useAuth();
  const menuItems = user ? menuItemsLoggedIn : menuItemsLoggedOut;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<{ [key: string]: boolean }>({});

  const handleMouseEnter = (menuKey: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = (menuKey: string) => {
    const timeout = setTimeout(() => {
      if (activeDropdown === menuKey) {
        setActiveDropdown(null);
      }
    }, 300);
    setCloseTimeout(timeout);
  };

  const toggleMobileDropdown = (menuKey: string) => {
    setMobileDropdowns((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-stone-100 text-black py-2 px-4 flex justify-between items-center text-sm lg:text-base">
        {/* Email: Label is text, email itself is a clickable link */}
        <p className="hidden lg:block">
          Email: <Link href="mailto:contact@example.com" className="text-black hover:text-red-700 transition">contact@example.com</Link>
        </p>

        {/* Social Icons (Updated X icon) */}
        <div className="flex gap-4 mx-auto lg:mx-0">
          <Link href="#" className="hover:text-red-700"><SiFacebook size={20} /></Link>
          <Link href="#" className="hover:text-red-700"><SiX size={20} /></Link> {/* X instead of Twitter */}
          <Link href="#" className="hover:text-red-700"><SiInstagram size={20} /></Link>
          <Link href="#" className="hover:text-red-700"><SiLinkedin size={20} /></Link>
        </div>

        {/* Mobile Email (Label stays text, email is clickable) */}
        <p className="block lg:hidden text-center w-full mt-2">
          Email: <Link href="mailto:contact@example.com" className="text-black hover:text-red-700 transition">contact@example.com</Link>
        </p>
      </div>

      {/* MAIN HEADER */}
      <header className="bg-white text-red-600 py-2 px-4 flex justify-between items-center relative z-50 pt-10 pb-10">
        <div>
          <h1 className="text-2xl font-bold">
            <Link href="/" className="text-black hover:text-red-700">TishRecipeHub</Link>
          </h1>
          <strong className="fontNormal text-red-900">Recipe Collection</strong>
        </div>


        <button className="lg:hidden text-red-600" onClick={() => setIsMenuOpen((prev) => !prev)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav
          className={`absolute lg:static top-16 left-0 w-full lg:w-auto mt-10 lg:mt-0 bg-stone-100 lg:bg-transparent lg:flex flex-col lg:flex-row items-start lg:items-center p-6 lg:p-0 transition-all ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          {menuItems.map((item) => {
            const { label, href, submenu, uniqueKey } = item;
            const hasSubmenu = submenu && submenu.length > 0;
            const isSubmenuOpen = activeDropdown === uniqueKey || mobileDropdowns[uniqueKey || ""];

            return (
              <div
                key={uniqueKey || label}
                className="relative lg:block"
                onMouseEnter={() => hasSubmenu && handleMouseEnter(uniqueKey || "")}
                onMouseLeave={() => hasSubmenu && handleMouseLeave(uniqueKey || "")}
              >
                <div className="flex items-center justify-between lg:inline-block">
                  <Link href={href || "#"} className="px-4 py-2 flex items-center text-sm lg:text-sm text-red-600 hover:text-red-700" onClick={() => setIsMenuOpen(false)}>
                    {label}
                    {hasSubmenu && <ChevronDown size={16} className="ml-1 hidden lg:inline" />}
                  </Link>
                  {hasSubmenu && (
                    <button className="lg:hidden text-red-600" onClick={() => toggleMobileDropdown(uniqueKey || "")}>
                      {isSubmenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  )}
                </div>
                {hasSubmenu && submenu && (
                  <div
                    className={`lg:absolute left-0 top-full lg:bg-red-900 rounded transition-opacity duration-200 ${
                      isSubmenuOpen ? "opacity-100 visible block" : "opacity-0 invisible hidden"
                    } flex flex-col w-48 pl-4 lg:pl-0 overflow-hidden`}
                  >
                    {submenu.map((subItem) => (
                      <Link key={subItem.label} href={subItem.href} className="block px-4 py-2 hover:bg-red-700 text-sm lg:text-base lg:text-white" onClick={() => setIsMenuOpen(false)}>
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden text-black lg:inline text-sm">Welcome, {user.email}</span>
              <div>
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
                    Logout
                  </button>
                </form>
              </div>
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
              Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
