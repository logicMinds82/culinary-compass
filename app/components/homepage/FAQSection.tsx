"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Culinary Compass help me organize my recipes?",
    answer: "Our platform allows you to store, categorize, and filter recipes quickly. Plus, you can add notes, ratings, and share them with your community.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes! We offer a free plan with essential features. You can also upgrade anytime for more advanced analytics, meal planning, and custom recipe collections.",
  },
  {
    question: "Does the app integrate with grocery lists or meal planners?",
    answer: "Absolutely! Culinary Compass can generate grocery lists from selected recipes, and it supports basic meal planning.",
  },
  {
    question: "Can I share recipes with friends?",
    answer: "Yes, you can easily share your favorite recipes or entire collections on social media or directly with other Culinary Compass users.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 text-foreground">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-bold mb-12">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-2 text-left">
          {faqs.map((faq, index) => (
            <AccordionItem value={`faq-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold text-foreground px-4 py-3 rounded-md">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground transition-all duration-300 px-4">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
