import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type InfoPageProps = {
  title: string;
  subtitle: string;
  intro: string;
  bullets: string[];
  ctaLabel?: string;
  ctaLink?: string;
};

function InfoPageTemplate({ title, subtitle, intro, bullets, ctaLabel, ctaLink = "/register" }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{subtitle}</p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>

          <Card className="mt-8 border">
            <CardContent className="p-5 sm:p-7">
              <h2 className="mb-4 text-lg font-semibold">How it works</h2>
              <div className="space-y-3">
                {bullets.map((point) => (
                  <div key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {ctaLabel && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to={ctaLink}>{ctaLabel} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export function ForTenantsPage() {
  return (
    <InfoPageTemplate
      title="For Tenants"
      subtitle="Tenant Journey"
      intro="RentVerify helps tenants discover verified homes, avoid fraud, and apply with confidence."
      bullets={[
        "Create your tenant profile with budget, location and move-in timeline.",
        "Browse verified listings and compare rent, amenities, and locality details.",
        "Shortlist properties, connect with owners, and schedule visits quickly.",
        "Submit your application and documents through a secure flow.",
        "Track application status and move into your new home faster.",
      ]}
      ctaLabel="Start as Tenant"
    />
  );
}

export function ForOwnersPage() {
  return (
    <InfoPageTemplate
      title="For Owners"
      subtitle="Owner Journey"
      intro="RentVerify enables owners to list properties, screen tenants, and close rentals faster with better trust."
      bullets={[
        "Create your owner account and complete profile verification.",
        "Post property details, photos, rent expectations, and house rules.",
        "Receive tenant applications with transparent profile information.",
        "Screen applicants, chat securely, and finalize suitable tenants.",
        "Manage listings and requests from one simple dashboard.",
      ]}
      ctaLabel="Post Property Free"
    />
  );
}

export function AboutUsPage() {
  return (
    <InfoPageTemplate
      title="About Us"
      subtitle="RentVerify"
      intro="RentVerify is a rental trust platform focused on reducing fraud and improving transparency for landlords and tenants in India."
      bullets={[
        "Built for secure, verified house rentals.",
        "Designed to simplify discovery, verification, and communication.",
        "Focused on practical workflows for tenants and owners.",
      ]}
    />
  );
}

export function OurServicesPage() {
  return (
    <InfoPageTemplate
      title="Our Services"
      subtitle="Platform Services"
      intro="We provide end-to-end services for rental search, listing, and screening so both sides can transact confidently."
      bullets={[
        "Verified rental listings and owner profile checks.",
        "Tenant profile and application flow.",
        "Secure chat and property discovery tools.",
        "Role-based dashboards for owners and tenants.",
      ]}
    />
  );
}

export function PriceTrendsPage() {
  return (
    <InfoPageTemplate
      title="Price Trends"
      subtitle="Rental Intelligence"
      intro="Price trend insights help users compare neighborhoods and make better rental decisions."
      bullets={[
        "Track average rent range across localities.",
        "Compare property type and furnishing impact on rent.",
        "Use trend direction to shortlist value-for-money areas.",
      ]}
    />
  );
}

export function PostPropertyFreePage() {
  return (
    <InfoPageTemplate
      title="Post Property Free"
      subtitle="Owner Action"
      intro="List your property in minutes and start receiving tenant applications without upfront listing fees."
      bullets={[
        "Create listing with complete property details.",
        "Upload quality photos and pricing expectations.",
        "Publish and start receiving tenant responses.",
      ]}
      ctaLabel="Create Listing"
    />
  );
}

export function ArticlesPage() {
  return (
    <InfoPageTemplate
      title="Articles"
      subtitle="Guides"
      intro="Our articles cover rental best practices, legal awareness, and tips for safer home renting."
      bullets={[
        "Tenant checklist before finalizing rental.",
        "Owner tips to reduce vacancy and improve trust.",
        "Documentation and safety guidance for both roles.",
      ]}
    />
  );
}

export function SitemapPage() {
  return (
    <InfoPageTemplate
      title="Sitemap"
      subtitle="Navigation"
      intro="Quick map of important sections available on RentVerify."
      bullets={[
        "Home, search and property detail pages.",
        "Owner and tenant onboarding pages.",
        "Authentication and dashboard sections.",
        "Policy and company information pages.",
      ]}
    />
  );
}

export function CompanyPage() {
  return (
    <InfoPageTemplate
      title="Company"
      subtitle="Organization"
      intro="Company information and operational commitments behind RentVerify."
      bullets={[
        "Product mission and customer-first principles.",
        "Security and privacy-focused design.",
        "Transparent communication and support.",
      ]}
    />
  );
}

export function AboutAJStudiozPage() {
  return (
    <InfoPageTemplate
      title="About AJ STUDIOZ"
      subtitle="Technology Partner"
      intro="AJ STUDIOZ designs and builds production-grade digital products with modern engineering and UI standards."
      bullets={[
        "Product strategy, UX, and full-stack implementation.",
        "Performance-driven, responsive web platforms.",
        "Long-term support and iterative enhancement.",
      ]}
    />
  );
}

export function ContactUsPage() {
  return (
    <InfoPageTemplate
      title="Contact Us"
      subtitle="Support"
      intro="Need help with listing, account setup, or verification? Our support team is available to assist you."
      bullets={[
        "Email support at support@rentverify.in.",
        "Call support for urgent assistance.",
        "Use in-app flows for onboarding and listing queries.",
      ]}
    />
  );
}

export function CareersPage() {
  return (
    <InfoPageTemplate
      title="Careers"
      subtitle="Join Us"
      intro="We are building reliable rental technology and are always looking for ambitious contributors."
      bullets={[
        "Work on product, engineering, and operations.",
        "Build meaningful tools for real rental users.",
        "Grow with a fast-moving, quality-focused team.",
      ]}
    />
  );
}

export function TermsAndConditionsPage() {
  return (
    <InfoPageTemplate
      title="Terms & Conditions"
      subtitle="Legal"
      intro="Terms define how users can use RentVerify services responsibly and safely."
      bullets={[
        "Use accurate information while creating accounts and listings.",
        "Respect platform safety and communication standards.",
        "Avoid prohibited, misleading, or fraudulent activities.",
      ]}
    />
  );
}

export function PrivacyPolicyPage() {
  return (
    <InfoPageTemplate
      title="Privacy Policy"
      subtitle="Data Protection"
      intro="RentVerify is committed to responsible data handling and secure processing practices."
      bullets={[
        "Collect only essential data for account and rental workflows.",
        "Protect personal information with secure systems.",
        "Use data to improve trust, experience, and platform reliability.",
      ]}
    />
  );
}

export function SafetyGuidePage() {
  return (
    <InfoPageTemplate
      title="Safety Guide"
      subtitle="Trust & Safety"
      intro="Follow safety recommendations to avoid fraud and ensure safe rental transactions."
      bullets={[
        "Verify identity and property details before payment.",
        "Use platform communication channels where possible.",
        "Avoid sharing sensitive documents outside secure flow.",
        "Report suspicious behavior immediately.",
      ]}
    />
  );
}
