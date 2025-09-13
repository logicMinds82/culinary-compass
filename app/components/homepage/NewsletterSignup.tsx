"use client";

const NewsletterSignup = () => {
  return (
    <section className="w-full bg-stone-100 py-16 text-black text-center">
      <div className="px-6 max-w-3xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl font-bold mb-4">
          Stay Updated with the <span className="text-red-600">Latest Recipes</span>
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Subscribe to our newsletter and receive expert cooking tips, new recipe ideas, and community updates straight to your inbox.
        </p>

        {/* Signup Form */}
        <form className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-2/3 px-4 py-3 rounded-md border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition-transform transform hover:scale-105 shadow-md"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
