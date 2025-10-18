"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="relative w-full bg-background text-foreground py-16 px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        {/* CTA Headline */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Start Your <span className="text-primary">Cooking Journey</span> Today!
        </h2>

        {/* CTA Subtext */}
        <p className="text-lg text-muted-foreground mb-6">
          Join thousands of users discovering new recipes and saving time with Culinary Compass.
        </p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary-hover text-lg font-semibold transform hover:scale-105 shadow-md"
          >
            <Link href="/">
              Get Started Now
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
