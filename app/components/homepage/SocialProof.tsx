"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Partner Logos
const partners = [
  { name: "Brand 1", logo: "/images/brands/1.png" },
  { name: "Brand 2", logo: "/images/brands/2.png" },
  { name: "Brand 3", logo: "/images/brands/3.png" },
  { name: "Brand 4", logo: "/images/brands/4.png" },
  { name: "Brand 5", logo: "/images/brands/5.png" },
];

const SocialProof = () => {
  return (
  <section className="py-16 bg-background text-center">
  <div className="w-full max-w-5xl px-6 mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-foreground mb-8">
          Featured In{" "}
          <span className="text-primary">Top Publications</span>
        </h2>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={true}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="w-full"
        >
          {partners.map((partner, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center h-24"
            >
              <Card className="relative w-auto h-full flex items-center justify-center p-2 bg-background border-none shadow-none">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="max-h-full max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300"
                  priority={false}
                />
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SocialProof;
