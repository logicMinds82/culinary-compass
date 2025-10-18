"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface InstagramPost {
  id: number;
  image: string;
  title: string;
  url: string;
}

const InstagramGallery = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram-gallery")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Instagram posts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-4">
        Loading Instagram posts...
      </p>
    );
  }

  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-foreground mb-10">
          Follow Us on <span className="text-primary">Instagram</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative group overflow-hidden rounded-lg shadow-sm border border-border p-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/15 bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-semibold text-center">
                    {post.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;
