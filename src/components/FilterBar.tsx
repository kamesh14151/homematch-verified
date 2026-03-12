import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  showFilters?: boolean;
}

export function FilterBar({ onSearch, onFilterChange, showFilters = true }: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by location, address..."
            className="pl-10"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        {showFilters && (
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <Select onValueChange={(v) => onFilterChange?.({ houseType: v })}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="House Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="1bhk">1 BHK</SelectItem>
              <SelectItem value="2bhk">2 BHK</SelectItem>
              <SelectItem value="3bhk">3 BHK</SelectItem>
              <SelectItem value="4bhk">4 BHK</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => onFilterChange?.({ rentRange: v })}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Rent Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="0-10000">Under ₹10,000</SelectItem>
              <SelectItem value="10000-20000">₹10,000 – ₹20,000</SelectItem>
              <SelectItem value="20000-30000">₹20,000 – ₹30,000</SelectItem>
              <SelectItem value="30000+">₹30,000+</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => onFilterChange?.({ familySize: v })}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Family Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Size</SelectItem>
              <SelectItem value="1-2">1–2 Members</SelectItem>
              <SelectItem value="3-4">3–4 Members</SelectItem>
              <SelectItem value="5+">5+ Members</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
