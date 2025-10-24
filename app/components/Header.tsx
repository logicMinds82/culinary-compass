"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import HeaderContent from "./HeaderContent";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    setIsScrolled(window.scrollY > 0);

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <>
      {isHome ? (
        <AnimatePresence>
          {isScrolled && (
            <motion.header
              ref={headerRef}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.6,
              }}
              className="bg-background border-b border-border py-2 px-4 flex justify-between items-center z-50 fixed top-0 left-0 right-0"
            >
              <HeaderContent />
            </motion.header>
          )}
        </AnimatePresence>
      ) : (
        <header className="bg-background border-b border-border py-2 px-4 flex justify-between items-center z-50 sticky top-0">
          <HeaderContent />
        </header>
      )}
    </>
  );
};

export default Header;
