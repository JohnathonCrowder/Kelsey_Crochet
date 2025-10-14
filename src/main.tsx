import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CareGuide from "./pages/CareGuide"; // care guide page
import About from "./pages/About"; // about page
import ContactPage from "./pages/Contact"; // contact page
import GalleryPage from "./pages/Gallery"; // gallery page
import Shop from "./pages/Shop"; // shop page
import ShippingReturns from "./pages/ShippingReturns"; // shipping & returns page
import Terms from "./pages/Terms"; // terms & conditions page
import ProductPage from "./pages/Product";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<App />} />

        {/* Standalone Pages */}
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
