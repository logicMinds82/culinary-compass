"use client";


import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ChefHat } from "lucide-react";

// Testimonial Data
const testimonials = [
  {
    id: 1,
    name: "Michael Johnson",
    avatar: "/images/user1.jpg",
    rating: 5,
    review:
      "Culinary Compass keeps me motivated! I love seeing my progress tracked in real-time.",
  },
  {
    id: 2,
    name: "Sophia Lee",
    avatar: "/images/user2.jpg",
    rating: 4,
    review:
      "As a home cook, I recommend this app to my friends. It's an essential tool for tracking recipes and progress!",
  },
  {
    id: 3,
    name: "James Carter",
    avatar: "/images/user3.jpg",
    rating: 5,
    review:
      "A must-have platform for anyone serious about exploring new recipes!",
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "/images/user4.jpg",
    rating: 5,
    review:
      "Culinary Compass made finding and storing my recipes so easy. The user interface is amazing!",
  },
];

const Testimonials = () => {
  return (
    <section className="relative w-full overflow-x-hidden py-20 bg-white text-black flex justify-center items-center flex-col">
      <div className="w-full max-w-5xl px-6 sm:px-8 lg:px-10 mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-black mb-12">
          What Our <span className="text-red-600">Users Say</span>
        </h2>

        {/* Swiper Slider */}
        <div className="w-full overflow-visible">
          <Swiper
            modules={[Pagination, Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            loop={true}
            spaceBetween={0}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
            }}
            className="w-full"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={`testimonial-${testimonial.id}`} className="flex h-full">
                {/* Wrapper adds spacing for hover scaling */}
                <div className="p-2 w-full h-full overflow-visible">
                  <div className="transition-all duration-300 hover:scale-[1.03] hover:shadow-lg w-full h-full bg-white p-8 rounded-lg border border-gray-200 text-center flex flex-col justify-between min-h-[360px]">
                    {/* Avatar */}
                    <Avatar className="mx-auto mb-4 size-24 border-4 border-accent">
                      <AvatarFallback>
                        <ChefHat size={48} className="text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    {/* Name */}
                    <h3 className="text-2xl font-semibold mb-2 text-foreground">
                      {testimonial.name}
                    </h3>
                    {/* Rating */}
                    <div className="flex justify-center mb-3" aria-label={`Rating: ${testimonial.rating} out of 5`}>
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <span
                          key={`${testimonial.id}-${i}`}
                          className="text-yellow-400 text-2xl"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {/* Review */}
                    <p className="text-muted-foreground text-lg">{testimonial.review}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Pagination (outside Swiper) */}
        <div className="custom-pagination mt-8 flex justify-center gap-2" />
      </div>

      {/* Custom Swiper Pagination Styling */}
      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          background: var(--accent) !important;
          opacity: 0.5;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
