import { NextRequest, NextResponse } from "next/server";


  
  const mockNews = [
    {
      id: 1,
      title: "5 Essential Cooking Techniques for Perfect Dishes",
      summary: "Discover the key methods to take your cooking skills to the next level.",
      content:
        "Cooking is both an art and a science. From mastering knife skills to perfecting pan sauces, these techniques form the foundation of any great dish. Learn how to apply them efficiently to elevate your everyday meals.",
      image: "/images/news/1.jpg",
      date: "2025-01-15T10:00:00Z",
    },
    {
      id: 2,
      title: "The Science of Baking: Achieving Fluffy Cakes & Crispy Cookies",
      summary: "Baking is all about chemistry—learn how to get consistent results.",
      content:
        "Understanding ratios, leavening agents, and oven temperatures is crucial for top-quality baked goods. Discover why precise measurements matter and how to troubleshoot common baking mishaps like sinking cakes or overcooked cookies.",
      image: "/images/news/2.jpg",
      date: "2025-01-10T12:30:00Z",
    },
    {
      id: 3,
      title: "Meal Prepping 101: Save Time & Eat Healthier",
      summary: "Plan, prep, and cook your meals in advance for stress-free weekdays.",
      content:
        "Meal prepping is a lifesaver for busy people who still want homemade meals. Learn how to create balanced menus, store food safely, and maintain freshness throughout the week without compromising flavor or nutrients.",
      image: "/images/news/3.jpg",
      date: "2025-01-05T15:45:00Z",
    },
    {
      id: 4,
      title: "Cooking with Seasonal Ingredients: The Ultimate Guide",
      summary: "Harness the peak flavors of each season for delicious recipes.",
      content:
        "Cooking with in-season produce not only boosts flavor but can also save money. This guide covers how to source the freshest ingredients, plus creative recipe ideas for each season—from spring peas to autumn squash.",
      image: "/images/news/4.jpg",
      date: "2025-12-20T09:15:00Z",
    },
    {
      id: 5,
      title: "Why Hydration Matters in the Kitchen",
      summary: "Stay hydrated while cooking to keep energy levels high.",
      content:
        "Cooking can be surprisingly dehydrating. Standing near a hot stove or oven for hours drains your fluids. Learn practical tips for drinking enough water throughout your cooking session and how hydration affects taste perception.",
      image: "/images/news/5.jpg",
      date: "2025-12-10T14:00:00Z",
    },
    {
      id: 6,
      title: "From Pantry to Plate: Making the Most of Leftovers",
      summary: "Transform yesterday’s dinner into a brand-new dish.",
      content:
        "Leftover food is a hidden treasure. Discover how to reinvent leftover chicken into hearty soups or salads, turn stale bread into puddings or croutons, and reduce kitchen waste with smart storage and meal-planning techniques.",
      image: "/images/news/6.jpg",
      date: "2025-12-01T11:00:00Z",
    },
    {
      id: 7,
      title: "How to Stay Motivated in the Kitchen",
      summary: "Rediscover joy and creativity when cooking feels like a chore.",
      content:
        "Cooking ruts happen to everyone. From trying new cuisines to enrolling in virtual cooking classes, explore practical ways to keep yourself inspired, break monotony, and fall in love with home-cooking all over again.",
      image: "/images/news/7.jpg",
      date: "2025-11-25T08:30:00Z",
    },
    {
      id: 8,
      title: "Are Kitchen Gadgets Worth It? What Every Cook Should Know",
      summary: "Do air fryers, instant pots, and sous vide machines really help?",
      content:
        "Kitchen gadgets can simplify meal prep—but they can also clutter your cabinets. Discover which trending devices are genuinely useful, how they work, and whether they deserve a spot on your countertop.",
      image: "/images/news/8.jpg",
      date: "2025-11-15T14:20:00Z",
    },
    {
      id: 9,
      title: "Boost Your Morning Routine with Quick & Healthy Breakfasts",
      summary: "Start your day off right with nutritious, easy-to-make meals.",
      content:
        "Busy mornings don’t have to mean skipping breakfast. Learn how to prepare grab-and-go breakfasts, overnight oats, and smoothie packs that fuel your day without sacrificing taste or nutrition.",
      image: "/images/news/9.jpg",
      date: "2025-11-05T17:10:00Z",
    },
    {
      id: 10,
      title: "Why Everyone Should Learn Basic Knife Skills",
      summary: "The foundation of cooking starts with proper knife handling.",
      content:
        "Knife skills drastically reduce prep time and enhance safety. From choosing the right blade to practicing essential cuts like julienne and chiffonade, this article breaks down how to handle knives confidently for all your culinary adventures.",
      image: "/images/news/10.jpg",
      date: "2025-10-30T13:45:00Z",
    },
  ];
  

  export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
  
    if (id) {
      const article = mockNews.find((article) => article.id === Number(id));
      if (article) {
        return NextResponse.json(article);
      } else {
        return NextResponse.json({ message: "Article not found" }, { status: 404 });
      }
    }
  
    // Current pagination logic if no ID provided
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = 6;
  
    const paginatedNews = mockNews.slice((page - 1) * pageSize, page * pageSize);
  
    return NextResponse.json({
      news: paginatedNews,
      totalPages: Math.ceil(mockNews.length / pageSize),
    });
  }
  