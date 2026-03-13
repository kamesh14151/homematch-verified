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
      className="group cursor-pointer overflow-hidden transition-all hover:bg-card-hover hover:shadow-lg"
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
          <Badge className="absolute left-3 top-3 bg-success text-success-foreground">Verified</Badge>
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
      <CardContent className="p-4">
        <h3 className="mb-1 font-semibold line-clamp-1">{title}</h3>
        <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{address}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-lg font-bold text-primary">
            <IndianRupee className="h-4 w-4" />
            <span>{rent.toLocaleString("en-IN")}</span>
            <span className="text-xs font-normal text-muted-foreground">/month</span>
          </div>
          <Badge variant="secondary">{houseType}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
