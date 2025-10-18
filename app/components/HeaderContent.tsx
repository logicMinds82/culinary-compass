"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

interface MenuItem {
  label: string;
  uniqueKey?: string;
  href?: string;
  submenu?: { label: string; uniqueKey?: string; href: string }[];
}

const menuItemsLoggedOut: MenuItem[] = [
  { label: "Homepage", uniqueKey: "homepage", href: "/" },
  { label: "Recipes", uniqueKey: "recipes", href: "/recipes" },
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

const HeaderContent = () => {

  const { user, profile, loading } = useAuth();

  const menuItems = user ? menuItemsLoggedIn : menuItemsLoggedOut;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<{ [key: string]: boolean }>({});

  // Show loading skeleton until auth data is fetched
  if (loading) {
    return (
      <>
        <div>
          <h1 className="text-2xl font-bold">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Culinary Compass
            </Link>
          </h1>
          <strong className="fontNormal text-primary">Recipe Collection</strong>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-primary"
          disabled={true}
        >
          <Menu size={24} />
        </Button>

        <nav className="hidden lg:flex items-center justify-center space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-4 w-16 bg-muted rounded animate-pulse"
            />
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="h-10 w-20 bg-muted rounded animate-pulse" />
        </div>
      </>
    );
  }

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
      <div>
        <h1 className="text-2xl font-bold">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Culinary Compass
          </Link>
        </h1>
        <strong className="fontNormal text-primary">Recipe Collection</strong>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-primary"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      <nav
        className={`z-[-1] absolute lg:inset-x-0 lg:top-1/2 lg:translate-y-[-50%] top-16 left-0 w-full lg:w-auto lg:mt-0 bg-background lg:bg-transparent lg:flex flex-col lg:flex-row items-start lg:items-center lg:justify-center p-6 lg:p-0 transition-all border-b lg:border-0 ${
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
                <Link
                  href={href || "#"}
                  className="lg:px-4 py-2 flex items-center text-sm lg:text-sm text-primary hover:text-primary-hover transition-colors font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                  {hasSubmenu && <ChevronDown size={16} className="ml-1 hidden lg:inline" />}
                </Link>
                {hasSubmenu && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-primary h-8 w-8"
                    onClick={() => toggleMobileDropdown(uniqueKey || "")}
                  >
                    {isSubmenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </Button>
                )}
              </div>
              {hasSubmenu && submenu && (
                <div
                  className={`lg:absolute left-0 top-full lg:bg-primary rounded-md shadow-lg transition-opacity duration-200 ${
                    isSubmenuOpen ? "opacity-100 visible block" : "opacity-0 invisible hidden"
                  } flex flex-col w-48 pl-4 lg:pl-0 overflow-hidden`}
                >
                  {submenu.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-4 py-2 hover:bg-primary-hover text-sm lg:text-base lg:text-primary-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
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
            <span className="hidden text-foreground lg:inline text-sm">
              Welcome, {profile?.full_name || user.email}
            </span>
            <div>
              <form action="/api/auth/signout" method="POST">
                <Button type="submit" className="bg-primary hover:bg-primary-hover cursor-pointer">
                  Logout
                </Button>
              </form>
            </div>
          </>
        ) : (
          <Button asChild className="bg-primary hover:bg-primary-hover">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </>
  );
};

export default HeaderContent;