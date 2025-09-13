"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="relative w-full bg-stone-100 text-black py-16 px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        {/* CTA Headline */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Start Your <span className="text-red-600">Cooking Journey</span> Today!
        </h2>

        {/* CTA Subtext */}
        <p className="text-lg text-gray-700 mb-6">
          Join thousands of users discovering new recipes and saving time with TishRecipeHub.
        </p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md text-lg font-semibold transition-all transform hover:scale-105 shadow-md"
          >
            Get Started Now
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
