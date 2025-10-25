"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, ChevronUp, LogOut, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MenuItem {
  label: string;
  uniqueKey?: string;
  href?: string;
  submenu?: { label: string; uniqueKey?: string; href: string }[];
}

const menuItemsLoggedOut: MenuItem[] = [
  { label: "Homepage", uniqueKey: "homepage", href: "/" },
  { label: "Recipes", uniqueKey: "recipes", href: "/recipes" },
  {
    label: "Favorite Recipes",
    uniqueKey: "favoriteRecipes",
    href: "/favorite-recipes",
  },
];

const menuItemsLoggedIn: MenuItem[] = [
  { label: "Homepage", uniqueKey: "homepage", href: "/" },
  { label: "Recipes", uniqueKey: "recipes", href: "/recipes" },
  { label: "Submit Recipe", uniqueKey: "submitRecipe", href: "/submit-recipe" },
  {
    label: "Favorite Recipes",
    uniqueKey: "favoriteRecipes",
    href: "/favorite-recipes",
  },
];

const HeaderContent = () => {
  const { user, profile, loading } = useAuth();

  const menuItems = user ? menuItemsLoggedIn : menuItemsLoggedOut;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  if (loading) {
    return (
      <>
        <div>
          <h1 className="text-2xl font-bold">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
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
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
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
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Culinary Compass
          </Link>
        </h1>
        <strong className="fontNormal text-primary">Recipe Collection</strong>
      </div>

      <button className="lg:hidden text-primary">
        {isMenuOpen ? (
          <X size={32} onClick={() => setIsMenuOpen((prev) => !prev)} />
        ) : (
          <Menu size={32} onClick={() => setIsMenuOpen((prev) => !prev)} />
        )}
      </button>

      <nav
        className={`z-[-1] absolute lg:inset-x-0 lg:top-1/2 lg:translate-y-[-50%] top-16 left-0 w-full lg:w-auto lg:mt-0 bg-background lg:bg-transparent lg:flex flex-col lg:flex-row items-start lg:items-center lg:justify-center p-6 lg:p-0 transition-all border-b lg:border-0 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {menuItems.map((item) => {
          const { label, href, submenu, uniqueKey } = item;
          const hasSubmenu = submenu && submenu.length > 0;
          const isSubmenuOpen =
            activeDropdown === uniqueKey || mobileDropdowns[uniqueKey || ""];

          return (
            <div
              key={uniqueKey || label}
              className="relative lg:block"
              onMouseEnter={() =>
                hasSubmenu && handleMouseEnter(uniqueKey || "")
              }
              onMouseLeave={() =>
                hasSubmenu && handleMouseLeave(uniqueKey || "")
              }
            >
              <div className="flex items-center justify-between lg:inline-block">
                <Link
                  href={href || "#"}
                  className="lg:px-4 py-2 flex items-center text-sm lg:text-sm text-primary hover:text-primary-hover transition-colors font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                  {hasSubmenu && (
                    <ChevronDown size={16} className="ml-1 hidden lg:inline" />
                  )}
                </Link>
                {hasSubmenu && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-primary h-8 w-8"
                    onClick={() => toggleMobileDropdown(uniqueKey || "")}
                  >
                    {isSubmenuOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </Button>
                )}
              </div>
              {hasSubmenu && submenu && (
                <div
                  className={`lg:absolute left-0 top-full lg:bg-primary rounded-md shadow-lg transition-opacity duration-200 ${
                    isSubmenuOpen
                      ? "opacity-100 visible block"
                      : "opacity-0 invisible hidden"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile?.full_name
                      ? profile.full_name.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/my-recipes" className="cursor-pointer">
                  <ChefHat className="mr-2 h-4 w-4" />
                  <span>My Recipes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form
                  action="/api/auth/signout"
                  method="POST"
                  className="w-full"
                >
                  <button
                    type="submit"
                    className="flex w-full items-center cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
