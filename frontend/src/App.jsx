// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import Navbar from "./components/navBar";
import { PopupProvider } from "./components/PopupContext";
import ScrollToTop from "./components/ScrolltoTop";
import Footer from "./components/footer";
import Bestsellers from "./section/BestSeller";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import ProductsPage from "./pages/ProductPage";
import ComingSoon from "./pages/comming-soon";
import ProductDetail from "./pages/ProductDetails";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicies";
import TermsOfService from "./pages/TermofServices";
import SearchPage from "./pages/SearchPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccessPage";

export default function App() {
  return (
    <>
      <PopupProvider>
        <ScrollToTop />

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop-all" element={<ProductsPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/refund-Policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/t&c" element={<TermsOfService />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<ComingSoon />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          {/* Add other routes here as needed */}
        </Routes>
        <Footer />
      </PopupProvider>
    </>
  );
}
