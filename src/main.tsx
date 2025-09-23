import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CareGuide from "./pages/CareGuide"; // care guide page
import About from "./pages/About"; // new about page
import "./index.css";
import ContactPage from "./pages/Contact";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<App />} />

        {/* Care Guide Page */}
        <Route path="/care-guide" element={<CareGuide />} />

        {/* About Page */}
        <Route path="/about" element={<About />} />

        {/* Contact Page */}
        <Route path="/contact" element={<ContactPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
