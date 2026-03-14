<h1 align="center">
  <img src="public/1000130925-Photoroom.png" alt="RentVerify" width="64" height="64" /><br/>
  RentVerify
</h1>

<p align="center">
  <strong>Secure House Rental Verification & Matching Platform for India</strong><br/>
  Connect verified landlords and tenants. Encrypted documents. Smart matching.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-latest-000000?logo=shadcnui&logoColor=white" />
</p>

---

## 🏠 About RentVerify

**RentVerify** is a full-stack, production-ready SaaS rental marketplace that solves India's rental trust problem. Every landlord is verified through PAN checks, tenant documents are encrypted and auto-deleted after 30 days, and an AI-powered smart matching engine connects the right tenants with the right properties.

Built with modern corporate SaaS architecture to look and feel like a real startup product — think Airbnb meets Zillow, tailored for the Indian market.

---

## ✨ Features

### 🏡 For Landlords
- Register and verify identity via PAN (API SETU integration)
- Add property listings with images, video, rent, and description
- Smart filtering of tenants by occupation, company, family size
- Manage applications and communicate with tenants via in-app messages

### 👤 For Tenants
- Register with ID proof upload (encrypted storage)
- Set preferences: location, rent budget, house type, family size
- Search and filter verified properties on an interactive map
- Apply to properties and track application status
- Save favourite listings

### 🔐 Trust & Security
- PAN-verified landlords only
- AES-256 encrypted document storage via Supabase Storage
- Documents automatically deleted after 30 days
- JWT-based session management with Row-Level Security
- HTTPS enforced; signed upload URLs

### 🤖 Smart Matching
- Tenant–property recommendations based on:
  - Location preference & pincode
  - Budget vs listed rent
  - Family size & house type
  - Occupation compatibility

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| UI Components | shadcn/ui (Radix UI) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| State / Cache | TanStack React Query |
| Form Validation | React Hook Form + Zod |
| Routing | React Router DOM v6 |
| Authentication | Supabase Auth (email/password + OAuth) |
| Database | Supabase (PostgreSQL + RLS) |
| Storage | Supabase Storage (signed URLs) |
| Testing | Vitest + Playwright |
| Linting | ESLint + TypeScript strict |
| Font | Bunderon (local, `/public/bunderon-font/`) |

---

## 📁 Project Structure

```
homematch-verified/
├── public/
│   ├── 1000130925-Photoroom.png   # Brand logo / favicon
│   ├── bunderon-font/             # Local brand font
│   └── favicon.ico
├── src/
│   ├── assets/                    # Static assets (hero images)
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   ├── DashboardLayout.tsx    # Shared sidebar layout
│   │   ├── FilterBar.tsx          # Property filter bar
│   │   ├── Navbar.tsx             # Top navigation
│   │   ├── PropertyCard.tsx       # Listing card
│   │   ├── ProtectedRoute.tsx     # Auth guard
│   │   ├── StatCard.tsx           # Dashboard stat widget
│   │   └── ThemeToggle.tsx        # Light/dark mode
│   ├── contexts/
│   │   └── AuthContext.tsx        # Auth state provider
│   ├── hooks/                     # Custom React hooks
│   ├── integrations/              # Supabase client integrations
│   ├── lib/
│   │   └── utils.ts               # Utility helpers
│   ├── pages/
│   │   ├── Index.tsx              # Landing page
│   │   ├── Login.tsx              # Email login
│   │   ├── Register.tsx           # Registration + role selection
│   │   ├── PropertyDetail.tsx     # Full property view
│   │   ├── NotFound.tsx           # 404 page
│   │   ├── landlord/
│   │   │   ├── Dashboard.tsx      # Landlord overview
│   │   │   ├── AddProperty.tsx    # Add new listing
│   │   │   ├── Listings.tsx       # Manage listings
│   │   │   ├── Requests.tsx       # Tenant applications
│   │   │   ├── Messages.tsx       # Messaging
│   │   │   └── Profile.tsx        # Landlord profile
│   │   └── tenant/
│   │       ├── Dashboard.tsx      # Tenant overview
│   │       ├── SavedHouses.tsx    # Saved listings
│   │       ├── Applications.tsx   # Submitted applications
│   │       ├── Messages.tsx       # Messaging
│   │       └── Profile.tsx        # Tenant profile
│   ├── App.tsx                    # Root router
│   ├── index.css                  # Global styles + Bunderon font
│   └── main.tsx                   # App entry point
├── supabase/                      # Supabase config & migrations
├── index.html                     # HTML shell + favicon + meta
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🗄 Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('landlord', 'tenant')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Landlords
CREATE TABLE landlords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pan_number TEXT,
  pan_verified BOOLEAN DEFAULT FALSE,
  address TEXT,
  pincode TEXT
);

-- Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  occupation TEXT,
  company TEXT,
  family_size INTEGER,
  expected_rent INTEGER,
  preferred_location TEXT
);

-- Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES landlords(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  rent INTEGER NOT NULL,
  house_type TEXT,
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Images
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);

-- Documents (encrypted, auto-delete after 30 days)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT,
  file_url TEXT,
  encrypted BOOLEAN DEFAULT TRUE,
  auto_delete_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier)

### 1. Clone & Install

```bash
git clone https://github.com/kamesh14151/homematch-verified.git
cd homematch-verified
npm install
```

### 2. Configure Environment

Copy `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite HMR) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests (Vitest) |
| `npm run lint` | ESLint type-checked lint |
| `npm run mobile:sync` | Sync web assets + plugins to native projects |
| `npm run mobile:build` | Build web app and sync both Android + iOS |
| `npm run mobile:android` | Build + sync Android and open Android Studio |
| `npm run mobile:ios` | Build + sync iOS and open Xcode |

