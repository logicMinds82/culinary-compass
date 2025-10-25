"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Make sure these images exist in "/public/images/slide1.jpg", etc.
const slides = [
  {
    id: 1,
    title: "Discover the Best Recipes",
    description: "Explore thousands of delicious recipes tailored to your taste.",
    buttonText: "Explore Now",
    buttonURL: "/#",
    image: "/images/slide1.jpg",
  },
  {
    id: 2,
    title: "Cook with Confidence",
    description: "Step-by-step instructions and tips to master any dish.",
    buttonText: "Get Started",
    buttonURL: "/#",
    image: "/images/slide2.jpg",
  },
  {
    id: 3,
    title: "Share Your Creations",
    description: "Join our community and showcase your best recipes.",
    buttonText: "Join Us",
    buttonURL: "/#",
    image: "/images/slide3.jpg",
  },
];

const HeroSlider = () => {
  return (
    <section className="relative w-full h-screen bg-black">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
        navigation={{ nextEl: ".swiper-next", prevEl: ".swiper-prev" }}
        loop
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Slide Container */}
            <div
                className="relative w-full h-screen flex flex-col justify-center items-center text-white px-6"
                style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "auto 100%", // Ensures it stretches fully
                    backgroundRepeat: "no-repeat", // Prevents tiling
                    backgroundPosition: "center center", // Centers the image
                }}>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              <div className="pl-15 pr-15">
                {/* Animated Text & CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative text-center max-w-2xl z-10"
                >
                    <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold mb-4"
                    >
                    {slide.title}
                    </motion.h1>
                    <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-lg md:text-xl mb-6"
                    >
                    {slide.description}
                    </motion.p>
                    <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    >
                    <Button
                        asChild
                        size="lg"
                        className="bg-primary hover:bg-primary-hover text-lg font-semibold rounded-full transform hover:scale-105 transition-transform"
                    >
                        <Link href={slide.buttonURL}>
                            {slide.buttonText}
                        </Link>
                    </Button>
                    </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrows */}
      <Button
        size="icon"
        className="swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-primary-hover rounded-full h-12 w-12"
      >
        <ChevronLeft size={30} />
      </Button>
      <Button
        size="icon"
        className="swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-primary-hover rounded-full h-12 w-12"
      >
        <ChevronRight size={30} />
      </Button>

      {/* Pagination with custom bullet colors */}
      <div
        className="swiper-pagination absolute bottom-4 flex justify-center space-x-2 z-10"
        style={
          {
            "--swiper-pagination-color": "oklch(0.668 0.183 25.66)", // Primary color
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
            "--swiper-pagination-bullet-inactive-opacity": "0.6",
          } as React.CSSProperties
        }
      ></div>
    </section>
  );
};

export default HeroSlider;
