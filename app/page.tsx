import HeroSlider from "./components/homepage/HeroSlider";
import FeaturedRecipesGrid from "./components/homepage/FeaturedRecipesGrid";
import FeaturesSection from "./components/homepage/FeaturesSection";
import CTASection from "./components/homepage/CTASection";
import FAQSection from "./components/homepage/FAQSection";
import InstagramGallery from "./components/homepage/InstagramGallery";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <FeaturedRecipesGrid />
      <FeaturesSection />
      <CTASection />
      <FAQSection />
      <InstagramGallery />
    </main>
  );
}
