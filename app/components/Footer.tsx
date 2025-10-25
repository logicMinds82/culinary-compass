"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-muted-foreground py-12 relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/recipes" className="hover:text-primary transition-colors">Recipes</Link></li>
            <li><Link href="/submit-recipe" className="hover:text-primary transition-colors">Submit Recipe</Link></li>
            <li><Link href="/contactus" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary">Contact Us</h3>
          <p>Email: <a href="mailto:contact@culinarycompass.com" className="hover:text-primary transition-colors">contact@culinarycompass.com</a></p>
          <p className="mt-2">Join our community and start sharing recipes today!</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-primary transition-colors"><SiFacebook size={24} /></a>
            <a href="#" className="hover:text-primary transition-colors"><SiX size={24} /></a>
            <a href="#" className="hover:text-primary transition-colors"><SiInstagram size={24} /></a>
            <a href="#" className="hover:text-primary transition-colors"><SiLinkedin size={24} /></a>
          </div>
        </div>
      </div>
      
      <Separator className="my-8 max-w-6xl mx-auto bg-muted" />
      
      <div className="text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Culinary Compass - A Community Recipe Sharing Platform. All rights reserved.
      </div>
      
      {/* Scroll to Top Button */}
      {showScroll && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 rounded-full shadow-lg bg-primary hover:bg-primary-hover cursor-pointer"
        >
          <ArrowUp className="text-primary-foreground" size={24} />
        </Button>
      )}
    </footer>
  );
};

export default Footer;
