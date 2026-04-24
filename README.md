# NABA GOLD Karigar

NABA GOLD Karigar is a modern, responsive web application for a gold manufacturing business based in Kalyan, Mumbai. It exclusively focuses on 22K gold jewelry, featuring a live product catalog, real-time gold market rates, a customer review system, and a comprehensive admin dashboard for managing stock and settings.

## 🚀 Tech Stack

- **Frontend Framework:** React 19 with Vite
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router DOM (v7)
- **State Management & Backend:** Supabase (PostgreSQL, Realtime, Storage)
- **Animations:** Framer Motion (v12)
- **Icons:** Lucide React
- **Language:** TypeScript

## ✨ Core Features

1.  **Live 22K Gold Rate Ticker:**
    *   Automatically fetches the live market rate using two free, no-key APIs:
        *   `freegoldapi.com` (Spot gold price in USD/Troy Ounce)
        *   `api.frankfurter.app` (Live USD to INR exchange rate)
    *   Calculates the 22K INR per gram rate dynamically.
    *   **Admin Override:** The admin can set a custom rate via the dashboard, which overrides the market rate instantly across all clients using Supabase Realtime subscriptions.
2.  **Product Catalog:**
    *   Displays 22K gold jewelry with pricing calculated dynamically based on the current gold rate, item weight, and making charges (flat or percentage).
    *   Filtering by category (Necklace, Ring, Bangle, Earring, Set) and sorting options (price, weight, popularity, newest).
    *   Infinite scrolling/pagination using Intersection Observer.
3.  **WhatsApp Integration:**
    *   "Enquire on WhatsApp" button in the product details modal automatically pre-fills a message with the product name, weight, and the user's name/phone number.
4.  **Admin Dashboard (`/admin`):**
    *   **Authentication:** Supabase Auth (Email/Password).
    *   **Dashboard:** Set global gold rate, update the homepage hero slider config, and upload a custom brand logo.
    *   **Catalog Management:** Full CRUD for products, image uploading to Supabase Storage, stock management (quantity, in/out of stock toggle), and hiding products.
    *   **Reviews Management:** Approve, edit, or delete customer reviews before they appear publicly.
    *   **Audit Logs:** Tracks every admin action (who, what, when) for accountability.

## 🛠️ Project Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Configuration
To fully replicate the backend, run the provided SQL script in your Supabase SQL Editor.

1.  Open the `supabase-schema.sql` file located in the root of the project.
2.  Copy its contents and paste them into the Supabase SQL Editor.
3.  Run the query. This script is idempotent and handles:
    *   Creating all tables (`products`, `reviews`, `settings`, `audit_logs`).
    *   Enabling Row Level Security (RLS) on all tables.
    *   Creating necessary indexes for performance.
    *   Seeding the `settings` table with a default configuration.
4.  **Manual Step (Crucial):** Create a public storage bucket named `assets` in the Supabase Storage dashboard.
5.  After the bucket is created, the SQL script includes policies that manage public read access and authenticated admin write access for this bucket.

### 4. Run the Development Server
```bash
npm run dev
```

## 🗄️ Database Schema Summary

*   **`products`:** `id`, `title`, `description`, `weightInGrams`, `makingCharge`, `chargeType` ('flat' or 'percentage'), `goldKarat` (default '22K'), `images` (array of URLs), `category`, `isHidden`, `isOutofStock`, `stockQuantity`, `popularityScore`.
*   **`reviews`:** `id`, `customerName`, `rating` (1-5), `comment`, `isApproved`.
*   **`settings`:** `id` (primary key, typically 'goldRate'), `rate22k` (admin override rate), `logoUrl`, `homeConfig` (JSON representing hero slides).
*   **`audit_logs`:** `id`, `admin_email`, `action`, `details`, `created_at`.

## 🎨 Asset Management

*   **Static Assets:** The default fallback logo (`naba-logo.png`) resides in the `/public` directory.
*   **Dynamic Assets:** User-uploaded product images and admin-uploaded logos are stored in the Supabase `assets` bucket. The application automatically falls back to static assets if dynamic ones are unavailable.
