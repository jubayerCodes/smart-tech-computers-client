import Home from "@/Pages/WebsitePages/Home/Home";
import "@/assets/css/home.css";

export const metadata = {
  title: "Product Details - My Store",
  description: "Find the best products with detailed specifications.",
  keywords: "electronics, gadgets, online store",
  openGraph: {
    title: "Product Details - My Store",
    description: "Find the best products with detailed specifications.",
    images: "/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Details - My Store",
    description: "Find the best products with detailed specifications.",
    images: "/og-image.jpg",
  },
}

export default function HomePage() {
  return <Home />;
}
