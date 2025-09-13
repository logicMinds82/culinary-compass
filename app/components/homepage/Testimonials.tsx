"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Testimonial Data
const testimonials = [
  {
    id: 1,
    name: "Michael Johnson",
    avatar: "/images/user1.jpg",
    rating: 5,
    review:
      "TishRecipeHub keeps me motivated! I love seeing my progress tracked in real-time.",
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
      "TishRecipeHub made finding and storing my recipes so easy. The user interface is amazing!",
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
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={90}
                      height={90}
                      className="rounded-full mx-auto mb-4 border-4 border-red-600 object-cover"
                      priority
                    />
                    {/* Name */}
                    <h3 className="text-2xl font-semibold mb-2 text-black">
                      {testimonial.name}
                    </h3>
                    {/* Rating */}
                    <div className="flex justify-center mb-3">
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
                    <p className="text-gray-600 text-lg">{testimonial.review}</p>
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
          background: #dc2626 !important;
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
