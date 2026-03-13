import { MapPin, Home, IndianRupee, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  rent: number;
  houseType: string;
  imageUrl?: string;
  verified?: boolean;
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
  onSave,
}: PropertyCardProps) {
  const navigate = useNavigate();

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
      className="group cursor-pointer overflow-hidden border-[#dfe5ef] bg-white shadow-[0_8px_20px_rgba(0,51,102,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,51,102,0.12)] dark:border-[#24476b] dark:bg-card"
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
          <Badge className="absolute left-3 top-3 rounded-full bg-brand-yellow px-3 py-1 text-[12px] font-semibold text-[#171717] shadow-sm">Verified</Badge>
        )}
        {onSave && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave();
            }}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        )}
      </div>
      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-[22px] font-semibold leading-tight tracking-tight text-brand-primary dark:text-primary sm:text-[26px]">{title}</h3>
          <Badge variant="secondary" className="shrink-0 rounded-full bg-[#f4f6f8] text-brand-text-muted dark:bg-muted dark:text-muted-foreground">{houseType}</Badge>
        </div>
        <div className="mb-4 flex items-center gap-1 text-[15px] text-brand-text-muted dark:text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{address}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-background-secondary px-3 py-2">
          <div className="flex items-center gap-1 text-[28px] font-semibold leading-none text-brand-primary dark:text-brand-yellow sm:text-[34px]">
            <IndianRupee className="h-4 w-4" />
            <span>{rent.toLocaleString("en-IN")}</span>
            <span className="text-sm font-normal text-brand-text-muted dark:text-muted-foreground">/month</span>
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-text-muted dark:text-muted-foreground">Curated listing</span>
        </div>
      </CardContent>
    </Card>
  );
}
