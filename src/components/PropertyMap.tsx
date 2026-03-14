import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Home } from "lucide-react";

// Fix Leaflet marker icons via URLs directly from unpkg to avoid local path issues
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// A custom HTML icon for modern property pins
const createPriceIcon = (price: number | string, selected = false) => {
  return L.divIcon({
    className: "custom-price-marker",
    html: selected
      ? `<div class="bg-zinc-900 text-white font-bold px-3 py-1.5 rounded-full shadow-xl text-xs whitespace-nowrap border-2 border-white scale-110 ring-2 ring-primary">₹${price}</div>`
      : `<div class="bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-full shadow-md text-xs whitespace-nowrap border-2 border-background">₹${price}</div>`,
    iconSize: [undefined, undefined] as any,
    iconAnchor: [30, 15],
  });
};

const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div class="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg ring-4 ring-blue-500/30"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

type MapListing = {
  id: string;
  title: string;
  rent: number;
  image?: string;
  lat: number;
  lng: number;
};

// Auto-center map helper
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function PropertyMap({
  listings,
  center = [12.9716, 77.5946], // Default to Bangalore coordinates
  zoom = 12,
  selectedId,
  userMarker,
  onMarkerClick,
}: {
  listings: MapListing[];
  center?: [number, number];
  zoom?: number;
  selectedId?: string;
  userMarker?: [number, number];
  onMarkerClick?: (id: string) => void;
}) {
  const mapRef = useRef<L.Map>(null);

  // Re-center map to fit bounds if listings change
  useEffect(() => {
    if (mapRef.current && listings.length > 0) {
      const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [listings]);

  return (
    <div className="h-full w-full rounded-[1.5rem] overflow-hidden border border-border/50 bg-muted/20 z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={createPriceIcon((listing.rent / 1000).toFixed(1) + "k", listing.id === selectedId)}
            eventHandlers={{ click: () => onMarkerClick?.(listing.id) }}
          >
            <Popup className="property-popup">
              <Link to={`/property/${listing.id}`} className="block w-48">
                {listing.image ? (
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-32 bg-muted flex items-center justify-center rounded-t-lg">
                    <Home className="text-muted-foreground w-8 h-8" />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                  <p className="text-primary font-bold mt-1">₹{listing.rent}/mo</p>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
        {/* User location blue dot */}
        {userMarker && (
          <Marker position={userMarker} icon={userLocationIcon}>
            <Popup><span className="text-sm font-medium">You are here</span></Popup>
          </Marker>
        )}
        {listings.length === 0 && <ChangeView center={center} zoom={zoom} />}
      </MapContainer>
      <style>{`
        .custom-price-marker {
          background: transparent;
          border: none;
        }
        .property-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .property-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        /* Dark mode tiles styling injection */
        .dark .map-tiles {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
      `}</style>
    </div>
  );
}
