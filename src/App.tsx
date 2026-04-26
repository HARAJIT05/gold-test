/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import PrivateCatalog from "./pages/PrivateCatalog";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCatalog from "./pages/admin/AdminCatalog";
import AdminPrivateCatalog from "./pages/admin/AdminPrivateCatalog";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminCategories from "./pages/admin/AdminCategories";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogue" element={<Catalog />} />
        <Route path="private-catalogue" element={<PrivateCatalog />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="about" element={<About />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsAndConditions />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />
      
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="catalogue" element={<AdminCatalog />} />
        <Route path="private-catalogue" element={<AdminPrivateCatalog />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="logs" element={<AdminLogs />} />
      </Route>
    </Routes>
    </>
  );
}
