"use client";

import { motion } from "framer-motion";
import { Dumbbell, BarChart, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: <Dumbbell size={40} className="text-red-600" />,
    title: "Recipe Logging",
    description:
      "Easily save, categorize, and recall all your recipes in one place.",
  },
  {
    icon: <BarChart size={40} className="text-red-600" />,
    title: "Progress Insights",
    description:
      "Analyze your cooking journey with detailed stats and recipe usage reports.",
  },
  {
    icon: <CalendarCheck size={40} className="text-red-600" />,
    title: "Meal Planning",
    description:
      "Set personalized meal plans and stay organized with grocery lists and scheduling.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full text-black py-20 px-8">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-4">
          Why Choose <span className="text-red-600">TishRecipeHub?</span>
        </h2>
        <p className="text-lg text-gray-700">
          Unlock the full potential of your culinary journey with our intuitive
          features designed for real results.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.8, ease: "easeOut" }}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center
              transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-2 text-black">
              {feature.title}
            </h3>
            <p className="text-gray-700">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
