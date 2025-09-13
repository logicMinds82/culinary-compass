"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si"; // Correct icon for Twitter (now X)

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
    <footer className="bg-gray-800 text-gray-400 py-12 relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-600">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-red-600">Home</Link></li>
            <li><Link href="/" className="hover:text-red-600">Features</Link></li>
            <li><Link href="/" className="hover:text-red-600">Pricing</Link></li>
            <li><Link href="/" className="hover:text-red-600">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-600">Contact Us</h3>
          <p>Email: <a href="mailto:info@example.com" className="hover:text-red-600">info@example.com</a></p>
          <p>Phone: <a href="tel:+1234567890" className="hover:text-red-600">+1 234 567 890</a></p>
          <p>Address: 123 Main Street, Tish City</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-600">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-red-600"><SiFacebook size={24} /></a>
            <a href="#" className="hover:text-red-600"><SiX size={24} /></a> {/* Correct Twitter/X icon */}
            <a href="#" className="hover:text-red-600"><SiInstagram size={24} /></a>
            <a href="#" className="hover:text-red-600"><SiLinkedin size={24} /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm mt-8">
        &copy; {new Date().getFullYear()} Tishonator. All rights reserved.
      </div>
      
      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded shadow-lg bg-red-600 hover:bg-orange-600 transition"
        >
          <ArrowUp className="text-white" size={24} />
        </button>
      )}
    </footer>
  );
};

export default Footer;
