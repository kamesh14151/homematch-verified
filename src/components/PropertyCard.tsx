import React from "react";
import {
  MapPin,
  Home,
  IndianRupee,
  Heart,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  rent: number;
  houseType: string;
  imageUrl?: string;
  images?: string[]; // Adding support for multiple images
  verified?: boolean;
  isSaved?: boolean;
  onSave?: () => void;
}

export function PropertyCard({
  id,
  title,
  address,
  rent,
  houseType,
  imageUrl,
  images,
  verified,
  isSaved,
  onSave,
}: PropertyCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const displayImages =
    images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/property/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} - ₹${rent.toLocaleString("en-IN")}/month`,
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Property link copied to clipboard.",
      });
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayImages.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + displayImages.length) % displayImages.length
      );
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/property/${id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/property/${id}`);
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-[0_20px_50px_-36px_rgba(91,71,56,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-24px_rgba(91,71,56,0.42)] dark:border-white/8 dark:bg-zinc-950/88 dark:shadow-[0_24px_70px_-42px_rgba(0,0,0,0.9)] dark:hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.75)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {displayImages.length > 0 ? (
          <img
            src={displayImages[currentImageIndex]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Home className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Navigation Arrows (Visible on hover if multiple images) */}
        {displayImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7 rounded-full bg-white/90 text-slate-800 shadow backdrop-blur-md hover:scale-105 hover:bg-white dark:bg-zinc-950/80 dark:text-zinc-200 dark:hover:bg-zinc-900"
              onClick={prevImage}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7 rounded-full bg-white/90 text-slate-800 shadow backdrop-blur-md hover:scale-105 hover:bg-white dark:bg-zinc-950/80 dark:text-zinc-200 dark:hover:bg-zinc-900"
              onClick={nextImage}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        )}

        {/* Carousel Indicators */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  i === currentImageIndex
                    ? "bg-white scale-110 shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

        {verified && (
          <div className="absolute left-3 top-3 z-20">
            <VerifiedBadge type="property" showText className="bg-white/95 px-2.5 py-1 text-[11px] shadow-sm backdrop-blur-md dark:bg-zinc-950/90 border-transparent" />
          </div>
        )}
        <div className="absolute right-3 top-3 flex gap-2">
          <Button
            type="button"
            aria-label="Share property"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:scale-105 hover:text-slate-900 dark:bg-zinc-950/80 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          {onSave && (
            <Button
              type="button"
              aria-label={isSaved ? "Remove from saved" : "Save property"}
              aria-pressed={!!isSaved}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:scale-105 dark:bg-zinc-950/80 dark:hover:bg-zinc-900"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave();
              }}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isSaved ? "fill-primary text-primary" : "text-slate-700 dark:text-zinc-300"
                }`}
              />
            </Button>
          )}
        </div>
      </div>
      <CardContent className="p-4 sm:p-5">
        <div className="mb-1.5 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-[17px] font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
        </div>
        <div className="mb-3 flex items-center gap-1 text-[13px] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1 font-medium">{address}</span>
        </div>

        {/* Scannable info tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:bg-zinc-900 dark:text-zinc-300 dark:border dark:border-white/8"
          >
            {houseType}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:bg-zinc-900 dark:text-zinc-300 dark:border dark:border-white/8"
          >
            Available Now
          </Badge>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div>
            <div className="flex items-baseline gap-0.5 text-xl font-bold tracking-tight text-foreground">
              <IndianRupee className="h-4 w-4 self-center" />
              <span>{rent.toLocaleString("en-IN")}</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              per month
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
