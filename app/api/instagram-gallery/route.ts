import { NextResponse } from "next/server";

// Mocked Instagram gallery data
const instagramGallery = [
  {
    id: 1,
    image: "/images/instagram/1.jpg",
    title: "Freshly Baked Bread",
    url: "https://instagram.com/",
  },
  {
    id: 2,
    image: "/images/instagram/2.jpg",
    title: "Delicious Homemade Pizza",
    url: "https://instagram.com/",
  },
  {
    id: 3,
    image: "/images/instagram/3.jpg",
    title: "Colorful Veggie Salad",
    url: "https://instagram.com/",
  },
  {
    id: 4,
    image: "/images/instagram/4.jpg",
    title: "Classic Spaghetti Carbonara",
    url: "https://instagram.com/",
  },
  {
    id: 5,
    image: "/images/instagram/5.jpg",
    title: "Chocolate Cake Delight",
    url: "https://instagram.com/",
  },
  {
    id: 6,
    image: "/images/instagram/6.jpg",
    title: "Hearty Breakfast Spread",
    url: "https://instagram.com/",
  }
];

export async function GET() {
  return NextResponse.json(instagramGallery);
}
