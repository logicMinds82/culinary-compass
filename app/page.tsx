export const dynamic = "force-static";

import HeroSlider from "./components/homepage/HeroSlider";
import FeaturedRecipesGrid from "./components/homepage/FeaturedRecipesGrid";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <FeaturedRecipesGrid />
    </main>
  );
}
