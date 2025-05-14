import "@/assets/css/app.css";
import "@/assets/css/navbar-footer.css";
import "@/assets/css/vendor/bootstrap.min.css";
import "@/assets/css/vendor/owl.carousel.min.css";
import "@/assets/css/vendor/owl.theme.default.min.css";
import "@/assets/css/app.css";
import "@/assets/css/vendor/swiper-bundle.min.css";
import JavascriptClient from "@/Components/JavascriptClient/JavascriptClient";
import BackToTop from "@/Components/Shared/BackToTop/BackToTop";
import Footer from "@/Components/Shared/Footer/Footer";
import Navbar from "@/Components/Shared/Navbar/Navbar";
import Preloader from "@/Components/Shared/Preloader/Preloader";
import QuickViewContextProvider from "@/Utilities/Contexts/QuickViewContextProvider";
import UserContextProvider from "@/Utilities/Contexts/UserContextProvider";
import { Toaster } from "react-hot-toast"; // Import Toaster
import "./globals.css";
import CartContextProvider from "@/Utilities/Contexts/CartContextProvider";
import PlaceOrderContextProvider from "@/Utilities/Contexts/PlaceOrderContextProvider";
import FloatingCart from "@/Components/Shared/FloatingCart/FloatingCart";


export const metadata = {
  title: "ABC Computers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/abc-logo-icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <UserContextProvider>
          <CartContextProvider>
            <PlaceOrderContextProvider>
              <QuickViewContextProvider>
                <Navbar />
                {children}
                <Footer />
                <FloatingCart/>
                <BackToTop />
                <JavascriptClient />
                <Toaster />
                <Preloader />
              </QuickViewContextProvider>
            </PlaceOrderContextProvider>
          </CartContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
