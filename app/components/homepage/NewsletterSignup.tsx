"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterSignup = () => {
  return (
    <section className="w-full bg-background py-16 text-foreground text-center">
      <div className="px-6 max-w-3xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl font-bold mb-4">
          Stay Updated with the <span className="text-primary">Latest Recipes</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Subscribe to our newsletter and receive expert cooking tips, new recipe ideas, and community updates straight to your inbox.
        </p>

        {/* Signup Form */}
        <form className="flex flex-col sm:flex-row justify-center gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-2/3"
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-hover font-semibold transform hover:scale-105 shadow-md"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
