"use client";

import { motion } from "framer-motion";
import { BookOpen, Heart, Users } from "lucide-react";
import { Card } from "@/components/ui/card";


const features = [
  {
  icon: <BookOpen size={40} className="text-primary" />,
    title: "Share & Discover",
    description:
      "Browse thousands of community-submitted recipes and share your own culinary creations with food lovers worldwide.",
  },
  {
  icon: <Heart size={40} className="text-primary" />,
    title: "Save Favorites",
    description:
      "Build your personal collection by saving recipes you love and access them anytime, anywhere.",
  },
  {
  icon: <Users size={40} className="text-primary" />,
    title: "Community Driven",
    description:
      "Connect with fellow home cooks, discover new cuisines, and be part of a growing food community.",
  },
];

const FeaturesSection = () => {
  return (
  <section className="w-full text-foreground py-20 px-8">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-4">
          Why Choose <span className="text-primary">Culinary Compass?</span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Join a vibrant community of food enthusiasts sharing and discovering recipes from around the world.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="mt-12 flex lg:flex-row flex-col gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <Card className="p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground line-clamp-3">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;