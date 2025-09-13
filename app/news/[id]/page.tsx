"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar } from "lucide-react";

// Define the expected type for a news item
interface NewsItem {
  id: number;
  title: string;
  image: string;
  date: string;
  content: string;
}

const NewsDetail = () => {
  const params = useParams();
  const id = params.id as string; // Explicitly cast to string

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchNewsDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/news?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch news item");
        const data: NewsItem = await response.json();
        setNewsItem(data);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
      setLoading(false);
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-lg text-gray-500">News not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-stone-100 py-10">
      <div className="px-6 w-full max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h1 className="text-4xl font-bold text-black mb-4">
            {newsItem.title}
          </h1>

          <Image
            src={newsItem.image}
            alt={newsItem.title}
            width={800}
            height={500}
            className="w-full object-cover rounded-lg mb-6"
            priority={true}
          />

          {/* Date Section */}
          <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 py-1 px-3 rounded-md text-sm text-gray-700 shadow-sm mb-6">
            <Calendar size={18} className="text-red-600" />
            <span>
              {new Date(newsItem.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Article Content */}
          <p className="text-gray-700 leading-relaxed">{newsItem.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;