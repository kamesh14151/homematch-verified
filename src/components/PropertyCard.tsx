import { MapPin, Home, IndianRupee, Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  verified,
  isSaved,
  onSave,
}: PropertyCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/property/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title} - ₹${rent.toLocaleString("en-IN")}/month`, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Property link copied to clipboard." });
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
      className="group cursor-pointer overflow-hidden border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Home className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {verified && (
          <Badge className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[12px] font-semibold text-primary-foreground shadow-sm">Verified</Badge>
        )}
        <div className="absolute right-2 top-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave();
              }}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      <CardContent className="p-4 sm:p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg">{title}</h3>
          <Badge variant="secondary" className="shrink-0 rounded-full text-xs">{houseType}</Badge>
        </div>
        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{address}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-1 text-xl font-semibold leading-none text-foreground sm:text-2xl">
            <IndianRupee className="h-4 w-4" />
            <span>{rent.toLocaleString("en-IN")}</span>
            <span className="text-xs font-normal text-muted-foreground">/month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
