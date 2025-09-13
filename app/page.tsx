import HeroSlider from "./components/homepage/HeroSlider";
import FeaturedRecipesGrid from "./components/homepage/FeaturedRecipesGrid";
import FeaturesSection from "./components/homepage/FeaturesSection";
import PricingPlans from './components/homepage/PricingPlans';
import Testimonials from "./components/homepage/Testimonials";
import CTASection from "./components/homepage/CTASection";
import FAQSection from "./components/homepage/FAQSection";
import NewsletterSignup from "./components/homepage/NewsletterSignup";
import SocialProof from "./components/homepage/SocialProof";
import InstagramGallery from "./components/homepage/InstagramGallery";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <FeaturedRecipesGrid />
      <FeaturesSection />
      <PricingPlans />
      <Testimonials />
      <CTASection />
      <FAQSection />
      <NewsletterSignup />
      <SocialProof />
      <InstagramGallery />
    </main>
  );
}