---

## 📱 Android & iOS App Setup (Capacitor)

This project is now configured with Capacitor and includes native shells for both platforms:

- `android/` for Android Studio
- `ios/` for Xcode
- `capacitor.config.ts` with:
  - `appId`: `com.rentverify.app`
  - `appName`: `RentVerify`
  - `webDir`: `dist`

### Build and Sync

```bash
npm run mobile:build
```

### Open Android Project

```bash
npm run mobile:android
```

### Open iOS Project

```bash
npm run mobile:ios
```

> Note: iOS builds require macOS with Xcode. You can keep the iOS project in git from Windows, then open and archive it on a Mac.

---

## 🌐 Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Landing page | Public |
| `/login` | Email login | Public |
| `/register` | Sign up + role selection | Public |
| `/property/:id` | Property detail | Public |
| `/landlord/dashboard` | Landlord overview | Landlord |
| `/landlord/add-property` | Add new listing | Landlord |
| `/landlord/listings` | Manage properties | Landlord |
| `/landlord/requests` | Tenant applications | Landlord |
| `/landlord/messages` | Messaging | Landlord |
| `/landlord/profile` | Profile settings | Landlord |
| `/tenant/dashboard` | Tenant overview | Tenant |
| `/tenant/saved` | Saved properties | Tenant |
| `/tenant/applications` | My applications | Tenant |
| `/tenant/messages` | Messaging | Tenant |
| `/tenant/profile` | Profile settings | Tenant |

---

## 🔒 Security

- **Authentication**: Supabase Auth with JWT sessions
- **Row Level Security**: All database tables protected with RLS policies
- **Document Encryption**: AES-256 via Supabase Storage
- **Signed URLs**: All file uploads use time-limited signed URLs
- **Auto-delete**: Documents purged after 30 days via scheduled Supabase Edge Function
- **Input Validation**: Zod schemas on all form inputs

---

## 🎨 Design System

- **Font**: Bunderon (local, applied to brand name)
- **Primary**: `#3A7AFE` (blue)
- **Accent**: `#C46A4A` (terracotta)
- **Success**: `#28C76F` | **Warning**: `#F4A340` | **Error**: `#E5484D`
- **Light / Dark mode** toggle via `next-themes`
- Built on **shadcn/ui** + **Radix UI** for full accessibility

---

## 🚢 Deployment

### Vercel (Frontend)

```bash
npm run build
# Push to GitHub → connect repo to Vercel
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel dashboard
```

### Supabase (Backend / DB / Storage)

1. Create a new Supabase project
2. Run the SQL schema above in the SQL editor
3. Create storage buckets: `property-images`, `property-videos`, `tenant-documents`
4. Enable Row Level Security on all tables
5. Set up an Edge Function for document auto-deletion (30-day cron)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add smart matching"`
4. Push and open a PR

---

## 📄 License

MIT © 2026 RentVerify

---

<p align="center">
  <img src="public/1000130925-Photoroom.png" alt="RentVerify" width="40" />&nbsp;&nbsp;
  <strong>Crafted with ❤️ by <a href="https://ajstudioz.com">AJ STUDIOZ</a></strong><br/>
  <sub>Building production-grade products for India's digital future</sub>
</p>
