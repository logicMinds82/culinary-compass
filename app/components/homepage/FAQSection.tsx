"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does TishRecipeHub help me organize my recipes?",
    answer: "Our platform allows you to store, categorize, and filter recipes quickly. Plus, you can add notes, ratings, and share them with your community.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes! We offer a free plan with essential features. You can also upgrade anytime for more advanced analytics, meal planning, and custom recipe collections.",
  },
  {
    question: "Does the app integrate with grocery lists or meal planners?",
    answer: "Absolutely! TishRecipeHub can generate grocery lists from selected recipes, and it supports basic meal planning.",
  },
  {
    question: "Can I share recipes with friends?",
    answer: "Yes, you can easily share your favorite recipes or entire collections on social media or directly with other TishRecipeHub users.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 text-black">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-bold mb-12">
          Frequently Asked <span className="text-red-600">Questions</span>
        </h2>

        {/* FAQ Accordion */}
        <div className="space-y-6 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300"
              >
                <button
                  className="w-full flex justify-between items-center text-lg font-semibold text-black px-4 py-3 rounded-md hover:bg-gray-50 transition-all"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  {isOpen ? (
                    <ChevronUp
                      size={24}
                      className="text-red-600 transition-transform"
                    />
                  ) : (
                    <ChevronDown
                      size={24}
                      className="text-red-600 transition-transform"
                    />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-4 text-gray-700 transition-all duration-300">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
