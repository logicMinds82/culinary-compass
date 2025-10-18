"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

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
    <section className="w-full bg-background text-foreground py-20 px-8">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-4">
          Choose Your <span className="text-primary">Plan</span>
        </h2>
        <p className="text-lg text-muted-foreground">
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
            >
              <Card className={`text-center transition-all duration-300 h-full ${
                  isHighlighted
                    ? "border-primary scale-105 shadow-lg shadow-primary/20"
                    : "hover:scale-105 hover:shadow-lg"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.title}</CardTitle>
                  {isHighlighted && (
                    <CardDescription className="text-primary font-semibold">
                      Best Value
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <p className="text-5xl font-bold text-primary">
                    {plan.price}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    variant={isHighlighted ? "default" : "outline"}
                    className={`w-full ${
                      isHighlighted 
                        ? "bg-primary hover:bg-primary-hover" 
                        : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    <Link href="/">
                      {plan.buttonText}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingPlans;
