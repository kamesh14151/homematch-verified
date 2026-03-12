

## House Rental Verification Platform — Phase 1

### Design System Setup
- Apply the full custom color palette (Primary Blue #3A7AFE, Terracotta, Sand, Beige accents) with light and dark mode support
- Update CSS variables and Tailwind config for all brand colors
- Create reusable UI components: PropertyCard, FilterBar, StatCard, DashboardLayout with sidebar

### Landing Page
- **Hero section** with headline, subtitle, and property search bar (location, rent range, house type)
- **Features section** highlighting: Verified Landlords, Secure Documents, Smart Matching, Tenant Filtering
- **How It Works** section showing landlord and tenant workflows
- **CTA section** with sign-up prompt
- Responsive navbar with logo, navigation links, dark mode toggle, and Login/Register buttons

### Authentication (Supabase)
- **Registration page** with role selection (Landlord or Tenant)
- **Login page** with email/password (phone OTP ready for future Twilio setup)
- Role-based routing: landlords → landlord dashboard, tenants → tenant dashboard
- Supabase tables: `profiles` (name, phone, role reference), `user_roles` (secure role storage), `landlords` (PAN, address, pincode), `tenants` (occupation, company, family_size, expected_rent, preferred_location)
- RLS policies for secure data access

### Landlord Dashboard
- Sidebar navigation: Overview, Add Property, My Listings, Tenant Requests, Messages, Profile
- **Overview**: Stats cards (total properties, active listings, pending requests, messages)
- **Add Property**: Form with address, rent, house type, EB bill number, description, image upload, video URL, facilities (water, separate meter)
- **My Listings**: Table/grid of landlord's properties with status
- **Tenant Requests**: List of applications from tenants
- **Profile**: Landlord details with mock PAN verification badge

### Tenant Dashboard
- Sidebar navigation: Search Houses, Saved Houses, My Applications, Messages, Profile
- **Search Houses**: Property grid with smart filters (location, rent range, house type, family size)
- **Property Detail Page**: Image gallery, video embed, details, "Apply" and "Contact Landlord" buttons
- **Saved Houses**: Bookmarked properties
- **My Applications**: Track application status
- **Profile**: Tenant details form (occupation, company, family size, preferences)

### Database Schema (Supabase)
- `profiles`, `user_roles`, `landlords`, `tenants`, `properties`, `property_images`, `applications`, `saved_properties`
- RLS policies ensuring landlords manage only their properties, tenants see only their own applications
- Storage bucket for property images

### Pages & Routes
- `/` — Landing page
- `/login`, `/register` — Auth pages
- `/landlord/dashboard`, `/landlord/add-property`, `/landlord/listings`, `/landlord/requests`, `/landlord/profile`
- `/tenant/dashboard`, `/tenant/search`, `/tenant/saved`, `/tenant/applications`, `/tenant/profile`
- `/property/:id` — Property detail page

