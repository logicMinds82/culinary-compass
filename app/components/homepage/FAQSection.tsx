"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Culinary Compass help me organize my recipes?",
    answer: "Our platform allows you to store, categorize, and filter recipes quickly. You can add your own recipes, browse community submissions, and save your favorites.",
  },
  {
    question: "Is Culinary Compass free to use?",
    answer: "Yes! Culinary Compass is a free community platform where anyone can share and discover recipes. Simply create an account to start contributing.",
  },
  {
    question: "Can I submit my own recipes?",
    answer: "Absolutely! Once you create an account, you can submit your own recipes to share with the community. You can also edit and manage your submitted recipes.",
  },
  {
    question: "How do I save my favorite recipes?",
    answer: "Simply click the heart icon on any recipe to add it to your favorites. You can access all your saved recipes from the 'Favorite Recipes' page.",
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
