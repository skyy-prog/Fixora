import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const INDIA_CENTER = [22.9734, 78.6569];

const FitToMarkers = ({ points }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!Array.isArray(points) || points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 12);
      return;
    }

    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, points]);

  return null;
};

const GeoMap = ({ title, points = [], emptyText = "No map locations available.", height = 360 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const validPoints = useMemo(
    () =>
      (Array.isArray(points) ? points : []).filter(
        (point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lng)
      ),
    [points]
  );
  const displayPoints = useMemo(() => {
    const seenLocationCount = new Map();

    return validPoints.map((point, index) => {
      const lat = Number(point.lat);
      const lng = Number(point.lng);
      const locationKey = `${lat.toFixed(6)}:${lng.toFixed(6)}`;
      const duplicateIndex = seenLocationCount.get(locationKey) || 0;
      seenLocationCount.set(locationKey, duplicateIndex + 1);

      if (duplicateIndex === 0) {
        return {
          ...point,
          lat,
          lng,
          mapKey: point?.id || `map-point-${index}`,
        };
      }

      const angle = (duplicateIndex * 45 * Math.PI) / 180;
      const radius = 0.00035 * (Math.floor(duplicateIndex / 8) + 1);

      return {
        ...point,
        lat: lat + Math.sin(angle) * radius,
        lng: lng + Math.cos(angle) * radius,
        mapKey: `${point?.id || `map-point-${index}`}-${duplicateIndex}`,
      };
    });
  }, [validPoints]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          {isOpen ? "Close Map" : "Open Map"}
        </button>
      </div>
      {!isOpen ? (
        <div className="h-20 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-gray-500 text-sm flex items-center justify-center">
          Map hidden. Click "Open Map" to view locations.
        </div>
      ) : displayPoints.length === 0 ? (
        <div className="h-44 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-gray-500 text-sm flex items-center justify-center">
          {emptyText}
        </div>
      ) : (
        <div style={{ width: "100%", height }} className="rounded-xl overflow-hidden border border-gray-200">
          <MapContainer center={INDIA_CENTER} zoom={5} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitToMarkers points={displayPoints} />
            {displayPoints.map((point) => (
              <Marker key={point.mapKey} position={[point.lat, point.lng]}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>{point.title || "Location"}</p>
                    {point.subtitle && (
                      <p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: 12 }}>{point.subtitle}</p>
                    )}
                    {point.meta && (
                      <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 12 }}>{point.meta}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default GeoMap;
