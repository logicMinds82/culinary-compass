"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const pricingPlans = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Basic Recipe Logging",
      "Limited Meal Planning",
      "Community Access"
    ],
    buttonText: "Get Started",
    highlight: false
  },
  {
    title: "Standard",
    price: "$19/mo",
    features: [
      "Advanced Recipe Tracking",
      "Custom Meal Plans",
      "Personalized Insights"
    ],
    buttonText: "Choose Plan",
    highlight: true // best option
  },
  {
    title: "Premium",
    price: "$39/mo",
    features: [
      "All Standard Features",
      "1-on-1 Culinary Coaching",
      "Exclusive Content & Tips"
    ],
    buttonText: "Choose Plan",
    highlight: false
  }
];

const PricingPlans = () => {
  return (
    <section className="w-full bg-stone-100 text-black py-20 px-8">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-4">
          Choose Your <span className="text-red-600">Plan</span>
        </h2>
        <p className="text-lg text-gray-700">
          Get the best recipe and meal-planning experience with a plan that suits your needs.
        </p>
      </motion.div>

      {/* Pricing Table */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => {
          const isHighlighted = plan.highlight;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.8, ease: "easeOut" }}
              className={`p-8 rounded-lg text-center transition-all duration-300 
                ${
                  isHighlighted
                    ? "bg-white border border-red-600 scale-105 shadow-md shadow-red-600/20"
                    : "bg-white border border-gray-200 hover:scale-105 hover:shadow-md"
                }`}
            >
              {/* Plan Title */}
              <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>

              {/* Price */}
              <p className="text-4xl font-bold text-red-600 mb-4">
                {plan.price}
              </p>

              {/* Features List */}
              <ul className="mb-6 text-gray-700 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center justify-center">
                    ✔ {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href="/"
                className={`inline-block px-6 py-3 rounded-md text-lg font-semibold border 
                  ${
                    isHighlighted
                      ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  }
                  transition-all
                `}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingPlans;
