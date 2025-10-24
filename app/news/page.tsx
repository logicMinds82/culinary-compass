"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar } from "lucide-react";

// Define the expected type for a news article
interface NewsArticle {
  id: number;
  title: string;
  image: string;
  date: string;
  summary: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/news?page=${page}`);
        if (!response.ok) throw new Error("Failed to fetch news");
        const data: { news: NewsArticle[]; totalPages: number } =
          await response.json();
        setNews(data.news);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
      setLoading(false);
    };

    fetchNews();
  }, [page]);

  return (
  <div className="w-full min-h-screen bg-background">
  <div className="mt-10 px-6 w-full max-w-7xl mx-auto pb-16 pt-10">
        <h1 className="text-4xl font-bold mb-12 text-foreground text-center">
          Latest in <span className="text-primary">Cooking & Recipes</span>
        </h1>

        {loading ? (
          <p className="text-center text-lg text-gray-500">Loading...</p>
        ) : (
          <>
            {/* News Grid (All Articles) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <Card
                  key={`article-${article.id}`}
                  className="bg-background-alt border border-border p-5 rounded-lg shadow-sm transition-transform transform hover:-translate-y-2 hover:shadow-md"
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover rounded mb-4"
                    priority={true}
                  />
                  {/* Date Badge */}
                  <div className="flex items-center space-x-2 bg-background-alt border border-border py-1.5 px-4 rounded-md text-sm text-muted-foreground shadow-sm w-fit mb-2">
                    <Calendar size={16} className="text-primary" />
                    <span>
                      {new Date(article.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h4 className="text-xl font-semibold text-primary mb-2">
                    {article.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    {article.summary}
                  </p>
                  <Link href={`/news/${article.id}`}>
                    <Button className="rounded-md px-6 py-2 text-sm font-semibold">
                      Read More
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={`pagination-${i + 1}`}
              onClick={() => setPage(i + 1)}
              variant={page === i + 1 ? "default" : "outline"}
              className={page === i + 1 ? "bg-primary text-white" : "bg-background-alt text-foreground hover:bg-primary hover:text-white"}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
